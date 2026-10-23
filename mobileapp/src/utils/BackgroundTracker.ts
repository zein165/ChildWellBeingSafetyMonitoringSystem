import notifee from '@notifee/react-native';
import Geolocation from 'react-native-geolocation-service';
import { ref, set } from 'firebase/database';
import { db } from '../firebaseConfig';
import { evaluateRules } from './RuleEngine';

let backgroundInterval: NodeJS.Timeout | null = null;

export const startBackgroundTracking = async () => {
  // 1. Buat Channel Notifikasi Khusus Service
  const channelId = await notifee.createChannel({
    id: 'tracking_service',
    name: 'Pemantauan Latar Belakang',
  });

  // 2. Daftarkan Foreground Service ke Android
  notifee.registerForegroundService((notification) => {
    return new Promise(() => {
      // Loop pelacakan berulang setiap 15 detik di latar belakang
      backgroundInterval = setInterval(() => {
        Geolocation.getCurrentPosition(
          (position) => {
            const currentLat = position.coords.latitude;
            const currentLng = position.coords.longitude;
            const timeNow = new Date().toLocaleTimeString();

            // Kirim lokasi ke Firebase
            set(ref(db, 'locations/child1'), {
              name: 'Anakku',
              latitude: currentLat,
              longitude: currentLng,
              status: 'Terpantau 🛡️ (Background)',
              lastUpdated: timeNow
            });

            // Tetap cek jam malam & geofencing meski HP mati layar
            evaluateRules();
          },
          (error) => console.log('Background GPS Error:', error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }, 100000); 
    });
  });

  // 3. Tampilkan Notifikasi Permanen di HP Anak
  await notifee.displayNotification({
    title: 'Perlindungan Aktif 🛡️',
    body: 'Aplikasi sedang menjaga dan memantau lokasimu.',
    android: {
      channelId,
      asForegroundService: true, // INI KUNCINYA: Memberitahu Android jangan bunuh app ini
      ongoing: true, // Tidak bisa di-swipe
      smallIcon: 'ic_launcher',
    },
  });
};

export const stopBackgroundTracking = async () => {
  if (backgroundInterval) clearInterval(backgroundInterval);
  await notifee.stopForegroundService();
};