package com.mobile

import android.content.pm.PackageManager
import com.facebook.react.bridge.*

import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import java.io.ByteArrayOutputStream
import android.app.AppOpsManager
import android.content.Context
import android.provider.Settings
import android.os.Process
import android.content.Intent

class AppModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppModule"
    }

    fun drawableToBase64(drawable: Drawable): String {
        val bitmap = if (drawable is BitmapDrawable) {
            drawable.bitmap
        } else {
            // convert drawable to bitmap
            val bmp = Bitmap.createBitmap(
                drawable.intrinsicWidth,
                drawable.intrinsicHeight,
                Bitmap.Config.ARGB_8888
            )
            val canvas = android.graphics.Canvas(bmp)
            drawable.setBounds(0, 0, canvas.width, canvas.height)
            drawable.draw(canvas)
            bmp
        }

        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
        val byteArray = outputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val packages = pm.getInstalledApplications(0)

            val list = Arguments.createArray()

            for (app in packages) {
                if ((app.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM) != 0) {
                    continue
                }

                val map = Arguments.createMap()
                map.putString("packageName", app.packageName)               // Nama package
                map.putString("appName", app.loadLabel(pm).toString())      // Nama aplikasi yang muncul di UI

                // ambil version info
                val packageInfo = pm.getPackageInfo(app.packageName, 0)
                map.putString("versionName", packageInfo.versionName ?: "")
                map.putInt("versionCode", packageInfo.longVersionCode.toInt())

                // ambil icon
                val iconDrawable = pm.getApplicationIcon(app)
                val iconBase64 = drawableToBase64(iconDrawable)
                map.putString("icon", iconBase64)

                list.pushMap(map)
            }

            promise.resolve(list)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun checkUsageAccess(promise: Promise) {
        val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            reactApplicationContext.packageName
        )
        promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
    }

    @ReactMethod
    fun openUsageAccessSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }
}