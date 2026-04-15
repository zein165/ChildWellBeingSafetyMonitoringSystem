import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// Pastikan letak (path) import ini sesuai dengan posisi file bos
import InstalledAppsScreen from './InstalledAppsScreen'; 

interface Props {
  goBack: () => void;
}

export default function ActiveProtectionScreen({ goBack }: Props) {
  // State untuk ngatur kapan mau nampilin layar daftar aplikasi
  const [showAppsList, setShowAppsList] = useState(false);

  // === TAMPILAN 1: Kalau tombol "Lihat Daftar Aplikasi" di-klik ===
  if (showAppsList) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        {/* Tombol Back untuk kembali ke Dasbor Anak */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setShowAppsList(false)}
        >
          <Text style={styles.backButtonText}>⬅ Kembali ke Dasbor Anak</Text>
        </TouchableOpacity>
        
        {/* Render Layar Daftar Aplikasi yang baru kita buat tadi */}
        <InstalledAppsScreen />
      </SafeAreaView>
    );
  }

  // === TAMPILAN 2: Dasbor Utama Anak (Default) ===
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🛡️ Dasbor Perlindungan Anak</Text>
        <Text style={styles.subtitle}>Sistem pemantauan latar belakang sedang aktif...</Text>

        {/* Tombol untuk membuka Daftar Aplikasi */}
        <TouchableOpacity 
          style={styles.buttonApps} 
          onPress={() => setShowAppsList(true)}
        >
          <Text style={styles.buttonText}>📱 Lihat Aplikasi Terinstal</Text>
        </TouchableOpacity>

        {/* Tombol untuk keluar dari mode Anak */}
        <TouchableOpacity 
          style={styles.buttonLogout} 
          onPress={goBack}
        >
          <Text style={styles.buttonText}>Ganti Peran (Log Out)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// === STYLING ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40, textAlign: 'center' },
  
  buttonApps: { 
    backgroundColor: '#198754', // Warna hijau 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20, 
    elevation: 3 
  },
  buttonLogout: { 
    backgroundColor: '#dc3545', // Warna merah 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    elevation: 3 
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  // Tombol kembali di atas layar daftar aplikasi
  backButton: { 
    padding: 15, 
    backgroundColor: '#e9ecef', 
    borderBottomWidth: 1, 
    borderColor: '#dee2e6' 
  },
  backButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  }
});