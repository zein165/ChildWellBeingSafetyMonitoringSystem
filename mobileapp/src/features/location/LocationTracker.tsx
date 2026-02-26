import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationLog {
  Latitude: number;
  Longitude: number;
  Accuracy: number;
  Timestamp: string;
}

const STORAGE_KEY = '@location_logs';

export const LocationTracker = () => {
  const [logs, setLogs] = useState<LocationLog[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          console.warn('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') setHasPermission(true);
    }
  };

  // Gunakan useCallback agar fungsi ini aman dimasukkan ke dalam useEffect
  const fetchAndStoreLocation = useCallback(() => {
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      async (position) => {
        const newLog: LocationLog = {
          Latitude: position.coords.latitude,
          Longitude: position.coords.longitude,
          Accuracy: position.coords.accuracy,
          Timestamp: new Date(position.timestamp).toISOString(),
        };

        setLogs((prevLogs) => {
          const updatedLogs = [newLog, ...prevLogs];
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs)).catch(console.error);
          return updatedLogs;
        });
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [hasPermission]); // hasPermission jadi dependency di sini

  useEffect(() => {
    const init = async () => {
      await requestLocationPermission();
      const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLogs) setLogs(JSON.parse(storedLogs));
    };
    init();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      fetchAndStoreLocation();
      const intervalId = setInterval(fetchAndStoreLocation, 300000); // 5 menit
      return () => clearInterval(intervalId);
    }
  }, [hasPermission, fetchAndStoreLocation]); // fetchAndStoreLocation ditambahkan di sini agar error hilang

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Location Logs (C1)</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.Timestamp}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>Lat: {item.Latitude.toFixed(5)}, Lng: {item.Longitude.toFixed(5)}</Text>
            <Text>Accuracy: {item.Accuracy.toFixed(2)}m</Text>
            <Text>Time: {new Date(item.Timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  listItem: { padding: 12, backgroundColor: 'white', marginBottom: 8, borderRadius: 8 },
});