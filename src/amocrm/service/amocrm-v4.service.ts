import { LoggerService } from '@app/logger/logger.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'amocrm-js';
import { AmocrmV4Connection } from '../connection/amocrm-v4.connection';
import * as moment from 'moment';
import { AmocrmAddCallInfo, SendCallInfoToCRM } from '../interfaces/amocrm.interface';
import { CALL_DATE_SUBTRACT, CALL_STATUS_MAP, RECORD_PATH_FROMAT } from '../amocrm.constants';
import { AmocrmAPIV4 } from '../interfaces/amocrm.enum';

@Injectable()
export class AmocrmV4Service implements OnApplicationBootstrap {
  public amocrm: Client;
  private readonly recordDomain = this.configService.get('amocrm.recordDomain');

  constructor(
    private readonly amocrmConnect: AmocrmV4Connection,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  public async onApplicationBootstrap() {
    this.amocrm = await this.getAmocrmClient();
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
          .format(RECORD_PATH_FROMAT)}/${recordingfile}`,
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
