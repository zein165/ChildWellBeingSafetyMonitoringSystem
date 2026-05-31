import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Alert, NativeModules, NativeEventEmitter, PermissionsAndroid } from 'react-native';
import notifee from '@notifee/react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

// FIREBASE
import { ref as dbRef, onValue, set, push, update, increment } from 'firebase/database';
import { db } from '../firebaseConfig'; 

const { AppUsage } = NativeModules;

export default function ActiveProtectionScreen({ goBack }: { goBack: () => void }) {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [gameMinutes, setGameMinutes] = useState(0);
  const [currentAppDuration, setCurrentAppDuration] = useState(0);
  const [currentAppName, setCurrentAppName] = useState("Memuat...");
  const [hasPermission, setHasPermission] = useState(false);

  // 🔥 STATE BARU UNTUK ALARM ORANG TUA
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  const [timeLimit, setTimeLimit] = useState(120); 
  const [gameLimit, setGameLimit] = useState(60);  

  const totalRef = useRef(0);
  const gameRef = useRef(0);
  const limitTotalRef = useRef(120);
  const limitGameRef = useRef(60);
  const lastAppRef = useRef("");
  const currentAppDurationRef = useRef(0);
  
  const hasAlertedTotal = useRef(false);
  const hasAlertedGame = useRef(false);

  useEffect(() => { totalRef.current = totalMinutes; }, [totalMinutes]);
  useEffect(() => { gameRef.current = gameMinutes; }, [gameMinutes]);

  // 1. CEK IZIN USAGE STATS
  useEffect(() => {
    const askPermission = async () => {
      try {
        if (!AppUsage) return;
        const isPermitted = await AppUsage.checkPermission();
        console.log("🟡 STATUS IZIN APLIKASI:", isPermitted);
        setHasPermission(isPermitted);
        
        if (!isPermitted) {
          Alert.alert(
            "Izin Dibutuhkan",
            "Sistem monitoring butuh akses penggunaan. Mohon izinkan aplikasi ini.",
            [{ text: "Buka Pengaturan", onPress: () => AppUsage.requestPermission() }]
          );
        }
      } catch (error) {
        console.log("🔴 ERROR CEK IZIN:", error);
      }
    };
    askPermission();
  }, []);

  // 2. AMBIL ATURAN BATAS WAKTU
  useEffect(() => {
    const totalLimitNode = dbRef(db, 'rules/child1/maxTotalTime');
    const unsubTotal = onValue(totalLimitNode, (snapshot) => {
      if (snapshot.exists()) {
        setTimeLimit(snapshot.val());
        limitTotalRef.current = snapshot.val();
      }
    });

    const gameLimitNode = dbRef(db, 'rules/child1/maxGameTime');
    const unsubGame = onValue(gameLimitNode, (snapshot) => {
      if (snapshot.exists()) {
        setGameLimit(snapshot.val());
        limitGameRef.current = snapshot.val();
      }
    });

    return () => { unsubTotal(); unsubGame(); };
  }, []);

  const isGame = (packageName: string) => {
    if (!packageName) return false;
    const pkg = packageName.toLowerCase();
    return pkg.includes('game') || pkg.includes('roblox') || pkg.includes('pubg') || pkg.includes('mobile.legends');
  };

  // 3. MESIN UTAMA PEMANTAU APLIKASI (KOTLIN)
  useEffect(() => {
    if (!AppUsage || !hasPermission) {
      console.log("⚠️ MESIN KOTLIN TIDAK NYALA: Izin belum diberikan atau modul hilang."); 
      return;
    }

    console.log("🚀 MENYALAKAN MESIN KOTLIN..."); 
    AppUsage.startService();
    
    const eventEmitter = new NativeEventEmitter(AppUsage);
    const subscription = eventEmitter.addListener('onAppChanged', (realApp) => {
      
      try {
        const isAppGame = isGame(realApp);
        const today = new Date().toISOString().split('T')[0]; 
        const sanitizedAppKey = realApp.replace(/\./g, '_');

        setCurrentAppName(realApp);

        if (realApp === lastAppRef.current) {
          currentAppDurationRef.current += 1;
        } else {
          currentAppDurationRef.current = 1;
          lastAppRef.current = realApp;
        }

        setCurrentAppDuration(currentAppDurationRef.current);

        const nextTotal = totalRef.current + 1;
        const nextGame = gameRef.current + (isAppGame ? 1 : 0);

        setTotalMinutes(nextTotal);
        setGameMinutes(nextGame);

        // --- UPDATE FIREBASE SAAT INI ---
        set(dbRef(db, 'stats/child1/current'), {
          appName: realApp,
          durationInSeconds: currentAppDurationRef.current,
          lastUpdate: new Date().toISOString()
        }).catch(err => console.log("❌ GAGAL FIREBASE:", err));

        // --- UPDATE LOG HARIAN ---
        const dailyUpdate: any = {};
        dailyUpdate[`usage/child1/${today}/${sanitizedAppKey}`] = increment(1);
        dailyUpdate[`usage/child1/${today}/total_device_time`] = increment(1);
        if (isAppGame) {
          dailyUpdate[`usage/child1/${today}/total_game_time`] = increment(1);
        }
        update(dbRef(db), dailyUpdate);

        // --- CEK ALARM BATAS WAKTU ---
        if (nextTotal >= limitTotalRef.current && !hasAlertedTotal.current) {
          hasAlertedTotal.current = true;
          triggerNotification('⚠️ Waktu Habis!', 'Batas penggunaan HP sudah tercapai.');
        }

        if (nextGame >= limitGameRef.current && !hasAlertedGame.current) {
          hasAlertedGame.current = true;
          triggerNotification('🎮 Stop Main Game!', 'Batas main game sudah habis.');
        }
      } catch (error) {
        console.log("🟠 ERROR LOGIC FIREBASE:", error);
      }
    });

    return () => {
      console.log("🛑 MEMATIKAN MESIN KOTLIN...");
      subscription.remove();
      AppUsage.stopService();
    };
  }, [hasPermission]);

  // 4. 🔥 MESIN PENDENGAR PERINTAH ORANG TUA (ALARM & KAMERA)
  useEffect(() => {
    const commandRef = dbRef(db, 'commands/child1');

    const unsubscribe = onValue(commandRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data && data.status === 'PENDING') {
        
        // JIKA PERINTAHNYA ALARM
        if (data.command === 'RING_ALARM') {
          console.log("🚨 [ANAK] PERINTAH ALARM DARI ORANG TUA DITERIMA!");
          setIsAlarmActive(true); 
          update(commandRef, { status: 'SUCCESS' });
        } 
        
        // JIKA PERINTAHNYA KAMERA
        else if (data.command === 'CAPTURE_PHOTO') {
          console.log("📸 [ANAK] PERINTAH KAMERA DITERIMA, MEMINTA IZIN...");
          
          const openCameraWithPermission = async () => {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: "Izin Kamera",
                  message: "Aplikasi membutuhkan akses kamera untuk keamanan.",
                  buttonNeutral: "Nanti",
                  buttonNegative: "Tolak",
                  buttonPositive: "Izinkan"
                }
              );

              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("✅ Izin Kamera diberikan, membuka layar jepretan...");
                
                launchCamera({
                  mediaType: 'photo',
                  cameraType: 'front', 
                  quality: 0.3, 
                  includeBase64: true, 
                }, (response) => {
                  if (response.didCancel) {
                    console.log('Anak membatalkan jepretan kamera');
                    update(commandRef, { status: 'FAILED' });
                  } else if (response.errorCode) {
                    console.log('Error Kamera: ', response.errorMessage);
                    update(commandRef, { status: 'FAILED' });
                  } else if (response.assets && response.assets.length > 0) {
                    console.log('📸 Foto berhasil diambil anak!');
                    const fotoBase64 = response.assets[0].base64!; 
                    update(commandRef, { 
                      status: 'SUCCESS',
                      lastPhoto: fotoBase64 
                    });
                  }
                });
              } else {
                console.log("❌ Izin Kamera ditolak oleh anak");
                update(commandRef, { status: 'FAILED' });
              }
            } catch (err) {
              console.warn("⚠️ ERROR SAAT MINTA IZIN KAMERA: ", err);
              update(commandRef, { status: 'FAILED' });
            }
          };

          openCameraWithPermission();
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 5. 🔥 MESIN RADAR GPS (LIVE TRACKING 10 DETIK)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startLiveTracking = async () => {
      try {
        // Minta izin lokasi ke anak
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Izin Lokasi (GPS)",
            message: "Aplikasi butuh akses GPS agar Orang Tua bisa memantaumu.",
            buttonNeutral: "Nanti",
            buttonNegative: "Tolak",
            buttonPositive: "Izinkan"
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("📍 Izin GPS Diberikan! Memulai Live Tracking...");

          // Buat putaran waktu (Looping) setiap 10 detik
          intervalId = setInterval(() => {
            Geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`📍 [KIRIM GPS] Posisi: ${latitude}, ${longitude}`);
                
                // Tembakkan koordinatnya ke Firebase
                set(dbRef(db, 'locations/child1'), {
                  name: 'Anakku (Live)',
                  latitude: latitude,
                  longitude: longitude,
                  status: 'Online (Akurat)',
                  lastUpdated: new Date().toLocaleTimeString('id-ID')
                }).catch(err => console.log("Gagal kirim GPS:", err));
              },
              (error) => {
                console.log("🔴 GPS Error: ", error.message);
              },
              { 
                enableHighAccuracy: true, 
                timeout: 5000, 
                maximumAge: 0 
              }
            );
          }, 10000); // 10.000 ms = 10 Detik
        } else {
          console.log("❌ Izin GPS ditolak!");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    startLiveTracking();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const triggerNotification = async (title: string, body: string) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({ id: 'security', name: 'Security Alert', importance: 4 });
    await notifee.displayNotification({ title, body, android: { channelId, smallIcon: 'ic_launcher' } });
  };

  const handleSOS = () => {
    push(dbRef(db, 'timeline/child1'), { eventType: 'ALERT', payload: '🆘 SOS DARURAT!', timestamp: new Date().toISOString() });
    Alert.alert("SOS Terkirim", "Orang tua telah diberitahu.");
  };

  const formatDuration = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <View style={styles.content}>
        <Text style={styles.shieldEmoji}>🛡️</Text>
        <Text style={styles.mainTitle}>Perlindungan Aktif</Text>
        
        <View style={styles.currentAppCard}>
          <Text style={styles.currentAppLabel}>Aplikasi yang sedang dibuka:</Text>
          <Text style={styles.currentAppName}>{currentAppName}</Text>
          <Text style={styles.currentAppTime}>⏳ Dimainkan: {formatDuration(currentAppDuration)}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>📱 Total</Text>
            <Text style={styles.statValue}>{formatDuration(totalMinutes)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>🎮 Game</Text>
            <Text style={[styles.statValue, gameMinutes >= gameLimit && styles.textDanger]}>{formatDuration(gameMinutes)}</Text>
          </View>
        </View>

        {/* TOMBOL PAKSA IZIN */}
        <TouchableOpacity 
          style={{marginTop: 15, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8}}
          onPress={() => AppUsage.requestPermission()}
        >
          <Text style={{color: 'white', fontSize: 12}}>CEK PENGATURAN IZIN ANDROID</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.actionArea}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}><Text style={styles.sosText}>🚨 SOS</Text></TouchableOpacity>
        <TouchableOpacity style={styles.exitLink} onPress={goBack}><Text style={styles.exitText}>Ganti Peran</Text></TouchableOpacity>
      </View>

      {/* 🔥 KOTAK PERINGATAN DARURAT (LAYAR PENUH) */}
      {isAlarmActive && (
        <View style={styles.alarmFullScreen}>
          <Text style={styles.alarmWarningIcon}>⚠️</Text>
          <Text style={styles.alarmTitleText}>PANGGILAN DARURAT!</Text>
          <Text style={styles.alarmSubText}>Orang Tua meminta kamu untuk segera merespon.</Text>
          
          <TouchableOpacity style={styles.alarmStopBtn} onPress={() => setIsAlarmActive(false)}>
            <Text style={styles.alarmStopBtnText}>🛑 SAYA MENGERTI</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#059669' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  shieldEmoji: { fontSize: 70, marginBottom: 15 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFF', marginBottom: 25 },
  currentAppCard: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  currentAppLabel: { color: '#FFF', fontSize: 13, marginBottom: 5 },
  currentAppName: { color: '#FCD34D', fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  currentAppTime: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 15, width: '100%' },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  textDanger: { color: '#FCA5A5' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  actionArea: { paddingBottom: 40, alignItems: 'center' },
  sosButton: { backgroundColor: '#DC2626', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, marginBottom: 20 },
  sosText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  exitLink: { padding: 10 },
  exitText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  /* 🔥 STYLE TAMBAHAN UNTUK ALARM */
  alarmFullScreen: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(220, 38, 38, 0.95)', 
    justifyContent: 'center', alignItems: 'center', padding: 20, zIndex: 999,
  },
  alarmWarningIcon: { fontSize: 80, marginBottom: 20 },
  alarmTitleText: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 15, textAlign: 'center' },
  alarmSubText: { fontSize: 16, color: '#FFF', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  alarmStopBtn: { backgroundColor: '#111827', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12, elevation: 5 },
  alarmStopBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});