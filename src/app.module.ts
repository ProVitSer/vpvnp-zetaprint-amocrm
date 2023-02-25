import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmocrmUsersModule } from './amocrm-users/amocrm-users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    AmocrmUsersModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
