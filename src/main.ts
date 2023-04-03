import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaZetaService, PrismaCdrService } from './prisma/prisma.service';
import { EnvironmentVariables } from './environment/environment.interface';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const prismaZetaService = app.get(PrismaZetaService);
  await prismaZetaService.enableShutdownHooks(app);
  const prismaCdrService = app.get(PrismaCdrService);
  await prismaCdrService.enableShutdownHooks(app);
  await app.listen(app.get(ConfigService<EnvironmentVariables>).get('PORT'));
}
bootstrap();
