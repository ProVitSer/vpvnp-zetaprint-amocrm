import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmocrmUsersModule } from './amocrm-users/amocrm-users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { AmocrmModule } from './amocrm/amocrm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    AmocrmUsersModule,
    PrismaModule,
    LoggerModule,
    AmocrmModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
