import { AmocrmUsersService } from '@app/amocrm-users/amocrm-users.service';
import { DirectionType } from '@app/amocrm/interfaces/amocrm.enum';
import { AmocrmV4Service } from '@app/amocrm/service/amocrm-v4.service';
import { LoggerService } from '@app/logger/logger.service';
import { PrismaCdrService } from '@app/prisma/prisma.service';
import { UtilsService } from '@app/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cdr } from 'prisma-cdr/generated/cdr';
import { ADMIN_EXTENSION, NO_USE_EXTENSION } from './cdr.constants';
import { CallType } from './interfaces/cdr.enum';
import { CdrInfoWithType } from './interfaces/cdr.interfaces';

@Injectable()
export class CdrService {
  constructor(
    private readonly logger: LoggerService,
    private prismaCdr: PrismaCdrService,
    private readonly amocrmUsersService: AmocrmUsersService,
    private readonly amocrmV4Service: AmocrmV4Service,
  ) {}

  public async processingCdr(cdrInfo: CdrInfoWithType): Promise<void> {
    try {
      const cdrResult = await this.getCdrInfo(cdrInfo);
      if (cdrResult.length == 0) return;
      await Promise.all(
        cdrResult.map(async (c: Cdr) => {
          if (NO_USE_EXTENSION.includes(c?.dst)) return;
          await this.actionsInAmocrm(cdrInfo, c);
        }),
      );
    } catch (e) {
      this.logger.error(e, CdrService.name);
    }
  }

  private async getAmocrmId(cdrInfo: CdrInfoWithType, c: Cdr): Promise<number> {
    const { amocrmId } = await this.amocrmUsersService.findAmocrmUser({
      extensionNumber: UtilsService.replaceChannel(cdrInfo.callType === CallType.incoming ? c.dstchannel : c.channel) || ADMIN_EXTENSION,
    });
    return Number(amocrmId);
  }

  private async actionsInAmocrm(cdrInfo: CdrInfoWithType, c: Cdr): Promise<void> {
    const amocrmId = await this.getAmocrmId(cdrInfo, c);

    if (cdrInfo.callType === CallType.incoming) await this.amocrmV4Service.actionsInAmocrm({ incomingNumber: c.src, amocrmId: amocrmId });

    return await this.amocrmV4Service.sendCallInfoToCRM({
      result: c,
      amocrmId: amocrmId,
      direction: cdrInfo.callType === CallType.incoming ? DirectionType.inbound : DirectionType.outbound,
    });
  }

  public async getCdrInfo(cdrInfo: CdrInfoWithType): Promise<Cdr[]> {
    try {
      switch (cdrInfo.callType) {
        case CallType.incoming:
          return await this.searchIncomingGroupCallInfoInCdr(cdrInfo.unicueid);
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

  private async searchIncomingGroupCallInfoInCdr(unicueid: string): Promise<Cdr[]> {
    return await this.prismaCdr.$queryRaw(
      Prisma.sql`
          select *
          from cdr 
          where uniqueid like ${unicueid} and disposition = 'ANSWERED' order by sequence desc limit 1`,
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
