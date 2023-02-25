import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmocrmUsersModule } from './amocrm-users/amocrm-users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    AmocrmUsersModule,
    PrismaModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
