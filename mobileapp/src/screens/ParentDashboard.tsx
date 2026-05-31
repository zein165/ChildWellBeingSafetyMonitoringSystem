import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { ref, onChildAdded, query, limitToLast, onValue } from 'firebase/database';
import { db } from '../firebaseConfig'; 

import ParentStatusScreen from './ParentStatusScreen';
import TimelineScreen from './TimelineScreen';
import ParentHistoryScreen from './ParentHistoryScreen';

export default function ParentDashboard({ goBackToRoleSelection }: { goBackToRoleSelection: () => void }) {
  const [activeTab, setActiveTab] = useState<'status' | 'timeline' | 'history'>('status');
  
  // 🔥 STATE UNTUK MENAMPUNG FOTO DARI ANAK
  const [childPhoto, setChildPhoto] = useState<string | null>(null);

  // 🔥 FUNGSI UNTUK MEMUNCULKAN NOTIFIKASI
  const triggerNotification = async (title: string, body: string) => {
    try {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        console.log('🔴 Izin notifikasi ditolak oleh Android!');
        Alert.alert('Izin Ditolak', 'Mohon izinkan notifikasi di pengaturan HP.');
        return;
      }

      const channelId = await notifee.createChannel({ 
        id: 'sos_alert_urgent', 
        name: 'Panggilan Darurat SOS', 
        importance: 4 
      });

      await notifee.displayNotification({
        title: title,
        body: body,
        android: { 
          channelId, 
          smallIcon: 'ic_launcher',
          color: '#DC2626' 
        }
      });
      console.log('🟢 Notifikasi berhasil dikirim ke layar!');
    } catch (error) {
      console.log('🔴 Error Notifee:', error);
    }
  };

  // 🔥 LISTENER FIREBASE (Untuk Alarm SOS)
  useEffect(() => {
    const timelineRef = query(ref(db, 'timeline/child1'), limitToLast(1));

    const unsubscribe = onChildAdded(timelineRef, (snapshot) => {
      const data = snapshot.val();
      console.log("📥 [MASUK/CEK DATA] Firebase:", data); 

      const isAlert = data?.eventType === 'ALERT' || data?.type === 'ALERT';
      const isSOS = data?.payload?.includes('SOS') || data?.message?.includes('SOS') || data?.description?.includes('SOS');

      // Jika data terakhir yang dibaca adalah SOS, langsung bunyikan alarm!
      if (isAlert && isSOS) {
        console.log("🚨 [SOS TERDETEKSI] Menyalakan alarm!!!");
        triggerNotification('🚨 DARURAT: Panggilan SOS!', 'Anak Anda menekan tombol darurat. Segera periksa statusnya!');
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 LISTENER FIREBASE (Untuk Mendapatkan Foto Terbaru dari Anak)
  useEffect(() => {
    const photoRef = ref(db, 'commands/child1/lastPhoto');

    const unsubscribe = onValue(photoRef, (snapshot) => {
      if (snapshot.exists()) {
        const base64Data = snapshot.val();
        setChildPhoto(base64Data); // Memasukkan kode foto ke dalam state
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        {activeTab === 'status' && <ParentStatusScreen />}
        {activeTab === 'timeline' && <TimelineScreen goBack={goBackToRoleSelection} />}
        {activeTab === 'history' && <ParentHistoryScreen />}
      </View>

      {/* 🔥 POP-UP (MODAL) TAMPILAN FOTO DARI ANAK */}
      {childPhoto && (
        <Modal transparent={true} animationType="fade" visible={!!childPhoto}>
          <View style={styles.modalBackground}>
            <View style={styles.photoCard}>
              <Text style={styles.photoTitle}>📸 Hasil Jepretan Anak</Text>
              
              <Image 
                source={{ uri: `data:image/jpeg;base64,${childPhoto}` }} 
                style={styles.previewImage} 
              />
              
              <TouchableOpacity 
                style={styles.closeBtn} 
                onPress={() => setChildPhoto(null)} // Tombol untuk menutup foto
              >
                <Text style={styles.closeBtnText}>Tutup Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('status')}>
          <Text style={styles.iconText}>📡</Text>
          <Text style={[styles.tabText, activeTab === 'status' && styles.activeTabText]}>Pantau</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('timeline')}>
          <Text style={styles.iconText}>🕒</Text>
          <Text style={[styles.tabText, activeTab === 'timeline' && styles.activeTabText]}>Notif</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('history')}>
          <Text style={styles.iconText}>📊</Text>
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Aplikasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  contentArea: { flex: 1 }, 
  tabBar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0',
    paddingVertical: 10, paddingBottom: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22, marginBottom: 4 },
  tabText: { fontSize: 11, color: '#888', fontWeight: '600' },
  activeTabText: { color: '#059669', fontWeight: 'bold' },

  /* 🔥 STYLE UNTUK POP-UP FOTO */
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Latar belakang hitam transparan
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoCard: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  photoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 350, // Tinggi foto
    borderRadius: 15,
    resizeMode: 'cover',
    backgroundColor: '#EEE',
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: '#DC2626', // Warna merah
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});