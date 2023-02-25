import { UtilsService } from '@app/utils/utils.service';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { CreateLoggerService } from './create-logger.service';
import { DEFAULT_LOG_NAME } from './logger.constants';
import { LoggerInterface } from './logger.interface';

@Injectable()
export class LoggerService implements LoggerInterface {
  loggers = new Map<string, winston.Logger>();
  constructor(private readonly createLogService: CreateLoggerService) {}

  public getLogger(logName: string): winston.Logger {
    if (!this.loggers.has(logName)) {
      this.loggers.set(logName, this.createLogService.createLogger(logName));
    }
    return this.loggers.get(logName);
  }

  public info(logMessage: any, context: string, logName: string = DEFAULT_LOG_NAME): void {
    const message = UtilsService.dataToString<any>(logMessage);
    const logger = this.getLogger(logName);
    logger.info(message, { context: `${context}` });
  }

  public error(logMessage: any, context: string, logName: string = DEFAULT_LOG_NAME): void {
    const message = UtilsService.dataToString<any>(logMessage);
    const logger = this.getLogger(logName);
    logger.error(message, { context: `${context}` });
  }
}
