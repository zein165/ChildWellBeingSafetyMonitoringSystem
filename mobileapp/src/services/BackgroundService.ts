import BackgroundJob from 'react-native-background-actions';

// Fungsi penunda (timer)
const sleep = (time: number) => new Promise((resolve) => setTimeout(() => resolve(''), time));

// Ini adalah fungsi utama yang akan terus berputar di latar belakang
const backgroundTask = async (taskDataArguments: any) => {
    const { delay } = taskDataArguments;
    
    await new Promise(async (resolve) => {
        // Looping akan terus berjalan selama Foreground Service aktif
        while (BackgroundJob.isRunning()) {
            console.log('Memantau aktivitas HP anak...');
            
            // ----------------------------------------------------
            // BOS BISA MASUKKAN LOGIKA UPDATE FIREBASE DI SINI
            // ----------------------------------------------------

            await sleep(delay);
        }
    });
};

// Pengaturan tampilan notifikasi Foreground Service
const options = {
    taskName: 'PemantauanAnak',
    taskTitle: 'Sistem Pemantauan Aktif',
    taskDesc: 'Aplikasi berjalan di latar belakang untuk keamanan anak.',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#007FFF', // Warna ikon notifikasi
    parameters: {
        delay: 10000, // Interval pemantauan (contoh: 10 detik)
    },
};

// Fungsi untuk menyalakan service (bisa dipanggil dari tombol di layar React Native)
export const startBackgroundService = async () => {
    try {
        console.log('Menjalankan background service...');
        await BackgroundJob.start(backgroundTask, options);
    } catch (e) {
        console.error('Gagal menjalankan service:', e);
    }
};

// Fungsi untuk mematikan service
export const stopBackgroundService = async () => {
    await BackgroundJob.stop();
};