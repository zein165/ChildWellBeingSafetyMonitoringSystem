import React, {useMemo} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Provider} from 'react-redux';
import {store} from './src/app/store';
import {useAppSelector} from './src/app/hooks';
import {evaluateRules} from './src/features/rules/evaluator';
import {LocationTracker} from './src/features/location/LocationTracker';

// IMPORT KOMPONEN LOCATION TRACKER YANG BARU DIBUAT
// Pastikan path-nya sesuai dengan tempat kamu menyimpan file LocationTracker.tsx

function Dashboard(): React.JSX.Element {
  const digital = useAppSelector(state => state.digitalMonitoring.dailySummary);
  const inventory = useAppSelector(state => state.appInventory.installedApps);
  const location = useAppSelector(state => state.location);
  const timeline = useAppSelector(state => state.timeline.events);
  const alerts = useAppSelector(state => state.rules.alertHistory);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const evaluations = useMemo(() => evaluateRules(store.getState()), [digital, location, alerts]);

  const latestPoint = location.history[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Child Wellbeing Monitor</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>1) Digital Activity Monitoring</Text>
          <Text>Screen time estimate: {digital.totalMinutes} min</Text>
          <Text>Game usage: {digital.gameMinutes} min</Text>
          <Text>Non-game usage: {digital.nonGameMinutes} min</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>2) App Inventory Monitoring</Text>
          <Text>Installed apps: {inventory.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>3) Location & Outside Activity</Text>
          <Text>Outside duration: {location.outsideDurationMinutes} min/day</Text>
          <View style={styles.mapWrap}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: latestPoint?.latitude ?? 37.78825,
                longitude: latestPoint?.longitude ?? -122.4324,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              {latestPoint ? <Marker coordinate={{latitude: latestPoint.latitude, longitude: latestPoint.longitude}} /> : null}
            </MapView>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>4) Timeline & Reporting</Text>
          <Text>Total events: {timeline.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>5) Rule & Alert System</Text>
          <Text>Alert history: {alerts.length}</Text>
          {evaluations.map(e => (
            <Text key={e.rule.id}>{e.rule.name}: {e.actual} ({e.passed ? 'TRIGGERED' : 'OK'})</Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.trackerContainer}>
        <LocationTracker />
      </View>
    </SafeAreaView>
  );
}

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#f4f7fb'},
  container: {padding: 16, gap: 12, paddingBottom: 20},
  title: {fontSize: 24, fontWeight: '700', color: '#18253a'},
  card: {backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 4},
  cardTitle: {fontSize: 16, fontWeight: '700', color: '#223a63'},
  mapWrap: {height: 180, borderRadius: 8, overflow: 'hidden', marginTop: 8},
  map: {flex: 1},
  
  trackerContainer: {
    height: 250, 
    borderTopWidth: 1, 
    borderColor: '#ddd',
    backgroundColor: '#fff'
  }
});