import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationLog } from './types';

import { processGeofence } from './locationUtils';

const STORAGE_KEY = '@location_logs';

export const LocationTracker = () => {
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const requestPermission = async () => {

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    const trackLocation = async () => {
      Geolocation.getCurrentPosition(
        async pos => {
          const log: LocationLog = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: new Date().getTime(),
          };

          const existing = await AsyncStorage.getItem(STORAGE_KEY);
          const logs: LocationLog[] = existing ? JSON.parse(existing) : [];

          logs.unshift(log);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));


          await processGeofence(pos.coords.latitude, pos.coords.longitude);
        },
        err => console.log('GPS error:', err),
        { enableHighAccuracy: true },
      );
    };

    const start = async () => {

      const allowed = await requestPermission();
      if (!allowed) {
        return;
      }

      trackLocation();
      intervalId = setInterval(trackLocation, 300000); // 5 menit
    };

    start();
    return () => intervalId && clearInterval(intervalId);
  }, []);

  return null;
};
