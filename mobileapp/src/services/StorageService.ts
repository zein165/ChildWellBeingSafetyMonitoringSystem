import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// 1. FITUR SETTINGS (PENGATURAN ATURAN BARU)
// ==========================================

export const saveRulesSettings = async (gameLimit: number, curfewTime: string) => {
  try {
    const settings = { gameLimit, curfewTime };
    await AsyncStorage.setItem('@custom_rules', JSON.stringify(settings));
    console.log('✅ Aturan berhasil disimpan:', settings);
  } catch (e) {
    console.error('❌ Gagal menyimpan aturan', e);
  }
};

export const getRulesSettings = async () => {
  try {
    const data = await AsyncStorage.getItem('@custom_rules');
    // Nilai default jika orang tua belum pernah setting: Game 120 menit, Jam 21:00
    return data ? JSON.parse(data) : { gameLimit: 120, curfewTime: '21:00' };
  } catch (e) {
    console.error('❌ Gagal mengambil aturan', e);
    return { gameLimit: 120, curfewTime: '21:00' };
  }
};

// ==========================================
// 2. FITUR TIMELINE (MENGEMBALIKAN FUNGSI LAMA)
// ==========================================
const EVENTS_KEY = '@timeline_events';

// Menyimpan event timeline
export const saveEvent = async (event: any) => {
  try {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    const existingEvents = data ? JSON.parse(data) : [];
    
    // Masukkan event baru di urutan paling atas
    const updatedEvents = [event, ...existingEvents];
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  } catch (e) {
    console.error('❌ Gagal menyimpan event timeline', e);
  }
};

// Mengambil event timeline
export const getEventsByDate = async (date: string | Date) => {
  try {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    const events = data ? JSON.parse(data) : [];
    return events;
  } catch (e) {
    console.error('❌ Gagal mengambil event timeline', e);
    return [];
  }
};

// Menghapus semua timeline
export const clearTimeline = async () => {
  try {
    await AsyncStorage.removeItem(EVENTS_KEY);
    console.log('✅ Semua riwayat timeline dihapus');
  } catch (e) {
    console.error('❌ Gagal menghapus timeline', e);
  }
};