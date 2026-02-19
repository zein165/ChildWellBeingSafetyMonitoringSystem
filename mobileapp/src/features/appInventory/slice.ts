import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {InstalledApp} from '../../types/domain';

interface AppInventoryState {
  installedApps: InstalledApp[];
  addedApps: InstalledApp[];
  removedPackageNames: string[];
}

const initialState: AppInventoryState = {
  installedApps: [],
  addedApps: [],
  removedPackageNames: [],
};

const appInventorySlice = createSlice({
  name: 'appInventory',
  initialState,
  reducers: {
    updateInventory(state, action: PayloadAction<InstalledApp[]>) {
      const next = action.payload;
      const previousPackages = new Set(state.installedApps.map(a => a.packageName));
      const nextPackages = new Set(next.map(a => a.packageName));

      state.addedApps = next.filter(app => !previousPackages.has(app.packageName));
      state.removedPackageNames = state.installedApps
        .filter(app => !nextPackages.has(app.packageName))
        .map(app => app.packageName);
      state.installedApps = next;
    },
  },
});

export const {updateInventory} = appInventorySlice.actions;
export default appInventorySlice.reducer;
