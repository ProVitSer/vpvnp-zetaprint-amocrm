export enum AmocrmAPIV2 {
  auth = '/private/api/auth.php?type=json',
  account = '/private/api/v2/account',
  events = '/api/v2/events/',
}

export enum AmocrmAPIV4 {
  contacts = '/api/v4/contacts',
  leads = '/api/v4/leads',
  account = '/api/v4/account',
  call = '/api/v4/calls',
  tasks = '/api/v4/tasks',
}

export enum DirectionType {
  inbound = 'inbound',
  outbound = 'outbound',
}

export enum AmocrmCallStatus {
  Message = 1,
  CallBackLater = 2,
  Absent = 3,
  Answer = 4,
  WrongNumber = 5,
  NoAnswer = 6,
  Busy = 7,
}

export enum PbxCallStatus {
  ANSWERED = 'ANSWERED',
  NOANSWER = 'NO ANSWER',
  BUSY = 'BUSY',
}

export enum ContactsOrder {
  update = 'updated_at',
  id = 'id',
}
