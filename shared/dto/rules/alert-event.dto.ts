import { RuleType } from '../../enums/rule-type.enum';

export interface AlertEventDto {
    childId: string;
    ruleType: RuleType;
    triggeredAt: string;
    actualValueSeconds: number;
}

export interface AlertHistoryDto {
  childId: string;
  alerts: AlertEventDto[];
}