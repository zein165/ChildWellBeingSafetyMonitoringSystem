// TimelineLogic.test.ts
import { describe, it, expect } from '@jest/globals';
// 1. Kita copas dulu fungsi aslinya ke sini (atau import jika sudah dipisah filenya)
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

// 2. Mulai pengujian dengan Jest
describe('Fungsi Pengecek Jarak (Geofence)', () => {
  
  it('harus mengembalikan angka 0 jika koordinatnya sama persis', () => {
    const jarak = getDistanceInMeters(-6.2, 106.8, -6.2, 106.8);
    expect(jarak).toBe(0);
  });

  it('harus bisa mendeteksi jarak lebih dari 50 meter (Anak keluar rumah)', () => {
    // Koordinat 1: Monas, Koordinat 2: Bundaran HI (Jarak aslinya sekitar 2-3 KM)
    const jarak = getDistanceInMeters(-6.175392, 106.827153, -6.1949, 106.8236);
    expect(jarak).toBeGreaterThan(50); 
  });

});