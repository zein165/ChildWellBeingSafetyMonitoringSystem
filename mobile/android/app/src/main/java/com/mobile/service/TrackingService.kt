package com.mobile.service

import android.app.*
import android.content.Intent
import android.content.Context
import android.os.IBinder
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat

import com.mobile.helper.StorageHelper
import com.mobile.helper.AppHelper
import com.mobile.helper.AppInfo
import com.mobile.helper.LocationHelper
import com.mobile.helper.UsageHelper

import com.mobile.api.ApiClient
import com.mobile.api.AppPayload
import com.mobile.api.TrackingRequest

import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class TrackingService : Service() {

    override fun onCreate() {
        super.onCreate()
        Log.d("TRACKING_SERVICE", "Service Created")

        try {
            startForegroundService()
            Log.d("TRACKING_SERVICE", "Foreground started SUCCESS")
        } catch (e: Exception) {
            Log.e("TRACKING_SERVICE", "Foreground FAILED", e)
        }
    }

    private fun startForegroundService() {
        val channelId = "tracking_channel"

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Tracking Service",
                NotificationManager.IMPORTANCE_HIGH
            )
            channel.description = "Monitoring child device"
            manager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Monitoring aktif")
            .setContentText("Aplikasi sedang memantau device anak")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setOngoing(true)
            .build()

        startForeground(1, notification)
    }

    private fun sendToBackend(apps: List<AppInfo>, lat: Double, lng: Double, usage: Map<String, Long>) {

        val childId = getChildId()

        if (childId == null) {
            Log.e("TRACKING_SERVICE", "Child ID NULL - skip API")
            return
        }

        val appPayloads = apps.map {
            com.mobile.api.AppPayload(
                packageName = it.packageName,
                appName = it.appName
            )
        }

        val request = TrackingRequest(
            childId = childId,
            apps = appPayloads,
            usage = usage,
            latitude = lat,
            longitude = lng
        )

        ApiClient.instance.sendTracking(request)
            .enqueue(object : Callback<Void> {
                override fun onResponse(call: Call<Void>, response: Response<Void>) {
                    Log.d("TRACKING_SERVICE", "API SUCCESS")
                }

                override fun onFailure(call: Call<Void>, t: Throwable) {
                    Log.e("TRACKING_SERVICE", "API FAILED", t)
                }
            })
    }

    private fun getChildId(): String? {
        val prefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        return prefs.getString("child_id", null)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        val handlerThread = android.os.HandlerThread("TrackingThread")
        handlerThread.start()

        val handler = Handler(handlerThread.looper)

        val runnable = object : Runnable {
            override fun run() {

                Log.d("TRACKING_SERVICE", "RUNNING TASK")

                // =========================
                // 1. GET CURRENT APPS
                // =========================
                val currentApps = AppHelper.getInstalledApps(this@TrackingService)
                val currentPackages = currentApps.map { it.packageName }.toSet()

                // =========================
                // 2. GET SAVED APPS
                // =========================
                val savedApps = StorageHelper.getSavedApps(this@TrackingService)

                // =========================
                // 3. DETECT UNINSTALL
                // =========================
                val uninstalledApps = savedApps - currentPackages

                if (uninstalledApps.isNotEmpty()) {
                    Log.d("TRACKING_SERVICE", "UNINSTALLED: $uninstalledApps")
                }

                // =========================
                // 4. SAVE CURRENT STATE
                // =========================
                StorageHelper.saveApps(this@TrackingService, currentApps)

                // =========================
                // 5. GET USAGE STATS
                // =========================
                val usageStats = UsageHelper.getAppUsageToday(this@TrackingService)

                // =========================
                // 6. GET LOCATION + API
                // =========================
                LocationHelper.getCurrentLocation(this@TrackingService) { lat, lng ->
                    sendToBackend(currentApps, lat, lng, usageStats)
                }

                // =========================
                // LOOP
                // =========================
                handler.postDelayed(this, 10 * 1000)
            }
        }

        handler.post(runnable)

        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}