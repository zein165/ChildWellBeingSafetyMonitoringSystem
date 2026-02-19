import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TimelineEvent} from '../../types/domain';

interface TimelineState {
  events: TimelineEvent[];
}

const initialState: TimelineState = {
  events: [],
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    addEvent(state, action: PayloadAction<TimelineEvent>) {
      state.events.unshift(action.payload);
      state.events = state.events.slice(0, 1000);
    },
  },
});

export const {addEvent} = timelineSlice.actions;
export default timelineSlice.reducer;
