import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ref, set } from 'firebase/database'; 
import { db } from '../firebaseConfig'; // 🔥 Pastikan import db dari config bos

export default function SetHomeLocationScreen({ goBack }: { goBack: () => void }) {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: -6.175392, 
    longitude: 106.827153,
  });

  const handleSaveHome = () => {
    // 🔥 1. JALUR DIPERBAIKI: Simpan ke rules/child1/homeLocation agar sinkron!
    const homeRef = ref(db, 'rules/child1/homeLocation');
    
    set(homeRef, {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      radius: 50 // Samakan dengan deteksi 50 meter di TimelineScreen
    })
    .then(() => {
      // 🔥 2. Reset status anak seolah-olah sedang di rumah saat set lokasi baru
      set(ref(db, 'rules/child1/isOutsideStatus'), false);
      set(ref(db, 'rules/child1/lastLeftHomeTime'), null); // Hapus memori jam keluar sebelumnya

      Alert.alert("Sukses! 🎉", "Lokasi rumah berhasil diperbarui di Firebase.");
      goBack();
    })
    .catch((error) => {
      Alert.alert("Gagal", "Gagal menyimpan lokasi: " + error.message);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>🔙 Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📍 Atur Lokasi Rumah</Text>
      </View>

      <Text style={styles.subtitle}>Geser dan ketuk peta untuk memindahkan Pin merah ke lokasi rumah yang benar.</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
        >
          <Marker 
            coordinate={selectedLocation} 
            title="Lokasi Rumah" 
            description="Titik ini akan jadi pusat pantauan anak"
          />
        </MapView>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveHome}>
        <Text style={styles.saveText}>💾 Simpan Lokasi Ini</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F8F9FA', elevation: 2 },
  backButton: { marginRight: 15 },
  backText: { fontSize: 16, color: '#2196F3', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { textAlign: 'center', color: 'gray', padding: 10, fontSize: 14 },
  mapContainer: { flex: 1, width: '100%', overflow: 'hidden' },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, margin: 20, borderRadius: 10, alignItems: 'center', elevation: 3 },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});