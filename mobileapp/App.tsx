import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import MapView, {Marker, UrlTile} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ====== IMPORT FEATURE ====== */
import {LocationTracker} from './src/features/location/LocationTracker';
import {LocationLogList} from './src/features/location/LocationLogList';

/* ====== IMPORT STORY D1 & D2 LO ====== */
import TimelineScreen from './src/screens/TimelineScreen';

/* ====== MOCK STATE ====== */
const digital = { screenTimeHours: 5.2 };
const inventory = { deviceCount: 3 };
const latestPoint = {
  latitude: -6.200000,
  longitude: 106.816666,
};

export default function App() {
  const [showLogs, setShowLogs] = useState(false);
  const [outsideDuration, setOutsideDuration] = useState(0);

  // STATE BARU: Buat pindah-pindah layar (Tab)
  const [activeTab, setActiveTab] = useState<'HOME' | 'TIMELINE'>('HOME');

  useEffect(() => {
    const fetchDuration = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `@geofence_log_${today}`;
        const data = await AsyncStorage.getItem(storageKey);
        
        if (data) {
          const parsed = JSON.parse(data);
          const durationInMinutes = Math.floor(parsed.OutsideDurationSeconds / 60);
          setOutsideDuration(durationInMinutes);
        }
      } catch (error) {
        console.error("Gagal narik durasi:", error);
      }
    };

    fetchDuration();
    const interval = setInterval(fetchDuration, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ===== TAB NAVIGASI BIKINAN ===== */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'HOME' && styles.activeTab]} 
          onPress={() => setActiveTab('HOME')}
        >
          <Text style={[styles.tabText, activeTab === 'HOME' && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'TIMELINE' && styles.activeTab]} 
          onPress={() => setActiveTab('TIMELINE')}
        >
          <Text style={[styles.tabText, activeTab === 'TIMELINE' && styles.activeTabText]}>Timeline & Alerts</Text>
        </TouchableOpacity>
      </View>

      {/* ===== KONDISI RENDER BERDASARKAN TAB ===== */}
      {activeTab === 'HOME' ? (
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
            <Text>Outside duration: {outsideDuration} min/day</Text>

            <View style={styles.mapWrap}>
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
                <Marker coordinate={latestPoint} />
              </MapView>
            </View>

            <Text
              style={styles.toggle}
              onPress={() => setShowLogs(v => !v)}>
              {showLogs ? 'Hide Location Logs' : 'Show Location Logs'}
            </Text>

            {showLogs && <LocationLogList />}
          </View>
        </ScrollView>
      ) : (
        // Kalau Tab Timeline dipilih, render fitur D1 & D2
        <View style={{ flex: 1 }}>
          <TimelineScreen />
        </View>
      )}

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
  // Style baru buat Tab Navigasi
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  activeTabText: {
    color: '#007bff',
  },
  // Style lama lo
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