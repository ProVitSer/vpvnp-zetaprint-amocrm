import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { Client } from 'amocrm-js';
import { AmocrmV4Connection } from '../connection/amocrm-v4.connection';
import * as path from 'path';
import { writeFile } from 'fs/promises';
import { ITokenData } from 'amocrm-js/dist/interfaces/common';

@Injectable()
export class AmocrmUpdateTokenSchedule {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly amocrmConnect: AmocrmV4Connection,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async updateAmocrmToken() {
    try {
      this.logger.info('Обновление токена Amocrm', AmocrmUpdateTokenSchedule.name);
      const amocrmClient = await this.amocrmConnect.getAmocrmClient();
      const token = await amocrmClient.token.refresh();
      return await this.update(amocrmClient, token);
    } catch (e) {
      this.logger.error(e, AmocrmUpdateTokenSchedule.name);
    }
  }

  private async update(amocrmClient: Client, token: ITokenData) {
    this.logger.info('Новый токен: ' + token, AmocrmUpdateTokenSchedule.name);
    await writeFile(path.join(__dirname, this.configService.get('AMOCRM_V4_TOKEN_PATH')), JSON.stringify(token));
    amocrmClient.token.setValue(token);
    this.logger.info('Новый токен успешно добавлен', AmocrmUpdateTokenSchedule.name);
  }
}
