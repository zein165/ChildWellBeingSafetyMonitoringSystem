import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// Sesuaikan import database di bawah ini dengan file konfigurasi Firebase kamu
import { getDatabase, ref, set } from 'firebase/database'; 

export default function SetHomeLocationScreen({ goBack }: { goBack: () => void }) {
  // Posisi default awal (misal: Monas / Tengah Kota)
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: -6.175392, 
    longitude: 106.827153,
  });

  const db = getDatabase();

  // Fungsi untuk menyimpan titik kordinat ke Firebase
  const handleSaveHome = () => {
    const homeRef = ref(db, 'geofence/home');
    set(homeRef, {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      radius: 100 // Radius batas aman (misal 100 meter dari rumah)
    })
    .then(() => {
      Alert.alert("Sukses! 🎉", "Lokasi rumah berhasil diperbarui di Firebase.");
      goBack(); // Kembali ke halaman sebelumnya setelah berhasil save
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

      <MapView
        style={styles.map}
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
  map: { flex: 1 },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, margin: 20, borderRadius: 10, alignItems: 'center', elevation: 3 },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});