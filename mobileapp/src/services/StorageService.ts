import AsyncStorage from '@react-native-async-storage/async-storage';

// SEKARANG MENERIMA 2 ARGUMEN (number, string) sesuai permintaan SettingsScreen.tsx
export const saveRulesSettings = async (gameLimit: number, curfewTime: string) => {
  try {
    // Kita bungkus jadi satu objek sebelum disimpan
    const settings = { gameLimit, curfewTime };
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem('@rules_settings', jsonValue);
  } catch (e) {
    console.error('Gagal menyimpan pengaturan aturan:', e);
  }
};

// SEKARANG TIDAK MEMINTA ARGUMEN, sesuai permintaan SettingsScreen.tsx
export const getRulesSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@rules_settings');
    // Jika ada data, kembalikan datanya. Jika kosong, beri nilai default agar tidak error.
    return jsonValue != null ? JSON.parse(jsonValue) : { gameLimit: 120, curfewTime: '21:00' };
  } catch (e) {
    console.error('Gagal mengambil pengaturan aturan:', e);
    return { gameLimit: 120, curfewTime: '21:00' }; // Nilai default jika gagal
  }
};

// Fungsi umum (opsional, biarkan saja untuk cadangan)
export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Gagal menyimpan data untuk key ${key}:`, e);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Gagal mengambil data untuk key ${key}:`, e);
    return null;
  }
};