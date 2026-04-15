import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TimelineScreen from './TimelineScreen';
import SetHomeLocationScreen from './SetHomeLocationScreen';

export default function ParentDashboard({ goBackToRoleSelection }: { goBackToRoleSelection: () => void }) {
  // State untuk melacak tab mana yang sedang aktif ('timeline' atau 'map')
  const [activeTab, setActiveTab] = useState<'timeline' | 'map'>('timeline');

  return (
    <View style={styles.container}>
      {/* 1. AREA KONTEN UTAMA (Berubah sesuai tab yang diklik) */}
      <View style={styles.contentArea}>
        {activeTab === 'timeline' ? (
          <TimelineScreen goBack={goBackToRoleSelection} />
        ) : (
          <SetHomeLocationScreen goBack={() => setActiveTab('timeline')} />
        )}
      </View>

      {/* 2. AREA MENU TAB BAWAH */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('timeline')}
        >
          <Text style={styles.iconText}>🕒</Text>
          <Text style={[styles.tabText, activeTab === 'timeline' && styles.activeTabText]}>
            Riwayat Anak
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('map')}
        >
          <Text style={styles.iconText}>📍</Text>
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
            Atur Rumah
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  contentArea: { flex: 1 }, // Memakan semua sisa ruang di atas tab
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    paddingBottom: 20, // Tambahan padding bawah biar gak nabrak tepi layar HP
    elevation: 8, // Efek bayangan di Android
    shadowColor: '#000', // Efek bayangan di iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#2196F3', // Warna biru kalau tab sedang aktif
    fontWeight: 'bold',
  }
});