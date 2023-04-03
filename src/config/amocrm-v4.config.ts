import { EnvironmentVariables } from '@app/environment/environment.interface';
import { ConfigService } from '@nestjs/config';
import { Client } from 'amocrm-js';

export const getAmocrmV4Config = (configService: ConfigService<EnvironmentVariables>): Client => {
  return new Client({
    domain: configService.get('AMOCRM_V4_DOMAIN'),
    auth: {
      client_id: configService.get('AMOCRM_V4_CLIENT_ID'),
      client_secret: configService.get('AMOCRM_V4_CLIENT_SECRET'),
      redirect_uri: configService.get('AMOCRM_V4_REDIRECT_URL'),
      server: {
        port: configService.get('AMOCRM_V4_PORT'),
      },
    },
  });
};
