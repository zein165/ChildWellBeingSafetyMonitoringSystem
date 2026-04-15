import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RoleSelectionScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang!</Text>
      <Text style={styles.subtitle}>Siapa yang menggunakan HP ini?</Text>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#007BFF' }]}
        onPress={() => navigation.navigate('Parent')}
      >
        <Text style={styles.buttonText}>👨‍👩‍👧 Saya Orang Tua</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#28A745' }]}
        onPress={() => navigation.navigate('Child')}
      >
        <Text style={styles.buttonText}>👦 Saya Anak</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  button: { width: '100%', padding: 20, borderRadius: 10, marginBottom: 15, alignItems: 'center', elevation: 3 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});