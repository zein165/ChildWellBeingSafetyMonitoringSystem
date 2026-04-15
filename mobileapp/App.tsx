import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import TimelineScreen from './src/screens/TimelineScreen';
import ActiveProtectionScreen from './src/screens/ActiveProtectionScreen';

// Import mesin pelacaknya
import { LocationTracker } from './src/features/location/LocationTracker';

export default function App() {
  const [role, setRole] = useState<'parent' | 'child' | null>(null);

  // Fungsi untuk kembali ke layar awal
  const handleGoBack = () => setRole(null);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F7FB' }}>
      {/* 🚀 MESIN JALAN OTOMATIS DI BACKGROUND SEJAK APLIKASI DIBUKA */}
      <LocationTracker />

      {/* Tampilan Layar Sesuai Pilihan */}
      {role === 'parent' ? (
        <TimelineScreen goBack={handleGoBack} />
      ) : role === 'child' ? (
        <ActiveProtectionScreen goBack={handleGoBack} />
      ) : (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#F4F7FB" />
          
          {/* Bagian Header / Logo */}
          <View style={styles.headerContainer}>
            <View style={styles.logoWrapper}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>🛡️</Text>
              </View>
            </View>
            <Text style={styles.appTitle}>FamilyGuard</Text>
            <Text style={styles.appSubtitle}>Pilih peran Anda untuk mulai memantau dan melindungi aktivitas keluarga.</Text>
          </View>

          {/* Bagian Kartu Pilihan Peran */}
          <View style={styles.cardsContainer}>
            
            {/* KARTU ORANG TUA */}
            <TouchableOpacity 
              style={[styles.roleCard, styles.parentCard]} 
              activeOpacity={0.8}
              onPress={() => setRole('parent')}
            >
              <View style={styles.iconContainerParent}>
                <Text style={styles.cardEmoji}>👨‍👩‍👧</Text>
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Masuk sbg Orang Tua</Text>
                <Text style={styles.cardDescription}>Pantau lokasi, periksa aplikasi, & atur jam malam.</Text>
              </View>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>➔</Text>
              </View>
            </TouchableOpacity>

            {/* KARTU ANAK */}
            <TouchableOpacity 
              style={[styles.roleCard, styles.childCard]} 
              activeOpacity={0.8}
              onPress={() => setRole('child')}
            >
              <View style={styles.iconContainerChild}>
                <Text style={styles.cardEmoji}>👦📱</Text>
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Masuk sbg Anak</Text>
                <Text style={styles.cardDescription}>Aktifkan perlindungan & bagikan lokasi otomatis.</Text>
              </View>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>➔</Text>
              </View>
            </TouchableOpacity>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>🔒 Aman • Terenkripsi • Cepat</Text>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  // Header Styles
  headerContainer: {
    paddingHorizontal: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 20,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  logoCircle: {
    width: 90,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  logoEmoji: {
    fontSize: 45,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: -1,
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // Cards Styles
  cardsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  parentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainerParent: {
    width: 60,
    height: 60,
    backgroundColor: '#E0EAFF', // Biru muda
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconContainerChild: {
    width: 60,
    height: 60,
    backgroundColor: '#DCFCE7', // Hijau muda
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    paddingRight: 10,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Footer Styles
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});