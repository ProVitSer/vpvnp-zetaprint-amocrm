import { Cdr } from 'prisma-cdr/generated/cdr';
import { AmocrmCallStatus, DirectionType } from './amocrm.enum';

export interface AmocrmAccountV2Response {
  id: number;
  name: string;
  subdomain: string;
  [key: string]: any;
}

export interface SendCallInfoToCRM {
  result: Cdr;
  amocrmId: number;
  direction: DirectionType;
}

export interface AmocrmAddCallInfoResponse {
  _total_items: number;
  errors: any[];
  _embedded: {
    calls: [
      {
        id: number;
        entity_id: number;
        entity_type: string;
        account_id: number;
        request_id: string;
        _embedded: {
          entity: {
            id: number;
            _links: {
              self: {
                href?: string;
              };
            };
          };
        };
      },
    ];
  };
}

export interface AmocrmAddCallInfo {
  direction: DirectionType;
  uniq?: string;
  duration: number;
  source: string;
  link?: string;
  phone: string;
  call_result?: string;
  call_status?: AmocrmCallStatus;
  responsible_user_id: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  request_id?: string;
}
