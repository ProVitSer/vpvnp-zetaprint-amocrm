import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'amocrm-js';
import { LoggerService } from '@app/logger/logger.service';
import * as path from 'path';
import { ITokenData } from 'amocrm-js/dist/interfaces/common';
import { writeFile, readFile, access } from 'fs/promises';
import { AmocrmAPIV4 } from '../interfaces/amocrm.enum';
import { INIT_AMO_ERROR, INIT_AMO_SUCCESS } from '../amocrm.constants';

@Injectable()
export class AmocrmV4Connection implements OnApplicationBootstrap {
  public amocrmClient: Client = this.amocrm;
  private tokenPath: string = this.configService.get('AMOCRM_V4_TOKEN_PATH');
  constructor(
    @Inject('Amocrm') private readonly amocrm: Client,
    private readonly configService: ConfigService,
    private readonly log: LoggerService,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.setToken();
      await this.connectionHandler();
      await this.checkAmocrmInteraction();
    } catch (e) {
      this.log.error(e, AmocrmV4Connection.name);
    }
  }

  public async getAmocrmClient() {
    return this.amocrmClient;
  }

  private async checkAmocrmInteraction() {
    try {
      const response = await this.amocrmClient.request.get(AmocrmAPIV4.account);
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
    this.amocrmClient.token.setValue(currentToken);
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
      await this.amocrmClient.request.get(AmocrmAPIV4.account);
      const tokenInit: ITokenData = this.amocrmClient.token.getValue();
      await writeFile(path.join(__dirname, this.tokenPath), JSON.stringify(tokenInit));
      return;
    } catch (e) {
      throw e;
    }
  }

  private async refreshToken(): Promise<void> {
    const token: ITokenData = await this.amocrmClient.token.refresh();
    return await writeFile(path.join(__dirname, this.tokenPath), JSON.stringify(token));
  }

  private async connectionHandler(): Promise<void> {
    this.amocrmClient.on('connection:beforeConnect', async (error: any) => {
      this.log.info(`connection:beforeConnect ${error}`, AmocrmV4Connection.name);
      await this.refreshToken();
    });

    this.amocrmClient.on('connection:newToken', async (response: any) => {
      this.log.info(`connection:newToken ${JSON.stringify(response)}`, AmocrmV4Connection.name);
      await writeFile(path.join(__dirname, this.tokenPath), JSON.stringify(response.data));
    });

    this.amocrmClient.on('connection:authError', async (error: any) => {
      this.log.error(`connection:authError ${error}`, AmocrmV4Connection.name);
      await this.refreshToken();
    });

    this.amocrmClient.on('connection:error', (error: any) => {
      this.log.error(`connection:error ${error}`, AmocrmV4Connection.name);
    });

    this.amocrmClient.on('connection:beforeRefreshToken', (response: any) => {
      this.log.info(`connection:beforeRefreshToken ${JSON.stringify(response)}`, AmocrmV4Connection.name);
    });

    return;
  }
}
