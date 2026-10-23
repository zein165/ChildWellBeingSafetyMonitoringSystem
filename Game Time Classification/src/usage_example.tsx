// ============================================================
// STORY A2 — Game Time Classification (Mobile)
// Usage Example (e.g. inside App.tsx or a Context)
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { MonitoringService } from './MonitoringService';
import { GameMapping } from './types';

// configuration example
const GAME_MAPPING: GameMapping = {
    'com.supercell.clashofclans': { appName: 'Clash of Clans', isGame: true },
    'com.mojang.minecraftpe': { appName: 'Minecraft', isGame: true },
    'com.whatsapp': { appName: 'WhatsApp', isGame: false },
    'com.instagram.android': { appName: 'Instagram', isGame: false },
};

// Singleton instance (best practice for service)
const monitoringService = new MonitoringService(GAME_MAPPING);

const AppUsageMonitor = () => {
    const [summary, setSummary] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        // 1. Initialize Service
        monitoringService.initialize();

        // 2. Setup periodic refresh for UI
        const interval = setInterval(refreshData, 5000);

        return () => {
            // Cleanup
            monitoringService.destroy();
            clearInterval(interval);
        };
    }, []);

    const refreshData = async () => {
        const s = await monitoringService.getDailySummary();
        const l = await monitoringService.getTodayLogs();
        setSummary(s);
        setLogs(l);
    };

    // Simulate Receiving Data from Native Module (Development only)
    const simulateAppLaunch = (pkg: string) => {
        monitoringService.onPackageForeground(pkg);
    };

    const simulateGoHome = () => {
        // Technically "System UI" comes to foreground, or nothing
        // In our logic, we stop tracking the previous package
        monitoringService.checkpoint();
        // usage: monitoringService.stopTracking(currentPkg);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Game Time Monitor</Text>

            {/* Simulation Controls */}
            <View style={styles.section}>
                <Text style={styles.subHeader}>Simulate Activity:</Text>
                <Button title="Launch Clash of Clans (Game)" onPress={() => simulateAppLaunch('com.supercell.clashofclans')} />
                <View style={{ height: 10 }} />
                <Button title="Launch WhatsApp (Non-Game)" onPress={() => simulateAppLaunch('com.whatsapp')} />
                <View style={{ height: 10 }} />
                <Button title="Go Home / Stop" onPress={simulateGoHome} />
            </View>

            {/* Summary Display */}
            {summary && (
                <View style={styles.section}>
                    <Text style={styles.subHeader}>Today's Summary</Text>
                    <Text>Total Screen Time: {summary.totalScreenTime}s</Text>
                    <Text style={{ fontWeight: 'bold', color: 'red' }}>
                        🎮 Game Time: {summary.totalGameTime}s
                    </Text>
                    <Text style={{ color: 'blue' }}>
                        📱 Non-Game Time: {summary.totalNonGameTime}s
                    </Text>
                </View>
            )}

            {/* Logs List */}
            <View style={styles.section}>
                <Text style={styles.subHeader}>Detailed Logs</Text>
                {logs.map((log, index) => (
                    <Text key={index} style={styles.logItem}>
                        {log.appName}: {log.usageDurationSeconds}s ({log.packageName})
                    </Text>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 50 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
    section: { marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    logItem: { fontSize: 14, marginBottom: 4, fontFamily: 'monospace' },
});

export default AppUsageMonitor;
