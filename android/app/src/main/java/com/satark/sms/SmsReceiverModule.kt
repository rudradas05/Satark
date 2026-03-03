package com.satark.sms

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * React Native native module that:
 * 1. Hooks into [SmsBroadcastReceiver] to get incoming SMS.
 * 2. Emits each message to JavaScript via an RCTDeviceEventEmitter event.
 */
class SmsReceiverModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val EVENT_NAME = "onSmsReceived"
  }

  override fun getName(): String = "SmsReceiver"

  override fun initialize() {
    super.initialize()
    SmsBroadcastReceiver.onSmsReceived = { sender, body, timestamp ->
      emitSms(sender, body, timestamp)
    }
  }

  override fun invalidate() {
    SmsBroadcastReceiver.onSmsReceived = null
    super.invalidate()
  }

  private fun emitSms(sender: String, body: String, timestamp: Long) {
    val params = Arguments.createMap().apply {
      putString("sender", sender)
      putString("body", body)
      putDouble("timestamp", timestamp.toDouble())
    }
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT_NAME, params)
  }

  /**
   * Required by RN for the new-arch event emitter registration.
   * Called from JS when the listener count changes.
   */
  @ReactMethod
  fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {
    // No-op — keeps RN from logging a warning.
  }

  @ReactMethod
  fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Int) {
    // No-op
  }
}
