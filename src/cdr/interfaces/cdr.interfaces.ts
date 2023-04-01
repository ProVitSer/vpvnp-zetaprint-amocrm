import { CallType } from './cdr.enum';

export interface CdrInfo {
  exten: string;
  uniqueid: string;
  extensionNumber: string;
  billsec: string;
  disposition: string;
  startCall: string;
  endCall: string;
}

export interface CdrInfoWithType extends CdrInfo {
  callType: CallType;
}
