import { Body, Controller, Post, Res } from '@nestjs/common';
import { CdrService } from './cdr.service';
import { Response } from 'express';
import { CdrInfo } from './interfaces/cdr.interfaces';
import { CallType } from './interfaces/cdr.enum';

@Controller('cdr')
export class CdrController {
  constructor(private cdrService: CdrService) {}

  @Post('outgoing')
  async createOutgoingCdr(@Res() res: Response, @Body() info: CdrInfo) {
    this.cdrService.processingCdr({
      ...info,
      callType: CallType.outgoing,
    });
    return res.sendStatus(200);
  }

  @Post('incoming')
  async createIncomingCdr(@Res() res: Response, @Body() info: CdrInfo) {
    this.cdrService.processingCdr({
      ...info,
      callType: CallType.incoming,
    });
    return res.sendStatus(200);
  }
}
