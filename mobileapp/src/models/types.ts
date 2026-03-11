// Output Data D1: EventType, Payload, Timestamp
export type EventType = 'USAGE' | 'LOCATION' | 'ALERT';

export interface AppEvent {
  id: string;
  eventType: EventType;
  payload: any; // Bebas, contoh: { app: 'Game', duration: 120 }
  timestamp: number;
}

// Rule Schema D2 (JSON)
export interface RuleSchema {
  id: string;
  targetEventType: EventType;
  condition: {
    field: string;
    operator: '>' | '<' | '==' | 'OutsideAfter';
    value: any;
  };
  message: string;
}