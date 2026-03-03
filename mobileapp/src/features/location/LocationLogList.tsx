import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LocationLog = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string | number;
};

const STORAGE_KEY = '@location_logs';

export const LocationLogList = () => {
  const [logs, setLogs] = useState<LocationLog[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        return;
      }

      const parsed = JSON.parse(data);
      const normalized = parsed
        .map((i: any) => ({
          latitude: i.latitude ?? i.Latitude,
          longitude: i.longitude ?? i.Longitude,
          accuracy: i.accuracy ?? i.Accuracy ?? 0,
          timestamp: i.timestamp ?? i.Timestamp,
        }))
        .filter(
          (i: LocationLog) =>
            typeof i.latitude === 'number' && typeof i.longitude === 'number',
        );

      setLogs(normalized);
    };

    load();
  }, []);

  return (
    <View style={styles.box}>
      <ScrollView nestedScrollEnabled={true}>
        {logs.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.text}>
              Lat: {item.latitude.toFixed(5)}, Lng: {item.longitude.toFixed(5)}
            </Text>
            <Text style={styles.text}>Accuracy: {item.accuracy} m</Text>
            <Text style={styles.time}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 120, // 🔥 INI KUNCINYA
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    fontSize: 13,
  },
  time: {
    fontSize: 11,
    color: '#666',
  },
});
