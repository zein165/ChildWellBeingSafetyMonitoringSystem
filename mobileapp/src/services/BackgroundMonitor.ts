import { PermissionsAndroid, Platform } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { getRulesSettings } from './StorageService';
import { triggerLocalAlert } from './NotificationService';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(resolve, time));

// Tugas yang akan terus berulang di latar belakang
const backgroundTask = async (taskDataArguments: any) => {
  const { delay } = taskDataArguments;
  
  await new Promise<void>(async (resolve) => {
    while (BackgroundService.isRunning()) {
      console.log('👀 [BACKGROUND] Memantau aktivitas anak...');
      
      try {
        // Mengambil aturan terbaru dari Settings Screen
        const rules = await getRulesSettings();
        
        // Pastikan rules dan jam malamnya ada sebelum dicek
        if (rules && rules.curfewTime) {
          const now = new Date();
          const currentHour = now.getHours();
          const currentMin = now.getMinutes();
          const [curfewHour, curfewMin] = rules.curfewTime.split(':').map(Number);

          // Cek Jam Malam secara real-time
          if (currentHour > curfewHour || (currentHour === curfewHour && currentMin >= curfewMin)) {
             console.log('🚨 [BACKGROUND] Pelanggaran jam malam terdeteksi!');
             // Aktifkan baris di bawah ini jika NotificationService sudah siap
             // await triggerLocalAlert('Peringatan!', `Anak terdeteksi aktif di luar jam malam (${rules.curfewTime})!`);
          }
        }
      } catch (error) {
        console.error('⚠️ [BACKGROUND] Error saat membaca aturan:', error);
      }

      // Tunggu sebelum mengecek lagi
      await sleep(delay);
    }
    
    // Selesaikan promise saat service dihentikan
    resolve();
  });
};

const options = {
  taskName: 'SafetyMonitor',
  taskTitle: 'Sistem Pemantauan Aktif',
  taskDesc: 'Aplikasi sedang mengawasi perangkat anak.',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap', // Pastikan icon ini ada di folder android/app/src/main/res/mipmap
  },
  color: '#0D6EFD',
  parameters: {
    delay: 10000, // Cek setiap 10 detik
  },
};

export const startBackgroundMonitor = async () => {
  try {
    console.log('⏳ Menyiapkan Background Service...');

    // 🔥 CEK DAN MINTA IZIN NOTIFIKASI UNTUK ANDROID 13+
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('⚠️ Izin notifikasi ditolak! Background service dibatalkan agar tidak crash.');
        return; 
      }
    }

    if (!BackgroundService.isRunning()) {
      await BackgroundService.start(backgroundTask, options);
      console.log('✅ Background Monitor Dinyalakan!');
    }
  } catch (e) {
    // Dengan try-catch ini, aplikasi tidak akan force close!
    console.error('❌ Gagal menyalakan Background Monitor:', e);
  }
};

export const stopBackgroundMonitor = async () => {
  try {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
      console.log('🛑 Background Monitor Dimatikan!');
    }
  } catch (e) {
    console.error('❌ Gagal mematikan Background Monitor:', e);
  }
};