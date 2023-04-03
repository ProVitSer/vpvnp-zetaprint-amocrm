import winston from 'winston';

export interface LoggerInterface {
  loggers: Map<string, winston.Logger>;
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  getLogger(logName: string): winston.Logger;
}
