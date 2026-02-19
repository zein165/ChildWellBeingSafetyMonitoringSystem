import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RuleThreshold, TimelineEvent} from '../../types/domain';

interface RulesState {
  thresholds: RuleThreshold[];
  alertHistory: TimelineEvent[];
}

const initialState: RulesState = {
  thresholds: [
    {
      id: 'rule-game-over-120',
      name: 'Game time > 2 hours/day',
      enabled: true,
      metric: 'gameTimeMinutes',
      operator: 'gt',
      value: 120,
    },
  ],
  alertHistory: [],
};

const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    setThresholds(state, action: PayloadAction<RuleThreshold[]>) {
      state.thresholds = action.payload;
    },
    addAlert(state, action: PayloadAction<TimelineEvent>) {
      state.alertHistory.unshift(action.payload);
      state.alertHistory = state.alertHistory.slice(0, 500);
    },
  },
});

export const {setThresholds, addAlert} = rulesSlice.actions;
export default rulesSlice.reducer;
