import { RuleType } from '../../enums/rule-type.enum';

export interface CreateThresholdRuleDto {
    childId: string;
    ruleType: RuleType;
    thresholdSeconds: number;
}