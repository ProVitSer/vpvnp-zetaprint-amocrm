import { Global, Module } from '@nestjs/common';
import { PrismaZetaService, PrismaCdrService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaZetaService, PrismaCdrService],
  exports: [PrismaZetaService, PrismaCdrService],
})
export class PrismaModule {}
