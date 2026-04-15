import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChildScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛡️</Text>
      <Text style={styles.title}>Mode Perlindungan Aktif</Text>
      <Text style={styles.desc}>
        Aplikasi sedang berjalan di latar belakang untuk menjaga keamananmu.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 20 },
  icon: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10, textAlign: 'center' },
  desc: { fontSize: 16, color: '#4CAF50', textAlign: 'center' }
});