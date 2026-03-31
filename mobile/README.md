# 📱 Child Well Being Safety Monitoring System Mobile App

## 🚀 Getting Started

Ikuti langkah berikut untuk menjalankan project di local.

---

## 📦 1. Install Dependencies

```bash
npm install
```

atau

```bash
yarn install
```

---

## ⚙️ 2. Setup Environment Variables

Copy file `.env.example`:

```bash
cp .env.example .env
```

```env
API_BASE_URL=http://YOUR_LOCAL_IP:3000/api
```

> ⚠️ Gunakan IP lokal (bukan `localhost`) jika menggunakan device fisik.

Contoh:

```env
API_BASE_URL=http://192.168.1.10:3000/api
```

---

## 🤖 3. Run Android

```bash
npm run android
```

---

## 🔄 5. Start Metro (jika belum jalan)

```bash
npx react-native start
```

---

## 🧹 Troubleshooting

### Clear cache

```bash
npx react-native start --reset-cache
```

### Clean build Android

```bash
cd android && ./gradlew clean
```

---

## 🔐 Notes

* Project menggunakan:

  * Zustand (state management)
  * react-native-config (.env)
* Jangan commit file `.env`
* Gunakan `.env.example` sebagai referensi

---

## 👨‍💻 Development Tips

* Gunakan IP lokal untuk backend
* Pastikan backend berjalan sebelum menjalankan app
* Jika API tidak terhubung, cek:

  * IP address
  * Firewall
  * Port backend

---

## 📌 Tech Stack

* React Native
* Zustand
* React Native Paper
* Axios

---