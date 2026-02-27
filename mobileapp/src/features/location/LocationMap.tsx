import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import { LocationLog } from './types';

export default function LocationMap({
  latest,
}: {
  latest?: LocationLog;
}) {
  if (!latest) return null;

  return (
    <View style={{ height: 250 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: latest.latitude,
          longitude: latest.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
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