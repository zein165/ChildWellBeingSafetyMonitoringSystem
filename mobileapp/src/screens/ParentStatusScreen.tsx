import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ref, set } from 'firebase/database';
import { db } from '../firebaseConfig'; // Sesuaikan path ini

export default function ParentStatusScreen() {

  // 🔥 FUNGSI UNTUK MENGIRIM PERINTAH KE HP ANAK
  const sendRemoteCommand = async (commandType: 'RING_ALARM' | 'CAPTURE_PHOTO') => {
    try {
      // Kita kirim perintah ini ke 'commands/child1'
      const commandRef = ref(db, 'commands/child1');
      
      await set(commandRef, {
        command: commandType,
        timestamp: new Date().toISOString(),
        status: 'PENDING' // Status PENDING, nanti diubah anak jadi SUCCESS kalau sudah jalan
      });

      const message = commandType === 'RING_ALARM' 
        ? 'Perintah dering dan getar paksa telah dikirim!' 
        : 'Perintah buka kamera telah dikirim!';
        
      Alert.alert('Perintah Terkirim 🚀', message);
      console.log(`[REMOTE] Perintah ${commandType} berhasil dikirim ke Firebase.`);

    } catch (error) {
      console.log('[REMOTE ERROR]', error);
      Alert.alert('Gagal', 'Pastikan koneksi internet lancar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📡 Status Anak (Real-Time)</Text>
      
      {/* Area Status (Bisa bos isi dengan maps/lokasi nanti) */}
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>Status: Aman ✅</Text>
        <Text style={styles.statusText}>Baterai: 85% 🔋</Text>
      </View>

      {/* 🔥 AREA REMOTE CONTROL ORANG TUA */}
      <Text style={styles.sectionTitle}>Tindakan Jarak Jauh (Remote)</Text>
      
      <View style={styles.remoteContainer}>
        {/* Tombol 1: Deringkan HP */}
        <TouchableOpacity 
          style={[styles.remoteBtn, { backgroundColor: '#F59E0B' }]} // Warna Kuning/Orange
          onPress={() => sendRemoteCommand('RING_ALARM')}
        >
          <Text style={styles.iconText}>📳</Text>
          <Text style={styles.btnText}>Dering Paksa</Text>
        </TouchableOpacity>

        {/* Tombol 2: Ambil Foto */}
        <TouchableOpacity 
          style={[styles.remoteBtn, { backgroundColor: '#3B82F6' }]} // Warna Biru
          onPress={() => sendRemoteCommand('CAPTURE_PHOTO')}
        >
          <Text style={styles.iconText}>📸</Text>
          <Text style={styles.btnText}>Pantau Kamera</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1F2937' },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 30,
  },
  statusText: { fontSize: 16, marginBottom: 5, color: '#4B5563' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 15 },
  remoteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  remoteBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 4,
  },
  iconText: { fontSize: 28, marginBottom: 5 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});