import React from 'react';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { LocationLog } from './types';

export default function LocationMap({ latest }: { latest?: LocationLog }) {
  if (!latest) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: latest.latitude,
          longitude: latest.longitude,
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
            latitude: latest.latitude,
            longitude: latest.longitude,
          }}
          title="Current Location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  map: {
    flex: 1,
  },
});
