import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppUsageRecord} from '../../types/domain';

interface DigitalMonitoringState {
  screenTimeEstimateMinutes: number;
  appUsage: AppUsageRecord[];
  dailySummary: {
    totalMinutes: number;
    gameMinutes: number;
    nonGameMinutes: number;
  };
}

const initialState: DigitalMonitoringState = {
  screenTimeEstimateMinutes: 0,
  appUsage: [],
  dailySummary: {
    totalMinutes: 0,
    gameMinutes: 0,
    nonGameMinutes: 0,
  },
};

const digitalMonitoringSlice = createSlice({
  name: 'digitalMonitoring',
  initialState,
  reducers: {
    setUsage(state, action: PayloadAction<AppUsageRecord[]>) {
      state.appUsage = action.payload;
      state.screenTimeEstimateMinutes = action.payload.reduce((acc, cur) => acc + cur.durationMinutes, 0);
      state.dailySummary.totalMinutes = state.screenTimeEstimateMinutes;
      state.dailySummary.gameMinutes = action.payload
        .filter(item => item.category === 'game')
        .reduce((acc, cur) => acc + cur.durationMinutes, 0);
      state.dailySummary.nonGameMinutes = state.dailySummary.totalMinutes - state.dailySummary.gameMinutes;
    },
  },
});

export const {setUsage} = digitalMonitoringSlice.actions;
export default digitalMonitoringSlice.reducer;
