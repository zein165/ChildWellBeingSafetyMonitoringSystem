package com.mobile

import android.content.Intent
import android.content.Context
import com.facebook.react.bridge.*
import com.mobile.service.TrackingService

class ServiceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ServiceModule"

    @ReactMethod
    fun startTrackingService() {
        val intent = Intent(reactContext, TrackingService::class.java)
        reactContext.startForegroundService(intent)
    }

    @ReactMethod
    fun stopTrackingService() {
        val intent = Intent(reactContext, TrackingService::class.java)
        reactContext.stopService(intent)
    }

    @ReactMethod
    fun setChildId(childId: String) {
        val prefs = reactApplicationContext.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        prefs.edit().putString("child_id", childId).apply()
    }
}