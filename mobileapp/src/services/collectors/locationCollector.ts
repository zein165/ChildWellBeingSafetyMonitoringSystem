import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LocationPoint } from '../../types/domain';

// 1. Fungsi untuk meminta izin lokasi dari Android
export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Lokasi Dibutuhkan',
          message: 'Aplikasi ini butuh akses GPS untuk memantau lokasi anak.',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Batal',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

// 2. Fungsi untuk mengambil koordinat GPS saat ini
export function captureCurrentLocation(): Promise<LocationPoint> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          capturedAt: new Date().toISOString(),
          source: 'gps',
        });
      },
      err => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}

// 3. Fungsi untuk mengubah Koordinat menjadi Nama Jalan (Reverse Geocoding OSM)
export const getAddressFromCoords = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          // WAJIB: Memperkenalkan diri ke server OSM agar tidak diblokir
          'User-Agent': 'ChildMonitoringApp/1.0',
          // OPTIONAL: Minta balasan nama jalan dalam Bahasa Indonesia
          'Accept-Language': 'id' 
        }
      }
    );
    
    // Pastikan server membalas dengan status OK (200)
    if (!response.ok) {
      throw new Error(`Server OSM menolak: ${response.status}`);
    }

    const data = await response.json();
    return data.display_name || "Lokasi spesifik tidak diketahui";
  } catch (error) {
    console.error("Gagal mendapatkan alamat:", error);
    return "Gagal memuat nama jalan";
  }
};