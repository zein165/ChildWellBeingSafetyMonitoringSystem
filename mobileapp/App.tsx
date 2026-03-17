import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TimelineScreen from './src/screens/TimelineScreen';
import ActiveProtectionScreen from './src/screens/ActiveProtectionScreen';

export default function App() {
  const [role, setRole] = useState<'parent' | 'child' | null>(null);

  // Fungsi untuk kembali ke layar awal
  const handleGoBack = () => setRole(null);

  if (role === 'parent') {
    return <TimelineScreen goBack={handleGoBack} />;
  }

  if (role === 'child') {
    return <ActiveProtectionScreen goBack={handleGoBack} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang!</Text>
      <Text style={styles.subtitle}>Siapa yang menggunakan HP ini?</Text>

      <TouchableOpacity style={styles.buttonParent} onPress={() => setRole('parent')}>
        <Text style={styles.buttonText}>👨‍👩‍👧 Saya Orang Tua</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonChild} onPress={() => setRole('child')}>
        <Text style={styles.buttonText}>👦👧 Saya Anak</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  buttonParent: { backgroundColor: '#2196F3', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 20, elevation: 3 },
  buttonChild: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, width: '100%', alignItems: 'center', elevation: 3 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});