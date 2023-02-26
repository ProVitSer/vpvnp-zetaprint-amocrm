import { HttpModuleOptions } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export const getAmocrmV2Config = async (configService: ConfigService): Promise<HttpModuleOptions> => {
  return {
    headers: {
      'User-Agent': 'ZetaPbxWidget/1.0.0',
      'Content-Type': 'application/json-rpc; charset=utf-8',
    },
    timeout: 5000,
    maxRedirects: 5,
    validateStatus: () => true,
  };
};
