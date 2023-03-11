import { AmocrmUsersModule } from '@app/amocrm-users/amocrm-users.module';
import { AmocrmModule } from '@app/amocrm/amocrm.module';
import { LoggerModule } from '@app/logger/logger.module';
import { LoggerMiddleware } from '@app/middleware/logger.middleware';
import { PrismaModule } from '@app/prisma/prisma.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CdrController } from './cdr.controller';
import { CdrService } from './cdr.service';

@Module({
  imports: [LoggerModule, PrismaModule, AmocrmModule, AmocrmUsersModule],
  controllers: [CdrController],
  providers: [CdrService],
})
export class CdrModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(CdrController);
  }
}
