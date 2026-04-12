package com.mobile.helper

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.util.Log

object UsageHelper {

    fun getStartOfDay(): Long {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }

    fun getAppUsageToday(context: Context): Map<String, Long> {
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val startTime = getStartOfDay()
        val endTime = System.currentTimeMillis()

        val events = usm.queryEvents(startTime, endTime)

        val result = mutableMapOf<String, Long>()
        val foregroundMap = mutableMapOf<String, Long>()

        val event = UsageEvents.Event()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)

            val pkg = event.packageName ?: continue

            when (event.eventType) {

                UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                    // app mulai digunakan
                    foregroundMap[pkg] = event.timeStamp
                }

                UsageEvents.Event.MOVE_TO_BACKGROUND -> {
                    // app berhenti digunakan
                    val start = foregroundMap[pkg]
                    if (start != null) {
                        val duration = event.timeStamp - start

                        if (duration > 0) {
                            result[pkg] = result.getOrDefault(pkg, 0L) + duration
                        }

                        foregroundMap.remove(pkg)
                    }
                }
            }
        }

        // 🔥 Handle app yang masih terbuka sampai sekarang
        for ((pkg, start) in foregroundMap) {
            val duration = endTime - start
            if (duration > 0) {
                result[pkg] = result.getOrDefault(pkg, 0L) + duration
            }
        }

        // 🔽 Optional: filter minimal usage (misalnya 1 menit)
        val MIN_USAGE = 60 * 1000

        return result.filter { it.value >= MIN_USAGE }
    }
}