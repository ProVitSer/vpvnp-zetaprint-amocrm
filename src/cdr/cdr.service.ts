import { AmocrmUsersService } from '@app/amocrm-users/amocrm-users.service';
import { DirectionType } from '@app/amocrm/interfaces/amocrm.enum';
import { AmocrmV4Service } from '@app/amocrm/service/amocrm-v4.service';
import { LoggerService } from '@app/logger/logger.service';
import { PrismaCdrService } from '@app/prisma/prisma.service';
import { UtilsService } from '@app/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cdr } from 'prisma-cdr/generated/cdr';
import { CallType } from './cdr.enum';
import { CdrInfoWithTyp } from './cdr.interfaces';

@Injectable()
export class CdrService {
  constructor(
    private readonly logger: LoggerService,
    private prismaCdr: PrismaCdrService,
    private readonly amocrmUsersService: AmocrmUsersService,
    private readonly amocrmV4Service: AmocrmV4Service,
  ) {}

  public async processingCdr(cdrInfo: CdrInfoWithTyp): Promise<void> {
    try {
      const cdrResult = await this.sendCdrInfo(cdrInfo);
      await Promise.all(
        cdrResult.map(async (c: Cdr) => {
          const amocrmUser = await this.amocrmUsersService.findAmocrmUser({
            extensionNumber: UtilsService.replaceChannel(cdrInfo.callType === CallType.incoming ? c.dstchannel : c.channel) || '12',
          });
          await this.amocrmV4Service.sendCallInfoToCRM({
            result: c,
            amocrmId: Number(amocrmUser.amocrmId),
            direction: cdrInfo.callType === CallType.incoming ? DirectionType.inbound : DirectionType.outbound,
          });
        }),
      );
    } catch (e) {
      this.logger.error(e, CdrService.name);
    }
  }

  public async sendCdrInfo(cdrInfo: CdrInfoWithTyp): Promise<Cdr[]> {
    try {
      switch (cdrInfo.callType) {
        case CallType.incoming:
          return await this.searchIncomingCallInfoInCdr(cdrInfo.unicueid);
        case CallType.outgoing:
          return await this.searchOutgoingCallInfoInCdr(cdrInfo.unicueid);
        default:
          throw new Error(`Неизвестный вызов ${JSON.stringify(cdrInfo)}`);
      }
    } catch (e) {
      throw e;
    }
  }

  private async searchIncomingCallInfoInCdr(unicueid: string): Promise<Cdr[]> {
    return await this.prismaCdr.$queryRaw(
      Prisma.sql`
          select *
          from cdr 
          where uniqueid like ${unicueid} order by billsec DESC`,
    );
  }

  private async searchOutgoingCallInfoInCdr(unicueid: string): Promise<Cdr[]> {
    return await this.prismaCdr.$queryRaw(
      Prisma.sql`
        select *
        from cdr 
        where uniqueid like ${unicueid} and dcontext like 'from-internal'`,
    );
  }
}
