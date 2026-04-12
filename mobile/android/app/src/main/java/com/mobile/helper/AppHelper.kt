package com.mobile.helper

import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager

data class AppInfo(
    val packageName: String,
    val appName: String
)

object AppHelper {

    fun getInstalledApps(context: Context): List<AppInfo> {
        val pm = context.packageManager
        val packages = pm.getInstalledApplications(0)

        val result = mutableListOf<AppInfo>()

        for (app in packages) {

            // skip system apps
            if ((app.flags and ApplicationInfo.FLAG_SYSTEM) != 0) continue

            result.add(
                AppInfo(
                    packageName = app.packageName,
                    appName = app.loadLabel(pm).toString()
                )
            )
        }

        return result
    }
}