package com.rnseedtemplate

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppUsageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    // Menyimpan memori React Native agar bisa dipanggil dari Service
    companion object {
        var reactContext: ReactApplicationContext? = null
    }

    init {
        AppUsageModule.reactContext = reactContext
    }

    override fun getName() = "AppUsage"

    @ReactMethod
    fun checkPermission(promise: Promise) {
        val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), reactApplicationContext.packageName)
        promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
    }

    @ReactMethod
    fun requestPermission() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }

    // --- MENGENDALIKAN FOREGROUND SERVICE ---

    @ReactMethod
    fun startService() {
        val intent = Intent(reactApplicationContext, TrackerService::class.java)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(intent)
        } else {
            reactApplicationContext.startService(intent)
        }
    }

    @ReactMethod
    fun stopService() {
        val intent = Intent(reactApplicationContext, TrackerService::class.java)
        reactApplicationContext.stopService(intent)
    }

    // Wajib ditambahkan agar React Native tidak menampilkan error/warning event listener
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
}