import { getInstalledApps } from 'react-native-get-app-list';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fungsi utama untuk narik data dan simpan snapshot
export const scanAndStoreInstalledApps = async (): Promise<any[]> => {
  try {
    const currentDate = new Date().toISOString();
    const allApps = await getInstalledApps();

    if (!Array.isArray(allApps)) return [];

    // [SYARAT: Tidak ada duplikasi] - Pakai Map untuk memfilter PackageName yang sama
    const uniqueAppsMap = new Map();
    
    allApps.forEach((app: any) => {
      const pkg = app.packageName || 'Unknown';
      if (!uniqueAppsMap.has(pkg)) {
        uniqueAppsMap.set(pkg, {
          PackageName: pkg,
          AppName: app.appName || 'Unknown', 
          Version: app.versionName || '1.0',
          FirstSeenDate: currentDate,
          Category: pkg.toLowerCase().includes('game') ? 'Game' : 'Non-Game'
        });
      }
    });

    const formattedApps = Array.from(uniqueAppsMap.values());

    // [SYARAT: Store local snapshot & Data persist]
    await AsyncStorage.setItem('INSTALLED_APPS_SNAPSHOT', JSON.stringify(formattedApps));
    
    // Simpan tanggal hari ini untuk keperluan Daily Refresh
    await AsyncStorage.setItem('LAST_SCAN_DATE', new Date().toDateString());

    return formattedApps;

  } catch (error) {
    console.error("Gagal scan:", error);
    return [];
  }
};

// [SYARAT: Daily refresh logic & Persist setelah restart]
// Panggil fungsi ini di useEffect() komponen UI lu saat aplikasi pertama kali dibuka
export const checkAndRunDailyScan = async (): Promise<any[]> => {
  try {
    const lastScanDate = await AsyncStorage.getItem('LAST_SCAN_DATE');
    const today = new Date().toDateString();

    if (lastScanDate !== today) {
      console.log("Beda hari! Menjalankan proses Daily Refresh Scan otomatis...");
      return await scanAndStoreInstalledApps();
    } else {
      console.log("Hari ini sudah scan. Mengambil data dari lokal storage...");
      const storedSnapshot = await AsyncStorage.getItem('INSTALLED_APPS_SNAPSHOT');
      return storedSnapshot ? JSON.parse(storedSnapshot) : [];
    }
  } catch (error) {
    console.error("Gagal menjalankan daily scan:", error);
    return [];
  }
};