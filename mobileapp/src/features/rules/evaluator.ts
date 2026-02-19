import {RootState} from '../../app/store';
import {RuleThreshold} from '../../types/domain';

export interface RuleEvaluation {
  rule: RuleThreshold;
  passed: boolean;
  actual: number;
}

export function evaluateRules(state: RootState): RuleEvaluation[] {
  const gameTime = state.digitalMonitoring.dailySummary.gameMinutes;
  const screenTime = state.digitalMonitoring.dailySummary.totalMinutes;
  const outsideDuration = state.location.outsideDurationMinutes;

  return state.rules.thresholds.map(rule => {
    const actual =
      rule.metric === 'gameTimeMinutes'
        ? gameTime
        : rule.metric === 'screenTimeMinutes'
          ? screenTime
          : outsideDuration;

    const passed = rule.operator === 'gt' ? actual > rule.value : actual >= rule.value;

    return {rule, passed, actual};
  });
}
