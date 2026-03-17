// Fungsi untuk menghitung jarak (dalam METER) antara dua titik GPS (Rumus Haversine)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Jari-jari bumi dalam meter
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Hasil akhirnya adalah METER
  return distance;
};

// Fungsi untuk mengecek apakah anak KELUAR dari batas aman
export const isOutsideSafeZone = (
  currentLat: number,
  currentLon: number,
  homeLat: number,
  homeLon: number,
  safeRadiusMeters: number
): boolean => {
  const distance = calculateDistance(currentLat, currentLon, homeLat, homeLon);
  console.log(`Jarak dari rumah: ${distance.toFixed(2)} meter`);
  
  // Jika jarak lebih besar dari radius aman, berarti di LUAR (true)
  return distance > safeRadiusMeters;
};