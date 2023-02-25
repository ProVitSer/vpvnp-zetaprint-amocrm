import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import 'winston-daily-rotate-file';
import { UtilsService } from '@app/utils/utils.service';
import { format } from 'winston';

@Injectable()
export class CreateLoggerService {
  constructor(private readonly configService: ConfigService) {}

  public createLogger(logName: string): winston.Logger {
    return winston.createLogger({
      level: 'info',
      defaultMeta: { logName: logName },
      format: format.combine(
        format.timestamp(),
        format.splat(),
        format.printf(({ level, context, message, timestamp }) => {
          return `[${level}] [${context}] ${timestamp} : ${message}`;
        }),
      ),
      transports: this.getTransports(logName),
    });
  }

  private getTransports(logName: string): Transport[] {
    const transports: Transport[] = [];
    if (UtilsService.isDev()) {
      transports.push(new winston.transports.Console());
    }

    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: `${this.configService.get('LOG_PATH')}`,
        filename: `%DATE%-${logName}.log`,
        datePattern: `${this.configService.get('LOG_FORMAT_DATE')}`,
        level: 'info',
        handleExceptions: true,
        json: true,
        zippedArchive: true,
        maxSize: `${this.configService.get('LOG_MAX_SIZE')}`,
        maxFiles: `${this.configService.get('LOG_MAX_FILES')}`,
      }),
    );
    return transports;
  }
}
