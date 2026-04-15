import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import notifee from '@notifee/react-native';

// FIREBASE
import { ref as dbRef, onValue, set, push } from 'firebase/database';
import { db } from '../firebaseConfig';

export default function ActiveProtectionScreen({ goBack }: { goBack: () => void }) {
  // STATE WAKTU
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [gameMinutes, setGameMinutes] = useState(0);

  // STATE BATAS (DARI ORANG TUA)
  const [timeLimit, setTimeLimit] = useState(120); 
  const [gameLimit, setGameLimit] = useState(60);  

  // REF UNTUK LOGIKA (Agar tidak kena ghosting state & tidak spam database)
  const totalRef = useRef(0);
  const gameRef = useRef(0);
  const limitTotalRef = useRef(120);
  const limitGameRef = useRef(60);
  
  // PENANDA AGAR KIRIM RIWAYAT HANYA 1 KALI SAAT MELEWATI BATAS
  const hasAlertedTotal = useRef(false);
  const hasAlertedGame = useRef(false);

  // Sync state ke Ref
  useEffect(() => { totalRef.current = totalMinutes; }, [totalMinutes]);
  useEffect(() => { gameRef.current = gameMinutes; }, [gameMinutes]);

  // 1. AMBIL ATURAN DARI FIREBASE
  useEffect(() => {
    const totalLimitNode = dbRef(db, 'rules/child1/maxTotalTime');
    const unsubTotal = onValue(totalLimitNode, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setTimeLimit(val);
        limitTotalRef.current = val;
        hasAlertedTotal.current = false; // Reset flag kalau aturan diubah
      }
    });

    const gameLimitNode = dbRef(db, 'rules/child1/maxGameTime');
    const unsubGame = onValue(gameLimitNode, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setGameLimit(val);
        limitGameRef.current = val;
        hasAlertedGame.current = false; // Reset flag kalau aturan diubah
      }
    });

    return () => { unsubTotal(); unsubGame(); };
  }, []);

  // 2. SIMULASI PENDETEKSI APLIKASI
  const isGame = (packageName: string) => {
    const pkg = packageName.toLowerCase();
    return pkg.includes('game') || pkg.includes('roblox') || pkg.includes('pubg') || pkg.includes('mobile.legends');
  };

  const getCurrentActiveApp = async () => {
    const dummyApps = ['com.whatsapp', 'com.mobile.legends (Game)', 'com.google.youtube', 'com.roblox (Game)'];
    return dummyApps[Math.floor(Math.random() * dummyApps.length)];
  };

  // 3. MESIN UTAMA (UPDATE TIAP DETIK UNTUK TES)
  useEffect(() => {
    const usageInterval = setInterval(async () => {
      const activeApp = await getCurrentActiveApp();
      const isAppGame = isGame(activeApp);

      // Hitung progress
      const nextTotal = totalRef.current + 1;
      const nextGame = gameRef.current + (isAppGame ? 1 : 0);

      setTotalMinutes(nextTotal);
      setGameMinutes(nextGame);

      // A. KIRIM STATISTIK REAL-TIME (Untuk Progress Bar Orang Tua)
      set(dbRef(db, 'stats/child1'), {
        totalTime: nextTotal,
        gameTime: nextGame,
        lastUpdate: new Date().toISOString()
      });

      // B. CEK PELANGGARAN TOTAL HP
      if (nextTotal >= limitTotalRef.current && !hasAlertedTotal.current) {
        hasAlertedTotal.current = true; // Kunci agar tidak kirim terus menerus
        
        // Notif di HP Anak
        triggerNotification('⚠️ Waktu Habis!', 'Batas penggunaan HP sudah tercapai.');

        // KIRIM KE RIWAYAT (TIMELINE) FIREBASE
        push(dbRef(db, 'timeline/child1'), {
          eventType: 'ALERT',
          payload: `⚠️ Anak melewati batas total waktu (${limitTotalRef.current} menit)`,
          timestamp: new Date().toISOString()
        }).then(() => console.log("Berhasil masuk riwayat total"));
      }

      // C. CEK PELANGGARAN GAME
      if (nextGame >= limitGameRef.current && !hasAlertedGame.current) {
        hasAlertedGame.current = true; // Kunci
        
        // Notif di HP Anak
        triggerNotification('🎮 Stop Main Game!', 'Batas main game sudah habis.');

        // KIRIM KE RIWAYAT (TIMELINE) FIREBASE
        push(dbRef(db, 'timeline/child1'), {
          eventType: 'ALERT',
          payload: `🚨 Anak bermain game melewati batas (${limitGameRef.current} menit)`,
          timestamp: new Date().toISOString()
        }).then(() => console.log("Berhasil masuk riwayat game"));
      }

    }, 1000); // Ganti ke 60000 jika sudah selesai testing (1 menit)

    return () => clearInterval(usageInterval);
  }, []);

  const triggerNotification = async (title: string, body: string) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({ id: 'security', name: 'Security Alert', importance: 4 });
    await notifee.displayNotification({ title, body, android: { channelId, smallIcon: 'ic_launcher' } });
  };

  const handleSOS = () => {
    push(dbRef(db, 'timeline/child1'), {
      eventType: 'ALERT',
      payload: '🆘 ANAK MENEKAN TOMBOL SOS DARURAT!',
      timestamp: new Date().toISOString()
    });
    Alert.alert("SOS Terkirim", "Orang tua telah diberitahu.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <View style={styles.content}>
        <Text style={styles.shieldEmoji}>🛡️</Text>
        <Text style={styles.mainTitle}>Perlindungan Aktif</Text>
        <Text style={styles.desc}>Data tersambung ke Dashboard Orang Tua</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>📱 Total Layar</Text>
            <Text style={styles.statValue}>{totalMinutes} / {timeLimit}m</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>🎮 Durasi Game</Text>
            <Text style={[styles.statValue, gameMinutes >= gameLimit && styles.textDanger]}>
              {gameMinutes} / {gameLimit}m
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionArea}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosText}>🚨 KIRIM SOS DARURAT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitLink} onPress={goBack}>
          <Text style={styles.exitText}>Ganti Peran</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#059669' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  shieldEmoji: { fontSize: 70, marginBottom: 20 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  desc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 30 },
  statsContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 15, width: '100%' },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4, fontWeight: '600' },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  textDanger: { color: '#FCA5A5' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  actionArea: { paddingBottom: 40, alignItems: 'center' },
  sosButton: { backgroundColor: '#DC2626', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, elevation: 5, marginBottom: 20 },
  sosText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  exitLink: { padding: 10 },
  exitText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 14 }
});