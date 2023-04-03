import { LoggerService } from '@app/logger/logger.service';
import { UtilsService } from '@app/utils/utils.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AmocrmV2Connection } from '../connection/amocrm-v2.connection';
import { AmocrmAPIV2 } from '../interfaces/amocrm.enum';

@Injectable()
export class AmocrmV2Service {
  constructor(private readonly amocrm: AmocrmV2Connection, private readonly logger: LoggerService, private httpService: HttpService) {}

  public async incomingCallEvent(incomingNumber: string, responsibleUserId: string): Promise<boolean> {
    try {
      await this.amocrm.auth();
      const result = await this.httpService
        .post(`${this.amocrm.amocrmApiV2Domain}${AmocrmAPIV2.events}`, this.getEventsData(incomingNumber, responsibleUserId), {
          headers: { Cookie: this.amocrm.authCookies },
        })
        .toPromise();
      return !!result.data;
    } catch (e) {
      this.logger.error(e, AmocrmV2Service.name);
      throw e;
    }
  }

  private getEventsData(incomingNumber: string, eventResponsibleUserId: string): string {
    const eventsData = JSON.stringify({
      add: [
        {
          type: 'phone_call',
          phone_number: UtilsService.formatIncomingNumber(incomingNumber),
          users: [`"${eventResponsibleUserId}"`],
        },
      ],
    });
    this.logger.info(eventsData, AmocrmV2Service.name);
    return eventsData;
  }
}
