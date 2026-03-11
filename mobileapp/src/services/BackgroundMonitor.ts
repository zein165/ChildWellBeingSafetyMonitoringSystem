import BackgroundService from 'react-native-background-actions';
import { getRulesSettings } from './StorageService';
import { triggerLocalAlert } from './NotificationService';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

// Tugas yang akan terus berulang di latar belakang
const backgroundTask = async (taskDataArguments: any) => {
  const { delay } = taskDataArguments;
  
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log('👀 [BACKGROUND] Memantau aktivitas anak...');
      
      // Mengambil aturan terbaru dari Settings Screen
      const rules = await getRulesSettings();
      
      // --- SIMULASI CEK LOKASI/GAME DI LATAR BELAKANG ---
      // Nantinya logika GPS asli dan pemantauan App diletakkan di sini.
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const [curfewHour, curfewMin] = rules.curfewTime.split(':').map(Number);

      // Cek Jam Malam secara real-time
      if (currentHour > curfewHour || (currentHour === curfewHour && currentMin >= curfewMin)) {
         console.log('🚨 [BACKGROUND] Pelanggaran jam malam terdeteksi!');
         // Trigger Notifikasi walau app ditutup!
         // await triggerLocalAlert('Peringatan Latar Belakang', `Anak terdeteksi aktif di luar jam malam (${rules.curfewTime})!`);
      }

      // Tunggu beberapa detik/menit sebelum mengecek lagi
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'SafetyMonitor',
  taskTitle: 'Sistem Pemantauan Aktif',
  taskDesc: 'Aplikasi sedang mengawasi perangkat anak.',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#0D6EFD',
  parameters: {
    delay: 10000, // Cek setiap 10 detik (Bisa diganti jadi 60000 untuk 1 menit)
  },
};

export const startBackgroundMonitor = async () => {
  if (!BackgroundService.isRunning()) {
    await BackgroundService.start(backgroundTask, options);
    console.log('✅ Background Monitor Dinyalakan!');
  }
};

export const stopBackgroundMonitor = async () => {
  await BackgroundService.stop();
  console.log('🛑 Background Monitor Dimatikan!');
};