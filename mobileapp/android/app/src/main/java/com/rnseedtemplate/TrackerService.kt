package com.rnseedtemplate

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import com.facebook.react.modules.core.DeviceEventManagerModule

class TrackerService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var isRunning = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            createNotificationChannel()
            
            // Membuat Notifikasi Permanen
            val notification = NotificationCompat.Builder(this, "FamilyGuardChannel")
                .setContentTitle("Perlindungan Aktif 🛡️")
                .setContentText("Sistem memantau aktivitas HP secara aman...")
                .setSmallIcon(resources.getIdentifier("ic_launcher", "mipmap", packageName))
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build()

            // 🔥 SOLUSI ANDROID 14: Wajib cantumkan tipe service
            if (Build.VERSION.SDK_INT >= 34) { // Android 14 ke atas
                startForeground(1001, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
            } else {
                startForeground(1001, notification)
            }

            if (!isRunning) {
                isRunning = true
                startTrackingLoop() // Nyalakan mesin!
            }
        } catch (e: Exception) {
            // Kalau gagal nyala, lapor ke React Native!
            sendToReact("🔴 ERROR_START_SERVICE: " + e.message)
        }

        return START_STICKY
    }

    private fun startTrackingLoop() {
        handler.post(object : Runnable {
            override fun run() {
                try {
                    val currentApp = getCurrentAppForeground()
                    sendToReact(currentApp) // Kirim nama aplikasi ke JS
                } catch (e: Exception) {
                    sendToReact("🔴 ERROR_LOOP: " + e.message)
                }

                // Loop terus setiap 1.5 detik (agar HP tidak cepat panas)
                handler.postDelayed(this, 1500)
            }
        })
    }

    // Fungsi khusus untuk teriak ke Javascript / React Native
    private fun sendToReact(message: String) {
        try {
            AppUsageModule.reactContext?.let {
                if (it.hasActiveCatalystInstance()) {
                    it.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("onAppChanged", message)
                }
            }
        } catch (e: Exception) {
            // Abaikan jika JS belum siap
        }
    }

    private fun getCurrentAppForeground(): String {
        try {
            val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - 1000 * 60 * 10 // Cek 10 menit ke belakang
            val usageEvents = usm.queryEvents(startTime, endTime)
            
            var currentApp = "Memuat Layar..."
            val event = android.app.usage.UsageEvents.Event()

            while (usageEvents.hasNextEvent()) {
                usageEvents.getNextEvent(event)
                // Cek aplikasi apa yang paling terakhir ditaruh di depan layar
                if (event.eventType == android.app.usage.UsageEvents.Event.MOVE_TO_FOREGROUND) {
                    currentApp = event.packageName
                }
            }
            return currentApp
        } catch (e: Exception) {
            return "🔴 ERROR_BACA_APLIKASI: " + e.message
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "FamilyGuardChannel",
                "Keamanan FamilyGuard",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }
}