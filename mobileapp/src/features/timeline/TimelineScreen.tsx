import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getEventsByDate } from './storage';
import { TimelineEvent } from '../../types/domain';

export const TimelineScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  // 1. Fungsi memuat dan mengurutkan data berdasarkan tanggal
  const loadEvents = async (date: Date) => {
    const data = await getEventsByDate(date);
    
    // Acceptance Criteria: Urutan waktu benar (Sort dari pagi ke malam)
    const sortedData = data.sort((a, b) => 
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );
    
    setEvents(sortedData);
  };

  // Muat ulang data setiap kali tanggal berubah
  useEffect(() => {
    loadEvents(currentDate);
  }, [currentDate]);

  // 2. Fungsi Filter per Hari (Acceptance Criteria: Bisa difilter per hari)
  const changeDay = (daysToAdd: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    setCurrentDate(newDate);
  };

  // 3. Desain UI untuk setiap kotak event (Tampilkan timeline list)
  const renderEventItem = ({ item }: { item: TimelineEvent }) => {
    // Format waktu agar cantik (Contoh: "14:30")
    const timeString = new Date(item.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.card}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{timeString}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.detail}>{item.detail}</Text>
          <Text style={styles.typeTag}>{item.type.toUpperCase()}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER: Filter Tanggal */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => changeDay(-1)}>
          <Text style={styles.buttonText}>⬅️ Prev</Text>
        </TouchableOpacity>
        
        <Text style={styles.dateText}>
          {currentDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={() => changeDay(1)}>
          <Text style={styles.buttonText}>Next ➡️</Text>
        </TouchableOpacity>
      </View>

      {/* LIST: Menampilkan data */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada aktivitas yang tercatat pada hari ini.</Text>
        }
      />
    </View>
  );
};

// --- STYLING (CSS untuk React Native) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#ffffff',
    elevation: 3 // shadow untuk android
  },
  button: { padding: 8, backgroundColor: '#e0e7ff', borderRadius: 8 },
  buttonText: { color: '#4f46e5', fontWeight: 'bold' },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  listContainer: { padding: 16 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#ffffff', 
    marginBottom: 12, 
    borderRadius: 12, 
    padding: 12,
    elevation: 1 
  },
  timeBadge: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingRight: 12, 
    borderRightWidth: 1, 
    borderColor: '#eee' 
  },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  cardContent: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  detail: { fontSize: 14, color: '#555', marginTop: 4 },
  typeTag: { 
    marginTop: 8, 
    fontSize: 10, 
    color: '#fff', 
    backgroundColor: '#4f46e5', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888', fontStyle: 'italic' }
});