import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveRulesSettings, getRulesSettings } from '../services/StorageService';

const SettingsScreen = () => {
  const [gameLimit, setGameLimit] = useState('120');
  const [curfewTime, setCurfewTime] = useState('21:00');

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await getRulesSettings();
      setGameLimit(saved.gameLimit.toString());
      setCurfewTime(saved.curfewTime);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await saveRulesSettings(parseInt(gameLimit), curfewTime);
    Alert.alert('Sukses', 'Aturan baru berhasil disimpan! ✅');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pengaturan Aturan</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>🎮 Batas Waktu Main Game (Menit)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={gameLimit} 
          onChangeText={setGameLimit} 
        />

        <Text style={styles.label}>🌙 Jam Malam (Format HH:MM)</Text>
        <TextInput 
          style={styles.input} 
          value={curfewTime} 
          onChangeText={setCurfewTime} 
          placeholder="Contoh: 21:00"
        />

        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
          <Text style={styles.btnText}>Simpan Pengaturan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16, justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 3 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#CED4DA', borderRadius: 8, padding: 12, fontSize: 16, color: '#000' },
  btnSave: { backgroundColor: '#0D6EFD', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default SettingsScreen;