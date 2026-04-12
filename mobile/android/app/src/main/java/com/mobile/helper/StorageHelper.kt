package com.mobile.helper

import android.content.Context

object StorageHelper {

    private const val PREF_NAME = "app_monitor"
    private const val KEY_APPS = "installed_apps"

    fun saveApps(context: Context, apps: List<AppInfo>) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

        val packageNames = apps.map { it.packageName }.toSet()

        prefs.edit().putStringSet(KEY_APPS, packageNames).apply()
    }

    fun getSavedApps(context: Context): Set<String> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return prefs.getStringSet(KEY_APPS, emptySet()) ?: emptySet()
    }
}