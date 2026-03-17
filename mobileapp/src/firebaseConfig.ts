import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase milikmu
const firebaseConfig = {
  apiKey: "AIzaSyB0xESudWCQGs5Y7oB8l-YduuL9InR1lnI",
  authDomain: "childsafetyapp-4f9e3.firebaseapp.com",
  databaseURL: "https://childsafetyapp-4f9e3-default-rtdb.firebaseio.com",
  projectId: "childsafetyapp-4f9e3",
  storageBucket: "childsafetyapp-4f9e3.firebasestorage.app",
  messagingSenderId: "777282671580",
  appId: "1:777282671580:web:2735e92bf4e7bba4a8b519"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor Database supaya bisa dipakai di layar lain
export const db = getDatabase(app);