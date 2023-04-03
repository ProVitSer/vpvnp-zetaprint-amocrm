import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmocrmUsersModule } from './amocrm-users/amocrm-users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { AmocrmModule } from './amocrm/amocrm.module';
import { CdrModule } from './cdr/cdr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    AmocrmUsersModule,
    PrismaModule,
    LoggerModule,
    CdrModule,
    //AmocrmModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
