import {configureStore} from '@reduxjs/toolkit';
import digitalMonitoringReducer from '../features/digitalMonitoring/slice';
import appInventoryReducer from '../features/appInventory/slice';
import locationReducer from '../features/location/slice';
import timelineReducer from '../features/timeline/slice';
import rulesReducer from '../features/rules/slice';

export const store = configureStore({
  reducer: {
    digitalMonitoring: digitalMonitoringReducer,
    appInventory: appInventoryReducer,
    location: locationReducer,
    timeline: timelineReducer,
    rules: rulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
