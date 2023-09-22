import { AmocrmCallStatus, PbxCallStatus } from './interfaces/amocrm.enum';

export const INIT_AMO_ERROR = 'Ошибка подключения к Amocrm';
export const INIT_AMO_SUCCESS = 'Подключение к Amocrm успешно';
export const CALL_DATE_SUBTRACT = 3;
export const RECORD_PATH_FROMAT = 'YYYY/MM/DD';
export const AMOCRM_CONTACT_ID = 214469;
export const AMOCRM_CONTACT_ENUM_ID = 420513;
export const AMOCRM_ADMIN_ID = 5890546;
export const AMOCRM_LEAD_STATUS_ID = 31810000;
export const AMOCRM_CREATE_LEAD_STATUS_ID = 34982632;

export const CUSTOM_FIELDS_VALUES = "Заявка маркетинг";
export const CUSTOM_FIELD_NAME = "Источник";
export const CUSTOM_FIELD_TYPE = "select";
export const MARKETING_FIELD_ID = 714745;
export const MARKETING_ENUM_ID = 1629591;
export const MARKETING_STATUS_ID = 54992354;
export const MARKETING_PIPELINE_ID = 4513789;


export const CALL_STATUS_MAP: { [code in PbxCallStatus]: AmocrmCallStatus } = {
  [PbxCallStatus.ANSWERED]: AmocrmCallStatus.Answer,
  [PbxCallStatus.NOANSWER]: AmocrmCallStatus.NoAnswer,
  [PbxCallStatus.BUSY]: AmocrmCallStatus.Busy,
};
