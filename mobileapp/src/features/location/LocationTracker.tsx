import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationLog } from './types';
import { processGeofence } from './locationUtils';

// Import Firebase dan EventLogger
import { ref, set } from 'firebase/database';
import { db } from '../../firebaseConfig'; 
import { logEvent } from '../../utils/EventLogger';

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
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const timeNow = new Date();

          // 1. Simpan Lokal (Di memori HP)
          const log: LocationLog = {
            latitude: lat,
            longitude: lng,
            accuracy: pos.coords.accuracy,
            timestamp: timeNow.getTime(),
          };
          const existing = await AsyncStorage.getItem(STORAGE_KEY);
          const logs: LocationLog[] = existing ? JSON.parse(existing) : [];
          logs.unshift(log);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

          // 2. Kirim Lokasi ke Firebase (Biar Peta di HP Ortu update)
          set(ref(db, 'locations/child1'), {
            name: 'Anakku',
            latitude: lat,
            longitude: lng,
            status: 'Update Otomatis 30 Detik 🟢',
            lastUpdated: timeNow.toLocaleTimeString('id-ID')
          });

          // 3. Catat ke Riwayat Aktivitas (Biar muncul di Timeline Ortu)
          logEvent('LOCATION', `Lokasi otomatis tersimpan: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);

          // 4. Proses Pagar Virtual (Geofence)
          await processGeofence(lat, lng);
        },
        err => console.log('GPS error:', err),
        { enableHighAccuracy: true }
      );
    };

    const start = async () => {
      const allowed = await requestPermission();
      if (!allowed) return;

      trackLocation(); // Ambil lokasi pertama kali saat aplikasi dibuka
      
      // Update otomatis setiap 30 detik (30000 milidetik) untuk simulasi real-time
      intervalId = setInterval(trackLocation, 10000); 
    };

    start();
    
    // Membersihkan interval saat komponen ditutup agar tidak bocor memori
    return () => intervalId && clearInterval(intervalId);
  }, []);

  return null;
};