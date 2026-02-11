# ChildWellBeingSafetyMonitoringSystem

## 📌 Overview

ChildWellBeingSafetyMonitoringSystem (CWSMS) adalah aplikasi mobile berbasis monitoring dan awareness yang dirancang untuk membantu orang tua memahami pola aktivitas digital dan fisik anak, dengan tujuan meningkatkan kesejahteraan, keamanan, dan kebiasaan hidup sehat anak.

Aplikasi ini tidak melakukan penyadapan konten, tidak membaca pesan pribadi, dan tidak melakukan kontrol paksa perangkat, melainkan berfokus pada pengumpulan metadata aktivitas untuk keperluan analisis, pelaporan, dan diskusi antara orang tua dan anak.

Proyek ini dikembangkan sebagai Project-Based Learning pada mata kuliah Pengembangan Aplikasi Mobile.

## 🎯 Objectives

### Aplikasi ini bertujuan untuk:
- Menyediakan monitoring durasi penggunaan aplikasi
- Menghitung lama bermain game
- Menampilkan aplikasi apa saja yang terinstal
- Menyajikan riwayat aktivitas aplikasi
- Menyediakan informasi lokasi dan histori aktivitas di luar rumah
- Menghasilkan timeline aktivitas harian anak
- Memberikan alert berbasis aturan sederhana
- Mendukung peran Orang Tua dan Anak secara terpisah

## 🧠 System Scope & Philosophy
### ✅ What This App Is

- Activity awareness system
- Monitoring berbasis metadata
- Educational & preventive tool
- Transparent & ethical monitoring

### ❌ What This App Is NOT
- Bukan parental control OS-level
- Tidak memblokir aplikasi
- Tidak membaca isi chat, media, atau website
- Tidak menggunakan Accessibility Service
- Tidak menggunakan custom native module

## 👥 User Roles
### 👨‍👩‍👧 Parent (Orang Tua)
- Melihat laporan aktivitas anak
- Melihat durasi screen time & game time
- Melihat histori lokasi & aktivitas luar
- Mengatur aturan (rule) & threshold
- Menerima notifikasi peringatan

### 🧒 Child (Anak)
- Perangkat dimonitor secara transparan
- Tidak memiliki akses ke dashboard orang tua
- Aplikasi berjalan sebagai monitoring agent

> Role ditentukan dan divalidasi di backend (server-side)
> Mobile app hanya merender UI berdasarkan role yang diberikan server.

## 🧱 High-Level Architecture
```
[ Child Mobile App (RN + TS) ]
  - Activity Tracking
  - Location Logging
  - Local Storage
        |
        | REST API (HTTPS)
        v
[ Backend API (NestJS + TS) ]
  - Authentication
  - Role Management
  - Data Aggregation
  - Rule Evaluation
        |
        v
[ Parent Dashboard (React + TS) ]
  - Reports
  - Timeline
  - Alerts
```

## 📱 Core Features

### 1️⃣ Digital Activity Monitoring
- Screen time (estimasi)
- Per-application usage duration
- Game vs non-game classification
- Daily usage summary

### 2️⃣ App Inventory Monitoring
- Daftar aplikasi terinstal
- Deteksi aplikasi baru / dihapus (polling-based)
- Kategori aplikasi

### 3️⃣ Location & Outside Activity
- GPS-based location tracking
- Location history
- Outside vs in-home detection (geofence-based)
- Outside duration per day

### 4️⃣ Timeline & Reporting
- Unified activity timeline
- Daily & weekly summaries
- Event-based activity history

### 5️⃣ Rule & Alert System
- Threshold-based rules (contoh: game time > 2 jam)
- Local notification
- Alert history

## 🔐 Privacy & Ethics
- Metadata only (no content inspection)
- No chat, media, or website content access
- Explicit role separation
- Designed for transparency & trust
- Play Store–compliant approach

## 🛠 Technology Stack
### Language
- TypeScript (end-to-end)

### 📱 Mobile Application
- React Native
- TypeScript
- Existing libraries only
- No custom native modules

### Key Libraries (indicative):
- `react-native-device-info`
- `@react-native-community/hooks`
- `react-native-geolocation-service`
- `react-native-maps`
- AsyncStorage / Realm
- Local notification library

### 💻 Backend
- NestJS
- TypeScript
- REST API
- JWT-based authentication
- Role-Based Access Control (RBAC)

## 📊 Parent Dashboard
- React
- TypeScript
- Charting & map visualization
- REST API integration

## 🖥 Data Storage
- Mobile: Local storage (AsyncStorage / Realm)
- Backend: Relational DB (PostgreSQL / SQLite)

## 📦 Project Structure (Conceptual)
```
/mobile-app
  /src
    /features
    /storage
    /rules
    /timeline

/backend
  /src
    /auth
    /users
    /children
    /usage
    /location
    /rules

/dashboard
  /src
    /pages
    /components
    /charts

/shared
  /models
  /enums
  /dto
```

## 🎓 Academic Context
This project is designed to help students learn:
- Mobile application architecture
- Client–server separation
- Role-based access control
- Data modeling & aggregation
- Ethical system design
- Real-world constraints in mobile monitoring

## 🚀 Future Extensions (Optional)
- Behavior anomaly detection
- Sleep pattern inference
- Multi-device child profile
- Advanced analytics
- Research-oriented extensions (TA / Skripsi)

## 📄 License & Usage

This project is intended for educational and academic use.
Any real-world deployment must comply with applicable privacy and child protection regulations.