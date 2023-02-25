import { Module } from '@nestjs/common';
import { AmocrmUsersService } from './amocrm-users.service';
import { AmocrmUsersController } from './amocrm-users.controller';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AmocrmUsersService],
  controllers: [AmocrmUsersController],
  exports: [AmocrmUsersService],
})
export class AmocrmUsersModule {}
