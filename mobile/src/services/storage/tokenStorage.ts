import * as Keychain from 'react-native-keychain';

import { STORAGE_KEYS } from '../../shared/constants/storage';

import { storageService } from './storageService';

export const tokenStorage = {
  setAccessToken: async (token: string) => {
    await storageService.set(STORAGE_KEYS.TOKEN, token);
  },

  getAccessToken: async () => {
    return await storageService.get(STORAGE_KEYS.TOKEN);
  },

  removeAccessToken: async () => {
    await storageService.remove(STORAGE_KEYS.TOKEN);
  },

  setRefreshToken: async (token: string) => {
    await Keychain.setGenericPassword('refresh', token);
  },

  getRefreshToken: async () => {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  },

  removeRefreshToken: async () => {
    await Keychain.resetGenericPassword();
  },
};
