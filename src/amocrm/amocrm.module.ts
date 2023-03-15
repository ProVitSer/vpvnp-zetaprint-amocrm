import { getAmocrmV2Config } from '@app/config/amocrm-v2.config';
import { getAmocrmV4Config } from '@app/config/amocrm-v4.config';
import { LoggerModule } from '@app/logger/logger.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AmocrmV2Connection } from './connection/amocrm-v2.connection';
import { AmocrmV4Connection } from './connection/amocrm-v4.connection';
import { AmocrmUpdateTokenSchedule } from './schedule/update-token';
import { AmocrmV2Service } from './service/amocrm-v2.service';
import { AmocrmV4Service } from './service/amocrm-v4.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    LoggerModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getAmocrmV2Config,
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'Amocrm',
      useFactory: getAmocrmV4Config,
      inject: [ConfigService],
    },
    AmocrmV4Connection,
    AmocrmV2Connection,
    AmocrmUpdateTokenSchedule,
    AmocrmV2Service,
    AmocrmV4Service,
  ],
  exports: [AmocrmV2Service, AmocrmV4Service],
})
export class AmocrmModule {}
