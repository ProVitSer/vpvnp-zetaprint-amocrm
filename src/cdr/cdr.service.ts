import { AmocrmUsersService } from '@app/amocrm-users/amocrm-users.service';
import { DirectionType } from '@app/amocrm/interfaces/amocrm.enum';
import { AmocrmV4Service } from '@app/amocrm/service/amocrm-v4.service';
import { LoggerService } from '@app/logger/logger.service';
import { PrismaCdrService } from '@app/prisma/prisma.service';
import { UtilsService } from '@app/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../prisma-cdr/generated/cdr';
import { Cdr } from 'prisma-cdr/generated/cdr';
import { NO_USE_EXTENSION } from './cdr.constants';
import { CallType } from './interfaces/cdr.enum';
import { CdrInfoWithType } from './interfaces/cdr.interfaces';
import { AMOCRM_ADMIN_ID } from '@app/amocrm/amocrm.constants';

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
      await UtilsService.sleep(10000);
      const cdrResult = await this.getCdrInfo(cdrInfo);
      if (cdrResult.length == 0) return;

      for (const c of cdrResult) {
        await UtilsService.sleep(500);
        if (NO_USE_EXTENSION.includes(c?.dst || c?.src)) return;
        await this.actionsInAmocrm(cdrInfo, c);
      }
    } catch (e) {
      this.logger.error(e, CdrService.name);
    }
  }

  private async getAmocrmId(cdrInfo: CdrInfoWithType, c: Cdr): Promise<number> {
    this.logger.info(UtilsService.replaceChannel(cdrInfo.callType === CallType.incoming ? c.dstchannel : c.channel), CdrService.name);

    const amocrmUsers = await this.amocrmUsersService.findAmocrmUser({
      extensionNumber: UtilsService.replaceChannel(cdrInfo.callType === CallType.incoming ? c.dstchannel : c.channel),
    });
    this.logger.info(amocrmUsers?.amocrmId, CdrService.name);
    return (!!amocrmUsers?.amocrmId) ? Number(amocrmUsers?.amocrmId): Number(AMOCRM_ADMIN_ID);
  }

  private async actionsInAmocrm(cdrInfo: CdrInfoWithType, c: Cdr): Promise<void> {
    try {
      const amocrmId = await this.getAmocrmId(cdrInfo, c);
      if (cdrInfo.callType === CallType.incoming) await this.amocrmV4Service.actionsInAmocrm({ incomingNumber: c.src, amocrmId: amocrmId });
  
      return await this.amocrmV4Service.sendCallInfoToCRM({
        result: c,
        amocrmId: amocrmId,
        direction: cdrInfo.callType === CallType.incoming ? DirectionType.inbound : DirectionType.outbound,
      });
    }catch(e){
      throw e;
    }
  }

  public async getCdrInfo(cdrInfo: CdrInfoWithType): Promise<Cdr[]> {
    try {
      switch (cdrInfo.callType) {
        case CallType.incoming:
          return await this.searchIncomingGroupCallInfoInCdr(cdrInfo.uniqueid);
        case CallType.outgoing:
          return await this.searchOutgoingCallInfoInCdr(cdrInfo.uniqueid);
        default:
          throw new Error(`Неизвестный вызов ${JSON.stringify(cdrInfo)}`);
      }
    } catch (e) {
      throw e;
    }
  }

  private async searchIncomingCallInfoInCdr(uniqueid: string): Promise<Cdr[]> {
    return await this.prismaCdr.$queryRaw(
      Prisma.sql`
          select *
          from cdr 
          where uniqueid like ${uniqueid} order by billsec DESC`,
    );
  }

  private async searchIncomingGroupCallInfoInCdr(uniqueid: string): Promise<Cdr[]> {
    return await this.prismaCdr.$queryRaw`
      select calldate, src, dcontext, dstchannel, billsec, disposition, uniqueid, recordingfile
      from cdr 
      where uniqueid like ${uniqueid} and disposition = 'ANSWERED' order by sequence desc limit 1`
  }

  private async searchOutgoingCallInfoInCdr(uniqueid: string): Promise<Cdr[]> {
    return await this.prismaCdr.$queryRaw`
      select calldate, dst, channel, dcontext, billsec, disposition, uniqueid, recordingfile
      from cdr 
      where uniqueid like ${uniqueid} and dcontext like 'from-internal'`
  }
}
