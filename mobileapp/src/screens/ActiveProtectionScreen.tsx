import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig'; 

import { evaluateRules, updateCurfewRule, updateOutsideStatus, updateMaxGameTime, updateCurrentGameTime } from '../utils/RuleEngine'; 
import { startBackgroundTracking, stopBackgroundTracking } from '../utils/BackgroundTracker';

export default function ActiveProtectionScreen({ goBack }: { goBack: () => void }) {
  const [status, setStatus] = useState('Memeriksa akses sistem... ⏳');
  
  // State untuk UI Simulasi Main Game
  const [playedTime, setPlayedTime] = useState(0);

  useEffect(() => {
    const startProtection = async () => {
      if (Platform.OS === 'android') {
        try {
          // Minta izin lokasi biasa dan lokasi latar belakang
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          ]);

          if (granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED) {
            setStatus('Sistem Background Aktif 🟢📡\nMemantau di latar belakang...');
            // Mulai pelacakan Foreground Service
            startBackgroundTracking();
          } else {
            setStatus('Izin lokasi ditolak ❌');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    startProtection();

    // Listeners Firebase untuk sinkronisasi Rule Engine
    const rulesRef = ref(db, 'rules/child1/curfew');
    const unsubRules = onValue(rulesRef, (snapshot) => { 
      if (snapshot.exists()) updateCurfewRule(snapshot.val()); 
    });

    const outsideRef = ref(db, 'rules/child1/isOutsideStatus');
    const unsubOutside = onValue(outsideRef, (snapshot) => { 
      if (snapshot.exists()) updateOutsideStatus(snapshot.val()); 
    });

    const gameLimitRef = ref(db, 'rules/child1/maxGameTime');
    const unsubGameLimit = onValue(gameLimitRef, (snapshot) => { 
      if (snapshot.exists()) updateMaxGameTime(Number(snapshot.val())); 
    });

    // Cleanup: Matikan pelacakan saat keluar dari layar ini
    return () => { 
      stopBackgroundTracking(); 
      unsubRules(); 
      unsubOutside(); 
      unsubGameLimit(); 
    };
  }, []);

  // Fungsi Simulasi Main Game (Untuk Testing D2)
  const simulatePlayingGame = () => {
    const newTime = playedTime + 30; // Tambah 30 menit setiap klik
    setPlayedTime(newTime);
    updateCurrentGameTime(newTime); 
    evaluateRules(); // Cek apakah lewat batas yang diatur Orang Tua
  };

  const resetGameTime = () => {
    setPlayedTime(0);
    updateCurrentGameTime(0);
    evaluateRules();
    Alert.alert("Reset", "Waktu main game dikembalikan ke 0 menit.");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>⬅️ Kembali</Text>
      </TouchableOpacity>
      
      <View style={styles.card}>
        <View style={styles.iconContainer}><Text style={styles.icon}>🛡️</Text></View>
        <Text style={styles.title}>Perlindungan Aktif</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      {/* Kotak Simulasi Waktu Main Game */}
      <View style={styles.simBox}>
        <Text style={styles.simTitle}>🎮 Simulasi Waktu Bermain</Text>
        <Text style={styles.simText}>Durasi Tercatat: <Text style={{fontWeight: 'bold', color: '#D32F2F'}}>{playedTime} Menit</Text></Text>
        
        <TouchableOpacity style={styles.simButton} onPress={simulatePlayingGame}>
          <Text style={styles.simButtonText}>+ Main 30 Menit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.resetButton} onPress={resetGameTime}>
          <Text style={styles.resetButtonText}>🔄 Reset Waktu Main</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9', padding: 20, paddingTop: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 20, elevation: 3 },
  backButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#FFF', padding: 30, borderRadius: 20, width: '100%', alignItems: 'center', elevation: 5, marginBottom: 20 },
  iconContainer: { backgroundColor: '#C8E6C9', padding: 20, borderRadius: 50, marginBottom: 15 },
  icon: { fontSize: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 },
  status: { fontSize: 16, color: '#1565C0', marginBottom: 5, textAlign: 'center', fontWeight: '500' },
  simBox: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3, borderWidth: 1, borderColor: '#FFE0B2' },
  simTitle: { fontSize: 18, fontWeight: 'bold', color: '#E65100', marginBottom: 10 },
  simText: { fontSize: 16, color: '#333', marginBottom: 15 },
  simButton: { backgroundColor: '#FF9800', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
  simButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  resetButton: { paddingVertical: 10 },
  resetButtonText: { color: '#757575', fontWeight: 'bold', fontSize: 14 }
});