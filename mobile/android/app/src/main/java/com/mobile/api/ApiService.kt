package com.mobile.api

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

data class AppPayload(
    val packageName: String,
    val appName: String
)

data class TrackingRequest(
    val childId: String,
    val apps: List<AppPayload>,
    val usage: Map<String, Long>,
    val latitude: Double,
    val longitude: Double
)

interface ApiService {

    @POST("tracking")
    fun sendTracking(@Body request: TrackingRequest): Call<Void>
}