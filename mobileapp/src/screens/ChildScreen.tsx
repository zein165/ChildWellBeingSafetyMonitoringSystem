import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, update, push } from 'firebase/database';
import { db } from '../firebaseConfig';

export default function ChildScreen() {
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // 🔥 MONITORING PERINTAH DARI ORANG TUA
  useEffect(() => {
    const commandRef = ref(db, 'commands/child1');

    console.log("👀 [ANAK] Mencari perintah baru...");

    const unsubscribe = onValue(commandRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        console.log("📥 [ANAK] Data diterima dari Firebase:", data);

        // Jika ada perintah PENDING dan tipenya RING_ALARM
        if (data.status === 'PENDING' && data.command === 'RING_ALARM') {
          processAlarm();
        }
      }
    });

    // Clean up listener
    return () => unsubscribe();
  }, []);

  const processAlarm = () => {
    console.log("🚨 [ANAK] ALARM AKTIF (Versi UI Only)!");
    
    // Langsung munculkan kotak merah di layar
    setIsAlarmActive(true);

    // Langsung set status ke SUCCESS agar tidak muncul terus saat layar di-refresh
    const commandRef = ref(db, 'commands/child1');
    update(commandRef, { status: 'SUCCESS' });
  };

  const handleStopAlarm = () => {
    setIsAlarmActive(false);
    Alert.alert("Info", "Peringatan darurat telah ditutup.");
  };

  const handleSOS = async () => {
    try {
      const timelineRef = ref(db, 'timeline/child1');
      await push(timelineRef, {
        eventType: 'ALERT',
        message: 'SOS! Anak butuh bantuan!',
        timestamp: new Date().toISOString()
      });
      Alert.alert("Terkirim", "Pesan SOS telah sampai ke Orang Tua.");
    } catch (e) {
      Alert.alert("Gagal", "Cek koneksi internet!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛡️</Text>
      <Text style={styles.statusTitle}>Sistem Perlindungan Aktif</Text>

      <TouchableOpacity style={styles.sosBtn} onPress={handleSOS}>
        <Text style={styles.sosText}>🚨 KIRIM SOS</Text>
      </TouchableOpacity>

      {/* KOTAK PERINGATAN MERAH */}
      {isAlarmActive && (
        <View style={styles.alarmOverlay}>
          <Text style={styles.alarmText}>⚠️ PANGGILAN DARURAT ORANG TUA!</Text>
          <TouchableOpacity style={styles.stopBtn} onPress={handleStopAlarm}>
            <Text style={styles.stopText}>🛑 TUTUP PERINGATAN</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 20 },
  icon: { fontSize: 80, marginBottom: 10 },
  statusTitle: { fontSize: 18, fontWeight: 'bold', color: '#065F46', marginBottom: 50 },
  sosBtn: { backgroundColor: '#DC2626', paddingVertical: 20, paddingHorizontal: 40, borderRadius: 50, elevation: 10 },
  sosText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  alarmOverlay: {
    marginTop: 40, padding: 25, backgroundColor: '#FEF2F2', borderRadius: 20,
    borderWidth: 3, borderColor: '#EF4444', alignItems: 'center', width: '100%'
  },
  alarmText: { color: '#B91C1C', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  stopBtn: { backgroundColor: '#1F2937', padding: 15, borderRadius: 12 },
  stopText: { color: '#FFF', fontWeight: 'bold' }
});