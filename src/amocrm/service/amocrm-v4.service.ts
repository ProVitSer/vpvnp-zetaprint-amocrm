import { LoggerService } from '@app/logger/logger.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'amocrm-js';
import { AmocrmV4Connection } from '../connection/amocrm-v4.connection';
import * as moment from 'moment';
import {
  ActionsInAmocrmData,
  AmocrmAddCallInfo,
  AmocrmCreateContact,
  AmocrmCreateContactResponse,
  AmocrmCreateLead,
  AmocrmCreateLeadResponse,
  AmocrmGetContactsRequest,
  AmocrmGetContactsResponse,
  CreateContactData,
  CreateLeadData,
  SendCallInfoToCRM,
} from '../interfaces/amocrm.interface';
import {
  AMOCRM_CONTACT_ENUM_ID,
  AMOCRM_CONTACT_ID,
  AMOCRM_CREATE_LEAD_STATUS_ID,
  CALL_DATE_SUBTRACT,
  CALL_STATUS_MAP,
  RECORD_PATH_FROMAT,
} from '../amocrm.constants';
import { AmocrmAPIV4 } from '../interfaces/amocrm.enum';
import { UtilsService } from '@app/utils/utils.service';

@Injectable()
export class AmocrmV4Service implements OnApplicationBootstrap {
  public amocrm: Client;
  private readonly recordDomain = this.configService.get('RECORD_DOMAIN');

  constructor(
    private readonly amocrmConnect: AmocrmV4Connection,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  public async onApplicationBootstrap() {
    this.amocrm = await this.getAmocrmClient();
  }

  public async actionsInAmocrm({ incomingNumber, amocrmId }: ActionsInAmocrmData): Promise<void> {
    try {
      const resultSearchContact = await this.searchContact(incomingNumber);
      if (resultSearchContact == false) {
        const contactsId = await this.createContact({ incomingNumber, amocrmId });
        await this.createLead({ incomingNumber, contactsId, amocrmId });
      }
    } catch (e) {
      throw e;
    }
  }

  public async searchContact(incomingNumber: string): Promise<boolean> {
    try {
      const info: AmocrmGetContactsRequest = {
        query: UtilsService.formatIncomingNumber(incomingNumber),
      };
      const result = (await this.amocrm.request.get<AmocrmGetContactsResponse>(AmocrmAPIV4.contacts, info))?.data;
      this.logger.info(`Результат поиска контакта ${incomingNumber}: ${JSON.stringify(result)}`, AmocrmV4Service.name);
      return !!result?._embedded ? true : false;
    } catch (e) {
      throw `${e}: ${incomingNumber}`;
    }
  }

  public async createContact({ incomingNumber, amocrmId }: CreateContactData): Promise<number> {
    try {
      const contact: AmocrmCreateContact = {
        name: `Новый клиент ${incomingNumber}`,
        responsible_user_id: amocrmId,
        created_by: AMOCRM_CONTACT_ID,
        custom_fields_values: [
          {
            field_id: AMOCRM_CONTACT_ID,
            field_name: 'Телефон',
            field_code: 'PHONE',
            values: [
              {
                value: incomingNumber,
                enum_id: AMOCRM_CONTACT_ENUM_ID,
                enum_code: 'MOB',
              },
            ],
          },
        ],
      };
      this.logger.info(contact, AmocrmV4Service.name);
      const apiResponse = await this.amocrm.request.post<AmocrmCreateContactResponse>(AmocrmAPIV4.contacts, [contact]);
      return apiResponse.data._embedded.contacts[0].id;
    } catch (e) {
      throw `${e}: ${incomingNumber}`;
    }
  }

  public async createLead({ incomingNumber, amocrmId, contactsId }: CreateLeadData): Promise<AmocrmCreateLeadResponse> {
    try {
      const lead: AmocrmCreateLead = {
        name: `Новый клиент ${incomingNumber}`,
        responsible_user_id: amocrmId,
        created_by: AMOCRM_CONTACT_ID,
        status_id: AMOCRM_CREATE_LEAD_STATUS_ID,
        _embedded: {
          contacts: [
            {
              id: contactsId,
            },
          ],
        },
      };

      this.logger.info(lead, AmocrmV4Service.name);
      const apiResponse = await this.amocrm.request.post<AmocrmCreateLeadResponse>(AmocrmAPIV4.leads, [lead]);
      return apiResponse.data;
    } catch (e) {
      throw `${e}: ${incomingNumber} ${contactsId}`;
    }
  }

  public async sendCallInfoToCRM(data: SendCallInfoToCRM): Promise<void> {
    try {
      const { result, direction, amocrmId } = data;
      const { uniqueid, src, dst, calldate, billsec, disposition, recordingfile } = result;
      const date = moment(calldate).subtract(CALL_DATE_SUBTRACT, 'hour').unix();

      const callInfo: AmocrmAddCallInfo = {
        direction: direction,
        uniq: uniqueid,
        duration: billsec,
        source: 'amo_custom_widget',
        link: `${this.recordDomain}/rec/monitor/${moment(calldate)
          .subtract(CALL_DATE_SUBTRACT, 'hour')
          .format(RECORD_PATH_FROMAT)}/${recordingfile.replace(/.wav/i, '.mp3')}`,
        phone: src !== undefined ? src : dst,
        call_result: '',
        call_status: CALL_STATUS_MAP[disposition],
        responsible_user_id: amocrmId,
        created_by: amocrmId,
        updated_by: amocrmId,
        created_at: date,
        updated_at: date,
      };

      this.logger.info(callInfo, AmocrmV4Service.name);
      const apiResponse = await this.amocrm.request.post(AmocrmAPIV4.call, [callInfo]);
      this.logger.info(apiResponse.data, AmocrmV4Service.name);
      return;
    } catch (e) {
      throw e;
    }
  }
  private async getAmocrmClient(): Promise<Client> {
    return await this.amocrmConnect.getAmocrmClient();
  }
}
