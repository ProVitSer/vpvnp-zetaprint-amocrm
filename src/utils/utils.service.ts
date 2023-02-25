import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  static isDev() {
    return process.env.NODE_ENV === 'develop';
  }

  static dataToString<T>(data: T): string | undefined | T {
    try {
      if (Array.isArray(data)) {
        return JSON.stringify(data);
      }
      switch (typeof data) {
        case 'string':
          return data;
        case 'number':
        case 'symbol':
        case 'bigint':
        case 'boolean':
        case 'function':
          return data.toString();
        case 'object':
          return JSON.stringify(data);
        default:
          return undefined;
      }
    } catch (e) {
      return data;
    }
  }
}
