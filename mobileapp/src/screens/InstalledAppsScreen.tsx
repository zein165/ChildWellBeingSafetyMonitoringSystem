import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { InstalledApps } from 'react-native-launcher-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';

export default function InstalledAppsScreen() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const getCategory = (packageName: string, label: string) => {
    const pkg = packageName.toLowerCase();
    const name = label.toLowerCase();
    
    if (pkg.includes('whatsapp') || pkg.includes('instagram') || pkg.includes('facebook') || pkg.includes('tiktok') || pkg.includes('twitter') || pkg.includes('telegram') || pkg.includes('line') || pkg.includes('snapchat') || pkg.includes('discord')) return '💬 Sosial Media';
    if (pkg.includes('game') || pkg.includes('tencent') || pkg.includes('moonton') || pkg.includes('roblox') || pkg.includes('pubg') || pkg.includes('freefire') || pkg.includes('supercell') || pkg.includes('king') || pkg.includes('ea') || pkg.includes('playrix') || pkg.includes('zynga') || name.includes('game') || name.includes('craft') || name.includes('simulator') || name.includes('puzzle') || name.includes('rpg') || name.includes('clash') || name.includes('surfers') || name.includes('racing') || name.includes('strike')) return '🎮 Game';
    if (pkg.includes('youtube') || pkg.includes('netflix') || pkg.includes('spotify') || pkg.includes('vidio') || pkg.includes('disney') || pkg.includes('viu') || pkg.includes('bilibili')) return '🎬 Hiburan';
    if (pkg.includes('ruangguru') || pkg.includes('brainly') || pkg.includes('duolingo') || pkg.includes('zenius') || pkg.includes('classroom')) return '📚 Edukasi';
    if (pkg.includes('google') || pkg.includes('android') || pkg.includes('system') || pkg.includes('samsung') || pkg.includes('xiaomi') || pkg.includes('miui') || pkg.includes('coloros')) return '⚙️ Sistem';
    return '📦 Umum';
  };

  // FUNGSI BARU: Memberikan warna cantik sesuai kategori
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '💬 Sosial Media': return { bg: '#E3F2FD', text: '#1565C0' }; // Biru
      case '🎮 Game': return { bg: '#F3E5F5', text: '#7B1FA2' }; // Ungu
      case '🎬 Hiburan': return { bg: '#FFEBEE', text: '#C62828' }; // Merah
      case '📚 Edukasi': return { bg: '#E8F5E9', text: '#2E7D32' }; // Hijau
      case '⚙️ Sistem': return { bg: '#ECEFF1', text: '#546E7A' }; // Abu-abu
      default: return { bg: '#FFF3E0', text: '#E65100' }; // Oranye (Umum)
    }
  };

  const fetchAndCompareApps = async () => {
    try {
      const currentApps = await InstalledApps.getSortedApps({ includeVersion: false, includeAccentColor: false });
      
      const categorizedApps = currentApps.map(app => ({
        ...app,
        category: getCategory(app.packageName, app.label)
      }));
      setApps(categorizedApps);

      const savedAppsJson = await AsyncStorage.getItem('@saved_apps');
      if (savedAppsJson) {
        const savedApps = JSON.parse(savedAppsJson);
        const savedPackageNames = savedApps.map((a: any) => a.packageName);
        const currentPackageNames = currentApps.map(a => a.packageName);

        const newApps = currentApps.filter(a => !savedPackageNames.includes(a.packageName));
        const deletedApps = savedApps.filter((a: any) => !currentPackageNames.includes(a.packageName));

        if (newApps.length > 0) {
          triggerNotification('🚨 Aplikasi Baru Terdeteksi!', `Anak menginstal: ${newApps.map(a => a.label).join(', ')}`);
        }
        if (deletedApps.length > 0) {
          triggerNotification('🗑️ Aplikasi Dihapus!', `Aplikasi hilang: ${deletedApps.map(a => a.label).join(', ')}`);
        }
      }
      await AsyncStorage.setItem('@saved_apps', JSON.stringify(currentApps));
    } catch (error) {
      console.error("Gagal polling aplikasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerNotification = async (title: string, body: string) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({ id: 'app-alerts', name: 'App Alerts' });
    await notifee.displayNotification({
      title,
      body,
      android: { channelId, smallIcon: 'ic_launcher' },
    });
  };

  useEffect(() => {
    fetchAndCompareApps();
    const interval = setInterval(() => fetchAndCompareApps(), 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredApps = selectedCategory === 'Semua' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory);

  const categoriesList = ['Semua', '🎮 Game', '💬 Sosial Media', '🎬 Hiburan', '📚 Edukasi', '⚙️ Sistem', '📦 Umum'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Aplikasi</Text>
        <Text style={styles.headerSubtitle}>Pantau apa saja yang diinstal oleh anak.</Text>
      </View>

      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categoriesList.map((cat, index) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361EE" />
          <Text style={styles.loadingText}>Memuat aplikasi anak...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={(item, index) => item.packageName || index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const colors = getCategoryColor(item.category);
            return (
              <View style={styles.appCard}>
                {item.icon ? (
                  <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.appIcon} />
                ) : (
                  <View style={styles.appIconPlaceholder}>
                    <Text style={styles.placeholderText}>📱</Text>
                  </View>
                )}
                
                <View style={styles.appInfo}>
                  <Text style={styles.appName} numberOfLines={1}>{item.label}</Text>
                  <Text style={styles.appPackage} numberOfLines={1}>{item.packageName}</Text>
                  
                  <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.badgeText, { color: colors.text }]}>{item.category}</Text>
                  </View>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍃</Text>
              <Text style={styles.emptyTextTitle}>Wah, kosong nih!</Text>
              <Text style={styles.emptyTextSub}>Tidak ada aplikasi di kategori ini.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
  
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },

  categoryWrapper: { height: 60, marginBottom: 5 },
  categoryContainer: { paddingHorizontal: 20, alignItems: 'center' },
  categoryBtn: { 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    borderRadius: 25, 
    marginRight: 12, 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  categoryBtnActive: { backgroundColor: '#4361EE', borderColor: '#4361EE', elevation: 4 },
  categoryText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF', fontWeight: 'bold' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 30 },
  
  appCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    marginBottom: 14, 
    borderRadius: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  appIcon: { width: 54, height: 54, marginRight: 16, borderRadius: 12, backgroundColor: '#F8FAFC' },
  appIconPlaceholder: { width: 54, height: 54, marginRight: 16, backgroundColor: '#F1F5F9', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 24 },
  
  appInfo: { flex: 1, justifyContent: 'center' },
  appName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  appPackage: { fontSize: 12, color: '#94A3B8', marginBottom: 8 },
  
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 15, color: '#64748B', fontWeight: '500' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 50, marginBottom: 15 },
  emptyTextTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  emptyTextSub: { fontSize: 14, color: '#64748B', marginTop: 5 }
});