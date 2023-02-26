import { getAmocrmV4Config } from '@app/config/amocrm-v4.config';
import { LoggerModule } from '@app/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmocrmV2Connection } from './connection/amocrm-v2.connection';
import { AmocrmV4Connection } from './connection/amocrm-v4.connection';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    {
      provide: 'Amocrm',
      useFactory: getAmocrmV4Config,
      inject: [ConfigService],
    },
    AmocrmV4Connection,
    AmocrmV2Connection,
  ],
})
export class AmocrmModule {}
