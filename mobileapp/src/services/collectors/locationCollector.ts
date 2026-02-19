import Geolocation from 'react-native-geolocation-service';
import {LocationPoint} from '../../types/domain';

export function captureCurrentLocation(): Promise<LocationPoint> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          capturedAt: new Date().toISOString(),
          source: 'gps',
        });
      },
      err => reject(err),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
}
