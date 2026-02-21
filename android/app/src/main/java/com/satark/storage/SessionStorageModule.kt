package com.satark.storage

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SessionStorageModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val prefs by lazy {
    reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
  }

  override fun getName() = "SessionStorage"

  @ReactMethod
  fun getItem(key: String, promise: Promise) {
    try {
      promise.resolve(prefs.getString(key, null))
    } catch (error: Exception) {
      promise.reject("SESSION_STORAGE_GET_ERROR", "Unable to read stored session", error)
    }
  }

  @ReactMethod
  fun setItem(key: String, value: String, promise: Promise) {
    try {
      val committed = prefs.edit().putString(key, value).commit()
      if (!committed) {
        promise.reject("SESSION_STORAGE_SET_ERROR", "Unable to persist session")
        return
      }
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SESSION_STORAGE_SET_ERROR", "Unable to persist session", error)
    }
  }

  @ReactMethod
  fun removeItem(key: String, promise: Promise) {
    try {
      val committed = prefs.edit().remove(key).commit()
      if (!committed) {
        promise.reject("SESSION_STORAGE_REMOVE_ERROR", "Unable to clear stored session")
        return
      }
      promise.resolve(null)
    } catch (error: Exception) {
      promise.reject("SESSION_STORAGE_REMOVE_ERROR", "Unable to clear stored session", error)
    }
  }

  private companion object {
    const val PREFS_NAME = "satark_session_storage"
  }
}
