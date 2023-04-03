import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmocrmAPIV2 } from '../interfaces/amocrm.enum';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { AmocrmAccountV2Response } from '../interfaces/amocrm.interface';

@Injectable()
export class AmocrmV2Connection {
  public readonly amocrmApiV2Domain = this.configService.get('AMOCRM_V2_DOMAIN');
  public authCookies: string[];
  constructor(private readonly configService: ConfigService, private httpService: HttpService) {}

  public async auth(): Promise<void> {
    try {
      const isAuth = await this.checkAuth();
      if (!isAuth) return await this.authAmocrm();
    } catch (e) {
      throw e;
    }
  }

  private async checkAuth(): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.httpService.get<AmocrmAccountV2Response>(`${this.amocrmApiV2Domain}${AmocrmAPIV2.account}`).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      return !!result.data.name;
    } catch (e) {
      throw e;
    }
  }

  private async authAmocrm(): Promise<void> {
    try {
      const body = {
        USER_LOGIN: this.configService.get('AMOCRM_V2_LOGIN'),
        USER_HASH: this.configService.get('AMOCRM_V2_HASH'),
      };
      const result = await firstValueFrom(
        this.httpService.post(`${this.amocrmApiV2Domain}${AmocrmAPIV2.auth}`, body).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      if (!!result.status && !!result.headers['set-cookie'] && result.status == HttpStatus.OK) {
        this.authCookies = result.headers['set-cookie'];
      } else {
        throw String(result);
      }
      return;
    } catch (e) {
      throw e;
    }
  }
}
