package com.mobile.api

import com.mobile.BuildConfig

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {

    private val BASE_URL: String by lazy {
        val url = BuildConfig.API_BASE_URL
        require(url.isNotEmpty()) { "API_BASE_URL is empty! Check .env" }
        if (url.endsWith("/")) url else "$url/"
    }

    val instance: ApiService by lazy {

        android.util.Log.d("API_CONFIG", "BASE_URL = $BASE_URL")

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}