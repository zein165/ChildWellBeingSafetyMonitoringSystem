import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, FlatList, TextInput, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import { ref as dbRef, onValue, set } from 'firebase/database';
import { db } from '../firebaseConfig';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { AppEvent, logEvent } from '../utils/EventLogger';
import InstalledAppsScreen from './InstalledAppsScreen';

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

export default function TimelineScreen({ goBack }: { goBack: () => void }) {
  const [showAppsList, setShowAppsList] = useState(false);

  const [childData, setChildData] = useState({ name: 'Anakku', latitude: -6.2, longitude: 106.8, status: 'Menunggu...', lastUpdated: '-' });
  const [homeLocation, setHomeLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<AppEvent[]>([]);
  
  const [curfewInput, setCurfewInput] = useState('20:00');
  const [gameTimeInput, setGameTimeInput] = useState('120'); 
  const [totalTimeInput, setTotalTimeInput] = useState('240'); 

  const [totalUsed, setTotalUsed] = useState('0');
  const [gameUsed, setGameUsed] = useState('0');

  const [filterMode, setFilterMode] = useState<'ALL' | 'TODAY' | 'YESTERDAY'>('ALL');

  const homeRef = useRef(homeLocation);
  const isOutsideRef = useRef(false);

  // REF UNTUK MENCEGAH SPAM NOTIFIKASI DI HP ORANG TUA
  const gameLimitRef = useRef(Number(gameTimeInput));
  const totalLimitRef = useRef(Number(totalTimeInput));
  const gameNotifiedRef = useRef(false);
  const totalNotifiedRef = useRef(false);

  useEffect(() => { homeRef.current = homeLocation; }, [homeLocation]);
  useEffect(() => { gameLimitRef.current = Number(gameTimeInput); }, [gameTimeInput]);
  useEffect(() => { totalLimitRef.current = Number(totalTimeInput); }, [totalTimeInput]);

  const showNotification = async (title: string, body: string) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({ id: 'safety_alerts', name: 'Safety Alerts', importance: AndroidImportance.HIGH });
    await notifee.displayNotification({ title, body, android: { channelId, smallIcon: 'ic_launcher' } });
  };

  useEffect(() => {
    // LOKASI RUMAH
    const homeNode = dbRef(db, 'rules/child1/homeLocation');
    const unsubHome = onValue(homeNode, (snapshot) => { if (snapshot.exists()) setHomeLocation(snapshot.val()); });

    const outsideStatusNode = dbRef(db, 'rules/child1/isOutsideStatus');
    const unsubOutsideStatus = onValue(outsideStatusNode, (snapshot) => {
      if (snapshot.exists()) isOutsideRef.current = snapshot.val();
    });

    // LOKASI ANAK
    const childNode = dbRef(db, 'locations/child1');
    const unsubLocation = onValue(childNode, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChildData(data);
        if (homeRef.current) {
          const distance = getDistanceInMeters(
            homeRef.current.latitude, homeRef.current.longitude, data.latitude, data.longitude
          );
          if (distance > 50 && !isOutsideRef.current) {
            set(dbRef(db, 'rules/child1/isOutsideStatus'), true); 
            showNotification('🚨 PERINGATAN!', 'Anak telah keluar dari area aman (Rumah)!');
            logEvent('ALERT', '🚨 Anak keluar dari pagar virtual rumah (>50m)');
          } else if (distance <= 50 && isOutsideRef.current) {
            set(dbRef(db, 'rules/child1/isOutsideStatus'), false); 
            showNotification('✅ INFO AMAN', 'Anak telah kembali ke area Rumah.');
            logEvent('ALERT', '✅ Anak sudah kembali ke dalam area rumah');
          }
        }
      }
    });

    // RIWAYAT AKTIVITAS
    const timelineNode = dbRef(db, 'timeline/child1');
    const unsubTimeline = onValue(timelineNode, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray: AppEvent[] = Object.values(data);
        const sortedEvents = eventsArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setTimelineEvents(sortedEvents);
      }
    });

    // AMBIL DATA ATURAN
    const rulesRef = dbRef(db, 'rules/child1/curfew');
    const unsubRules = onValue(rulesRef, (snapshot) => { if (snapshot.exists()) setCurfewInput(snapshot.val()); });
    const gameTimeRef = dbRef(db, 'rules/child1/maxGameTime');
    const unsubGameLimit = onValue(gameTimeRef, (snapshot) => { if (snapshot.exists()) setGameTimeInput(String(snapshot.val())); });
    const totalTimeRef = dbRef(db, 'rules/child1/maxTotalTime');
    const unsubTotalLimit = onValue(totalTimeRef, (snapshot) => { if (snapshot.exists()) setTotalTimeInput(String(snapshot.val())); });

    // AMBIL STATISTIK & TRIGGER NOTIF ORANG TUA
    const statsRef = dbRef(db, 'stats/child1');
    const unsubStats = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTotalUsed(String(data.totalTime || 0));
        setGameUsed(String(data.gameTime || 0));

        // 🔔 LOGIKA NOTIFIKASI ORANG TUA UNTUK GAME
        if (data.gameTime >= gameLimitRef.current && gameLimitRef.current > 0) {
          if (!gameNotifiedRef.current) {
            showNotification('🚨 Peringatan Game!', `Anak melewati batas main game (${gameLimitRef.current} menit).`);
            gameNotifiedRef.current = true; // Kunci biar notif gak muncul terus-terusan
          }
        } else {
          gameNotifiedRef.current = false; // Buka kunci kalau angkanya di-reset
        }

        // 🔔 LOGIKA NOTIFIKASI ORANG TUA UNTUK TOTAL HP
        if (data.totalTime >= totalLimitRef.current && totalLimitRef.current > 0) {
          if (!totalNotifiedRef.current) {
            showNotification('⚠️ Batas Layar Habis!', `Anak melewati batas total pemakaian HP (${totalLimitRef.current} menit).`);
            totalNotifiedRef.current = true;
          }
        } else {
          totalNotifiedRef.current = false;
        }
      }
    });

    return () => { 
      unsubHome(); unsubOutsideStatus(); unsubLocation(); unsubTimeline(); 
      unsubRules(); unsubGameLimit(); unsubTotalLimit(); unsubStats();
    };
  }, []);

  const setAsHome = () => {
    const newHome = { latitude: childData.latitude, longitude: childData.longitude };
    set(dbRef(db, 'rules/child1/homeLocation'), newHome).then(() => {
      set(dbRef(db, 'rules/child1/isOutsideStatus'), false);
      Alert.alert("Rumah Diatur! 🏠", "Lokasi rumah berhasil disimpan ke server.");
    });
  };

  const saveRules = () => {
    if (curfewInput.length !== 5 || !curfewInput.includes(':')) return Alert.alert('Format Salah', 'Gunakan format: 20:00');
    if (isNaN(Number(gameTimeInput)) || isNaN(Number(totalTimeInput))) return Alert.alert('Format Salah', 'Batas waktu harus berupa angka.');
    
    // Reset status notifikasi tiap kali Orang Tua mengubah batas waktu
    gameNotifiedRef.current = false;
    totalNotifiedRef.current = false;

    set(dbRef(db, 'rules/child1/curfew'), curfewInput);
    set(dbRef(db, 'rules/child1/maxGameTime'), Number(gameTimeInput));
    set(dbRef(db, 'rules/child1/maxTotalTime'), Number(totalTimeInput))
      .then(() => Alert.alert('Aturan Tersimpan!', 'Batas waktu berhasil diupdate ke HP Anak.'));
  };

  const getFilteredEvents = () => {
    const now = new Date();
    const todayString = now.toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayString = yesterdayDate.toDateString();

    return timelineEvents.filter((event) => {
      const eventDate = new Date(event.timestamp).toDateString();
      if (filterMode === 'TODAY') return eventDate === todayString;
      if (filterMode === 'YESTERDAY') return eventDate === yesterdayString;
      return true; 
    });
  };

  const homeCircleHtml = homeLocation ? `L.circle([${homeLocation.latitude}, ${homeLocation.longitude}], { color: 'green', fillColor: '#cfc', fillOpacity: 0.4, radius: 50 }).addTo(map).bindPopup('<b>🏠 Area Rumah</b>');` : '';

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style> body { padding: 0; margin: 0; } html, body, #map { height: 100%; width: 100vw; } </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${childData.latitude}, ${childData.longitude}], 18);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        ${homeCircleHtml}
        L.marker([${childData.latitude}, ${childData.longitude}]).addTo(map).bindPopup('<b>${childData.name}</b><br>Update: ${childData.lastUpdated}').openPopup();
      </script>
    </body>
    </html>
  `;

  const renderEventItem = ({ item }: { item: AppEvent }) => {
    const timeObj = new Date(item.timestamp);
    const dateFormatted = timeObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const timeFormatted = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAlert = item.eventType === 'ALERT';

    return (
      <View style={[styles.eventCard, isAlert && styles.alertCard]}>
        <Text style={styles.eventIcon}>{item.eventType === 'LOCATION' ? '📍' : isAlert ? '🚨' : '📱'}</Text>
        <View style={styles.eventDetails}>
          <Text style={[styles.eventTitle, isAlert && styles.alertText]}>{item.eventType}</Text>
          <Text style={styles.eventPayload}>{item.payload}</Text>
        </View>
        <Text style={styles.eventTime}>{dateFormatted} {timeFormatted}</Text>
      </View>
    );
  };

  if (showAppsList) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <TouchableOpacity style={styles.backToMapBtn} onPress={() => setShowAppsList(false)}>
          <Text style={styles.backToMapText}>⬅ Kembali ke Peta & Timeline</Text>
        </TouchableOpacity>
        <InstalledAppsScreen />
      </SafeAreaView>
    );
  }

  return (
    <FlatList 
      style={styles.container}
      data={[]} 
      renderItem={null}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}><Text style={styles.backButtonText}>⬅️ Ganti Peran</Text></TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
              <Text style={styles.headerTitle}>Pantau Anak 📡</Text>
              <TouchableOpacity style={styles.setHomeBtn} onPress={setAsHome}><Text style={styles.setHomeText}>🏠 Set Rumah</Text></TouchableOpacity>
            </View>

            <View style={styles.summaryBox}>
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>Total Layar Anak</Text>
                <Text style={styles.sumValue}>{totalUsed} <Text style={styles.unit}>min</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.sumItem}>
                <Text style={styles.sumLabel}>Bermain Game</Text>
                <Text style={[styles.sumValue, {color: '#EF4444'}]}>{gameUsed} <Text style={styles.unit}>min</Text></Text>
              </View>
            </View>

            <View style={styles.ruleSettingBox}>
              <View style={{flex: 1}}>
                <View style={styles.inputRow}>
                  <Text style={styles.ruleLabel}>Jam Malam:</Text>
                  <TextInput style={styles.timeInput} value={curfewInput} onChangeText={setCurfewInput} keyboardType="numbers-and-punctuation" maxLength={5} />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.ruleLabel}>Batas Total (Menit):</Text>
                  <TextInput style={styles.timeInput} value={totalTimeInput} onChangeText={setTotalTimeInput} keyboardType="numeric" maxLength={4} />
                </View>
                <View style={styles.inputRow}>
                  <Text style={styles.ruleLabel}>Batas Game (Menit):</Text>
                  <TextInput style={styles.timeInput} value={gameTimeInput} onChangeText={setGameTimeInput} keyboardType="numeric" maxLength={4} />
                </View>
              </View>
              <TouchableOpacity style={styles.saveBtn} onPress={saveRules}><Text style={styles.saveBtnText}>Simpan</Text></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.monitorAppBtn} onPress={() => setShowAppsList(true)}>
              <Text style={styles.monitorAppBtnText}>📱 Pantau Aplikasi Anak Terinstal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <WebView originWhitelist={['*']} source={{ html: mapHtml }} style={styles.map} />
          </View>

          <View style={styles.timelineContainer}>
            <View style={styles.timelineHeaderRow}>
              <Text style={styles.timelineHeader}>Riwayat Aktivitas</Text>
              <View style={styles.filterGroup}>
                <TouchableOpacity style={[styles.filterBtn, filterMode === 'ALL' && styles.filterBtnActive]} onPress={() => setFilterMode('ALL')}>
                  <Text style={[styles.filterBtnText, filterMode === 'ALL' && styles.filterTextActive]}>Semua</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterBtn, filterMode === 'TODAY' && styles.filterBtnActive]} onPress={() => setFilterMode('TODAY')}>
                  <Text style={[styles.filterBtnText, filterMode === 'TODAY' && styles.filterTextActive]}>Hari Ini</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterBtn, filterMode === 'YESTERDAY' && styles.filterBtnActive]} onPress={() => setFilterMode('YESTERDAY')}>
                  <Text style={[styles.filterBtnText, filterMode === 'YESTERDAY' && styles.filterTextActive]}>Kemarin</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={getFilteredEvents()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderEventItem}
              contentContainerStyle={{ padding: 10, paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>Tidak ada data.</Text>}
              scrollEnabled={false} 
            />
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#FFF', elevation: 3 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
  backButtonText: { color: '#333', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  setHomeBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  setHomeText: { color: '#FFF', fontWeight: 'bold' },
  
  summaryBox: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 15, padding: 15, marginTop: 15, elevation: 4 },
  sumItem: { flex: 1, alignItems: 'center' },
  sumLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 2 },
  sumValue: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  unit: { fontSize: 11, fontWeight: 'normal', color: '#94A3B8' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 10 },

  ruleSettingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8E9', padding: 10, borderRadius: 8, marginTop: 15, borderWidth: 1, borderColor: '#C8E6C9' },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4, paddingRight: 10 },
  ruleLabel: { fontSize: 13, color: '#333', fontWeight: 'bold' },
  timeInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2, width: 60, textAlign: 'center', fontSize: 13 },
  saveBtn: { backgroundColor: '#FF9800', paddingHorizontal: 15, paddingVertical: 20, borderRadius: 8, marginLeft: 5 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
  monitorAppBtn: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  monitorAppBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  backToMapBtn: { padding: 15, backgroundColor: '#e9ecef', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backToMapText: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  mapContainer: { height: Dimensions.get('window').height * 0.35, borderBottomWidth: 2, borderColor: '#eee' }, 
  map: { width: '100%', height: '100%' },
  
  timelineContainer: { backgroundColor: '#FFF' },
  timelineHeaderRow: { flexDirection: 'column', padding: 10, backgroundColor: '#E3F2FD', borderBottomWidth: 1, borderColor: '#BBDEFB' },
  timelineHeader: { fontSize: 16, fontWeight: 'bold', color: '#1565C0', marginBottom: 10 },
  filterGroup: { flexDirection: 'row', justifyContent: 'flex-start' },
  filterBtn: { paddingVertical: 5, paddingHorizontal: 12, backgroundColor: '#FFF', borderRadius: 15, marginRight: 8, borderWidth: 1, borderColor: '#90CAF9' },
  filterBtnActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  filterBtnText: { fontSize: 12, color: '#1565C0', fontWeight: 'bold' },
  filterTextActive: { color: '#FFF' },
  
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  alertCard: { backgroundColor: '#FFEBEE' }, 
  eventIcon: { fontSize: 24, marginRight: 15 },
  eventDetails: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32' },
  alertText: { color: '#D32F2F' }, 
  eventPayload: { fontSize: 12, color: '#555', marginTop: 3 },
  eventTime: { fontSize: 10, color: '#999', fontWeight: 'bold', textAlign: 'right', width: 60 }
});