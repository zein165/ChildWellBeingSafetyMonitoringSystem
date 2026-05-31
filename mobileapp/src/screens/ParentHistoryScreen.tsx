import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebaseConfig'; // Sesuaikan path jika berbeda

export default function ParentHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<any[]>([]);
  // Mengambil tanggal hari ini dengan format YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    setLoading(true);
    const historyRef = dbRef(db, `usage/child1/${selectedDate}`);

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Transformasi data object ke array untuk FlatList
        const formattedList = Object.keys(data)
          .filter(key => key !== 'total_device_time' && key !== 'total_game_time')
          .map(key => ({
            id: key,
            appName: key.replace(/_/g, '.'), // Kembalikan underscore jadi titik
            duration: data[key]
          }))
          .sort((a, b) => b.duration - a.duration); // Urutkan dari durasi terlama

        setUsageData(formattedList);
        setTotalTime(data.total_device_time || 0);
      } else {
        setUsageData([]);
        setTotalTime(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  // Fungsi mengubah detik ke format Jam, Menit, Detik
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) return `${h}j ${m}m ${s}d`;
    if (m > 0) return `${m}m ${s}d`;
    return `${s} detik`;
  };

  // Fungsi ganti tanggal (Kemarin / Besok)
  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER & FILTER TANGGAL */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Aplikasi 📊</Text>
        <View style={styles.datePicker}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateBtn}>
            <Text style={styles.dateBtnText}>◀</Text>
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>{isToday ? "Hari Ini" : selectedDate}</Text>
          </View>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateBtn} disabled={isToday}>
            <Text style={[styles.dateBtnText, isToday && { opacity: 0.3 }]}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RINGKASAN TOTAL */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Penggunaan HP</Text>
        <Text style={styles.summaryValue}>{formatTime(totalTime)}</Text>
      </View>

      {/* DAFTAR APLIKASI */}
      {loading ? (
        <ActivityIndicator size="large" color="#059669" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={usageData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada data aktivitas untuk tanggal ini.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.appItem}>
              <View style={styles.appIconPlaceholder}>
                <Text style={{fontSize: 20}}>📱</Text>
              </View>
              <View style={styles.appInfo}>
                <Text style={styles.appName} numberOfLines={1}>{item.appName}</Text>
                <Text style={styles.appDuration}>{formatTime(item.duration)}</Text>
              </View>
              <View style={styles.progressBarBg}>
                 <View style={[styles.progressBarFill, { width: `${Math.min((item.duration / totalTime) * 100, 100)}%` }]} />
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#FFF', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  datePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 25, padding: 5 },
  dateBtn: { padding: 10, width: 45, alignItems: 'center' },
  dateBtnText: { fontSize: 18, color: '#059669', fontWeight: 'bold' },
  dateDisplay: { paddingHorizontal: 20 },
  dateText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  
  summaryCard: { margin: 20, backgroundColor: '#059669', borderRadius: 15, padding: 20, elevation: 4 },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 5 },
  summaryValue: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },

  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  appItem: { 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10,
    elevation: 2
  },
  appIconPlaceholder: { width: 45, height: 45, backgroundColor: '#F3F4F6', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  appInfo: { flex: 1 },
  appName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  appDuration: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#9CA3AF', fontSize: 15 },
  
  progressBarBg: { width: 60, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#059669' }
});