import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AmocrmUsersService } from './amocrm-users.service';
import { AmocrmUsersController } from './amocrm-users.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { LoggerMiddleware } from '@app/middleware/logger.middleware';
import { LoggerModule } from '@app/logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [AmocrmUsersService],
  controllers: [AmocrmUsersController],
  exports: [AmocrmUsersService],
})
export class AmocrmUsersModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AmocrmUsersController);
  }
}
