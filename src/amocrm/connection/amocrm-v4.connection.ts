import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'amocrm-js';
import { LoggerService } from '@app/logger/logger.service';
import * as path from 'path';
import { ITokenData } from 'amocrm-js/dist/interfaces/common';
import { writeFile, readFile, access } from 'fs/promises';
import { AmocrmAPIV4 } from '../interfaces/amocrm.enum';
import { INIT_AMO_ERROR, INIT_AMO_SUCCESS } from '../amocrm.constants';

@Injectable()
export class AmocrmV4Connection {
  public amocrmClient: Client = this.amocrm;
  private tokenPath: string = this.configService.get('AMOCRM_V4_TOKEN_PATH');
  constructor(
    @Inject('Amocrm') private readonly amocrm: Client,
    private readonly configService: ConfigService,
    private readonly log: LoggerService,
  ) {}

  public async getAmocrmClient() {
    this.log.info(INIT_AMO_SUCCESS, AmocrmV4Connection.name);
    await this.setToken();
    this.handleConnection();
    this.checkAmocrmInteraction();
    return this.amocrm;
  }

  private async checkAmocrmInteraction() {
    try {
      const response = await this.amocrm.request.get(AmocrmAPIV4.account);
      if (!response.data.hasOwnProperty('id')) {
        this.log.error(`${INIT_AMO_ERROR} ${JSON.stringify(response)}`, AmocrmV4Connection.name);
      }
      this.log.info(INIT_AMO_SUCCESS, AmocrmV4Connection.name);
    } catch (e) {
      throw e;
    }
  }

  private async setToken() {
    const currentToken = await this.getConfigToken();
    this.amocrm.token.setValue(currentToken);
  }

  private async getConfigToken() {
    try {
      const isFileExist = await this.isAccessible(path.join(__dirname, this.tokenPath));
      if (!isFileExist) {
        await this.amocrmAuth();
      }
      const token = await readFile(path.join(__dirname, this.tokenPath));
      return JSON.parse(token.toString());
    } catch (e) {
      throw e;
    }
  }

  private async isAccessible(path: string): Promise<boolean> {
    return access(path)
      .then(() => true)
      .catch(() => false);
  }

  private async amocrmAuth(): Promise<void> {
    try {
      const authUrl = this.amocrmClient.auth.getUrl('popup');
      console.log('Вам нужно перейти по ссылке и выдать права на аккаунт, а после перезагрузить приложение', authUrl);
      await this.amocrm.request.get(AmocrmAPIV4.account);
      const tokenInit: ITokenData = this.amocrm.token.getValue();
      await writeFile(path.join(__dirname, this.tokenPath), JSON.stringify(tokenInit));
      return;
    } catch (e) {
      throw e;
    }
  }

  private async refreshToken(): Promise<void> {
    const token: ITokenData = await this.amocrm.token.refresh();
    return await writeFile(path.join(__dirname, this.tokenPath), JSON.stringify(token));
  }

  private handleConnection(): Promise<void> {
    this.amocrm.connection.on('beforeConnect', async () => {
      //this.log.info(`Подключение к Amocrm успешно`, AmocrmV4Connector.name);
    });

    this.amocrm.token.on('change', async () => {
      this.log.info('token:newToken :', AmocrmV4Connection.name);
    });

    this.amocrm.connection.on('connectionError', async (error: any) => {
      this.log.error(`connection:authError ${error}`, AmocrmV4Connection.name);
      await this.refreshToken();
    });

    this.amocrm.token.on('beforeRefresh', (response: any) => {
      this.log.info('token:beforeRefreshToken', AmocrmV4Connection.name);
    });

    this.amocrm.token.on('refresh', () => {
      this.log.info('token:refresh', AmocrmV4Connection.name);
    });

    return;
  }
}
