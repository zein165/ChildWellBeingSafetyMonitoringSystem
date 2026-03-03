import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Tentukan Titik "Home" 
const HOME_COORDS = { latitude: -6.347, longitude: 106.741 };
const SAFE_RADIUS_METERS = 50; // Jarak aman 50 meter

// 2. Rumus Haversine buat ngitung jarak
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Radius bumi
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

export const processGeofence = async (currentLat: number, currentLng: number) => {
    try {
        const distance = calculateDistance(
            HOME_COORDS.latitude,
            HOME_COORDS.longitude,
            currentLat,
            currentLng
        );

        const currentState = distance > SAFE_RADIUS_METERS ? 'OUTSIDE' : 'INSIDE';
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `@geofence_log_${today}`;

        let outsideDuration = 0;
        const existingData = await AsyncStorage.getItem(storageKey);

        if (existingData) {
            const parsed = JSON.parse(existingData);
            outsideDuration = parsed.OutsideDurationSeconds || 0;
        }


        if (currentState === 'OUTSIDE') {
            outsideDuration += 300;
        }

        const outputData = {
            Date: today,
            OutsideDurationSeconds: outsideDuration,
            CurrentState: currentState,
        };

        await AsyncStorage.setItem(storageKey, JSON.stringify(outputData));


        console.log(`📍 Geofence Check -> Jarak: ${distance}m | Status: ${currentState} | Total Luar: ${outsideDuration}s`);

        return outputData;
    } catch (error) {
        console.error('Error proses geofence:', error);
    }
};

