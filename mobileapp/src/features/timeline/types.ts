export enum EventType {
  APP_USAGE = "APP_USAGE",
  LOCATION = "LOCATION",
  APP_INSTALL = "APP_INSTALL",
  APP_REMOVE = "APP_REMOVE",
}

export interface TimelineEvent {
  id: string;
  type: EventType;
  timestamp: number;
  payload: any;
}