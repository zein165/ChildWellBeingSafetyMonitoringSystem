import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../../../shared/constants/theme/colors';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  history?: Array<{ latitude: number; longitude: number }>;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  history = [],
}) => {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
          .marker-current {
            background-color: ${colors.primary};
            border: 2px solid white;
            border-radius: 50%;
            height: 12px;
            width: 12px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([${latitude}, ${longitude}], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          // Current Location Marker
          const currentIcon = L.divIcon({
            className: 'marker-current',
            iconSize: [12, 12]
          });
          L.marker([${latitude}, ${longitude}], { icon: currentIcon }).addTo(map);

          // History Path
          if (${history.length} > 0) {
            const path = ${JSON.stringify(history.map(h => [h.latitude, h.longitude]))};
            L.polyline(path, {
              color: '${colors.purple || '#6200ee'}',
              weight: 4,
              opacity: 0.6,
              dashArray: '10, 10'
            }).addTo(map);
            
            // Add dots for history points
            path.forEach(point => {
              L.circleMarker(point, {
                radius: 4,
                fillColor: '${colors.purple || '#6200ee'}',
                color: 'white',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              }).addTo(map);
            });

            // Adjust bounds to show track
            const bounds = L.latLngBounds(path.concat([[${latitude}, ${longitude}]]));
            map.fitBounds(bounds, { padding: [30, 30] });
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    flex: 1,
  },
});
