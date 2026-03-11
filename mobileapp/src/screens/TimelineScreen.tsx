import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';

// Import Service yang kita buat
import { getEventsByDate, saveEvent, clearTimeline } from '../services/StorageService';
import { triggerLocalAlert } from '../services/NotificationService'; // Sesuaikan jika nama fungsimu beda
import SettingsScreen from './SettingsScreen';

const TimelineScreen = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  // Load data saat layar pertama kali dibuka
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const today = new Date();
    const data = await getEventsByDate(today);
    setEvents(data);
  };

  const handleClearData = async () => {
    await clearTimeline();
    setEvents([]);
    Alert.alert('Sukses', 'Data timeline berhasil dihapus!');
  };

  // Fungsi untuk mensimulasikan peringatan dan memicu notifikasi HP
  const simulateViolation = async (title: string, message: string, type: string) => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    // 1. Simpan ke memori HP
    await saveEvent(newEvent);
    
    // 2. Munculkan Notifikasi Push Asli di HP
    if (triggerLocalAlert) {
      await triggerLocalAlert(title, message);
    }

    // 3. Refresh list layar
    loadEvents();
  };

  // Tampilan desain untuk setiap kotak riwayat (kartu)
  const renderItem = ({ item }: { item: any }) => {
    const isDanger = item.type === 'danger' || item.type === 'warning';
    return (
      <View style={[styles.card, isDanger ? styles.cardDanger : styles.cardSafe]}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMessage}>{item.message}</Text>
        <Text style={styles.cardTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Timeline Peringatan</Text>
        
        {/* TOMBOL BUKA SETTINGS */}
        <TouchableOpacity 
          style={styles.btnSettings} 
          onPress={() => setSettingsVisible(true)}
        >
          <Text style={styles.btnSettingsText}>⚙️ Aturan</Text>
        </TouchableOpacity>
      </View>

      {/* --- TOMBOL SIMULASI PELANGGARAN --- */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.btnAction, { backgroundColor: '#FFC107' }]} 
          onPress={() => simulateViolation('⚠️ Peringatan Game', 'Anak bermain game melewati batas waktu!', 'warning')}
        >
          <Text style={styles.btnActionText}>🎮 Game Over Limit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btnAction, { backgroundColor: '#DC3545' }]} 
          onPress={() => simulateViolation('🚨 Jam Malam!', 'Anak terdeteksi keluar rumah!', 'danger')}
        >
          <Text style={styles.btnActionText}>🌙 Keluar Malam</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnClear} onPress={handleClearData}>
        <Text style={styles.btnClearText}>🗑️ Hapus Semua Data</Text>
      </TouchableOpacity>

      {/* --- LIST RIWAYAT --- */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Semua aman! Belum ada peringatan hari ini. 🟢</Text>}
      />

      {/* --- MODAL SETTINGS (POP-UP LAYAR PENUH) --- */}
      <Modal 
        visible={isSettingsVisible} 
        animationType="slide" 
        onRequestClose={() => setSettingsVisible(false)} // Supaya bisa ditutup pakai tombol back HP
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity 
            style={styles.btnCloseModal} 
            onPress={() => setSettingsVisible(false)}
          >
            <Text style={styles.btnCloseModalText}>❌ Tutup Pengaturan</Text>
          </TouchableOpacity>
          
          {/* Memanggil Layar Settings */}
          <SettingsScreen />
        </View>
      </Modal>
    </View>
  );
};

// --- STYLING (CSS) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  btnSettings: { backgroundColor: '#6C757D', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, elevation: 2 },
  btnSettingsText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  btnAction: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4, elevation: 2 },
  btnActionText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  btnClear: { backgroundColor: '#343A40', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20, marginHorizontal: 4, elevation: 2 },
  btnClearText: { color: 'white', fontWeight: 'bold' },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardDanger: { backgroundColor: '#FFEBEB', borderLeftWidth: 5, borderLeftColor: '#DC3545' },
  cardSafe: { backgroundColor: 'white', borderLeftWidth: 5, borderLeftColor: '#28A745' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardMessage: { fontSize: 14, color: '#666', marginTop: 4 },
  cardTime: { fontSize: 12, color: '#999', marginTop: 8, textAlign: 'right', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontStyle: 'italic', fontSize: 15 },
  btnCloseModal: { backgroundColor: '#DC3545', padding: 16, alignItems: 'center' },
  btnCloseModalText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default TimelineScreen;