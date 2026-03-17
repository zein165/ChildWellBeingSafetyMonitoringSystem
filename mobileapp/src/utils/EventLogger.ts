import { ref, push, set } from 'firebase/database';
import { db } from '../firebaseConfig';

// Definisikan Event Model (Sesuai kriteria D1)
export type EventType = 'LOCATION' | 'USAGE' | 'ALERT';

export interface AppEvent {
  eventType: EventType;
  payload: string;
  timestamp: string;
}

// Fungsi untuk menyimpan event ke Firebase
export const logEvent = (eventType: EventType, payload: string) => {
  const timestamp = new Date().toISOString(); // Menggunakan format ISO agar mudah diurutkan
  const timelineRef = ref(db, 'timeline/child1');
  
  // push() akan membuat ID unik secara otomatis untuk setiap event
  const newEventRef = push(timelineRef);

  set(newEventRef, {
    eventType,
    payload,
    timestamp,
  }).catch((err) => console.log('Gagal menyimpan event:', err));
};