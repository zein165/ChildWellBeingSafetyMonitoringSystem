import { logEvent } from './EventLogger';
import notifee, { AndroidImportance } from '@notifee/react-native';

export let currentCurfew = '20:00'; 
export let isChildOutside = false; 

// D2: Batas Waktu Main Game
export let maxGameTimeMinutes = 120; // Default 2 jam
export let currentGameTimeMinutes = 0; 

let hasCurfewTriggered = false; 
let hasGameAlertTriggered = false;

// Update dari Firebase
export const updateCurfewRule = (newTime: string) => {
  currentCurfew = newTime;
  hasCurfewTriggered = false; 
};

export const updateOutsideStatus = (status: boolean) => {
  isChildOutside = status;
  if (!status) hasCurfewTriggered = false; 
};

export const updateMaxGameTime = (minutes: number) => {
  maxGameTimeMinutes = minutes;
  hasGameAlertTriggered = false; 
};

// Update dari Simulasi Layar Anak
export const updateCurrentGameTime = (minutes: number) => {
  currentGameTimeMinutes = minutes;
};

// Fungsi membunyikan alarm di HP Anak
const triggerLocalAlarm = async (title: string, body: string) => {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'safety_alerts', name: 'Safety Alerts', importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title, body, android: { channelId, smallIcon: 'ic_launcher' },
  });
};

export const evaluateRules = () => {
  const now = new Date();
  
  // 1. Evaluasi Jam Malam
  const [threshHour, threshMinute] = currentCurfew.split(':').map(Number);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isPastCurfew = currentHour > threshHour || (currentHour === threshHour && currentMinute >= threshMinute);

  if (isPastCurfew && isChildOutside) {
    if (!hasCurfewTriggered) {
      logEvent('ALERT', `🚨 PELANGGARAN JAM MALAM: Anak masih di luar melewati jam ${currentCurfew}!`);
      triggerLocalAlarm('🚨 PERINGATAN JAM MALAM!', 'Kamu belum pulang padahal sudah lewat jam malam!');
      hasCurfewTriggered = true; 
    }
  } else if (!isPastCurfew) {
    hasCurfewTriggered = false; 
  }

  // 2. Evaluasi Batas Main Game
  if (currentGameTimeMinutes >= maxGameTimeMinutes) {
    if (!hasGameAlertTriggered) {
      logEvent('ALERT', `📱 BATAS GAME TERLEWATI: Anak bermain lebih dari ${maxGameTimeMinutes} menit!`);
      triggerLocalAlarm('📱 WAKTU HABIS!', `Kamu sudah main aplikasi selama ${currentGameTimeMinutes} menit. Ayo istirahat!`);
      hasGameAlertTriggered = true; 
    }
  } else {
    hasGameAlertTriggered = false; 
  }
};