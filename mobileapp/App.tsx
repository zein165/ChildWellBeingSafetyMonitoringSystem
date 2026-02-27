import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

/* ====== IMPORT FEATURE ====== */
import {LocationTracker} from './src/features/location/LocationTracker';
import {LocationLogList} from './src/features/location/LocationLogList';

/* ====== MOCK STATE (SESUAI STRUKTUR LAMA) ====== */
const digital = {
  screenTimeHours: 5.2,
};

const inventory = {
  deviceCount: 3,
};

const timeline = {
  sleepHours: 6.5,
};

const rules = {
  activeRules: 2,
};

const location = {
  outsideDurationMinutes: 45,
};

const latestPoint = {
  latitude: -6.200000,
  longitude: 106.816666,
};

export default function App() {
  const [showLogs, setShowLogs] = useState(false);

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

        {/* ===== 3. LOCATION ===== */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3) Location & Outside Activity</Text>
          <Text>
            Outside duration: {location.outsideDurationMinutes} min/day
          </Text>

          <View style={styles.mapWrap}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: latestPoint.latitude,
                longitude: latestPoint.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
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
  },
});