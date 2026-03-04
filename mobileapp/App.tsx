import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import MapView, {Marker, UrlTile} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ====== IMPORT FEATURE ====== */
import {LocationTracker} from './src/features/location/LocationTracker';
import {LocationLogList} from './src/features/location/LocationLogList';

/* ====== MOCK STATE ====== */
const digital = { screenTimeHours: 5.2 };
const inventory = { deviceCount: 3 };
const timeline = { sleepHours: 6.5 };
const rules = { activeRules: 2 };

const latestPoint = {
  latitude: -6.200000,
  longitude: 106.816666,
};

export default function App() {
  const [showLogs, setShowLogs] = useState(false);
  
  // State baru buat nampung durasi asli lo
  const [outsideDuration, setOutsideDuration] = useState(0);

  // Fungsi buat narik data dari mesin Geofence lo
  useEffect(() => {
    const fetchDuration = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `@geofence_log_${today}`;
        const data = await AsyncStorage.getItem(storageKey);
        
        if (data) {
          const parsed = JSON.parse(data);
          // Ubah detik jadi menit (dibagi 60) biar enak dibaca
          const durationInMinutes = Math.floor(parsed.OutsideDurationSeconds / 60);
          setOutsideDuration(durationInMinutes);
        }
      } catch (error) {
        console.error("Gagal narik durasi:", error);
      }
    };

    // Panggil saat aplikasi baru dibuka
    fetchDuration();

    // Bikin interval biar layarnya update otomatis tiap 1 menit
    const interval = setInterval(fetchDuration, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* ===== 1. DIGITAL ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1) Digital Activity</Text>
          <Text>Screen Time: {digital.screenTimeHours} hours/day</Text>
        </View>

        {/* ===== 2. INVENTORY ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2) Device Inventory</Text>
          <Text>Registered Devices: {inventory.deviceCount}</Text>
        </View>

        {/* ===== 3. LOCATION & STORY C2 LO ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3) Location & Outside Activity</Text>
          <Text>
            {/* INI DIA ANGKANYA UDAH JADI ASLI */}
            Outside duration: {outsideDuration} min/day
          </Text>

          <View style={styles.mapWrap}>
            {/* Map-nya udah sekalian gue rapihin ke OSM biar jalanannya nampil */}
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: latestPoint.latitude,
                longitude: latestPoint.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              provider={undefined} 
              mapType="none"
            >
              <UrlTile
                urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
              <Marker
                coordinate={{
                  latitude: latestPoint.latitude,
                  longitude: latestPoint.longitude,
                }}
              />
            </MapView>
          </View>

          <Text
            style={styles.toggle}
            onPress={() => setShowLogs(v => !v)}>
            {showLogs ? 'Hide Location Logs' : 'Show Location Logs'}
          </Text>

          {showLogs && <LocationLogList />}
        </View>

        {/* ===== 4. TIMELINE ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>4) Daily Timeline</Text>
          <Text>Sleep Duration: {timeline.sleepHours} hours</Text>
        </View>

        {/* ===== 5. RULES ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>5) Rules & Alerts</Text>
          <Text>Active Rules: {rules.activeRules}</Text>
        </View>

      </ScrollView>

      {/* ===== BACKGROUND LOCATION TRACKER ===== */}
      <LocationTracker />
    </SafeAreaView>
  );
}

/* ====== STYLES ====== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 12,
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  mapWrap: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  map: {
    flex: 1,
  },
  toggle: {
    color: 'blue',
    marginTop: 10,
    marginBottom: 10,
  },
});
