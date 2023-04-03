import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateLoggerService } from './create-logger.service';
import { LoggerService } from './logger.service';

@Module({
  imports: [ConfigModule],
  providers: [LoggerService, CreateLoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
