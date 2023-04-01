import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  static isDev() {
    return process.env.NODE_ENV === 'develop';
  }

  static normalizePhoneNumber(phoneNumber: string): string {
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.startsWith('8')) {
      return '7' + digits.slice(1);
    }

    if (digits.startsWith('+7')) {
      return digits.slice(1);
    }

    return digits;
  }

  static sleep(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  static formatIncomingNumber(number: string): string {
    return number.length == 10 ? number : number.substr(number.length - 10);
  }

  static replaceChannel(channel: string): string {
    return channel.replace(/(PJSIP\/)(\d{3})-(.*)/, `$2`);
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
