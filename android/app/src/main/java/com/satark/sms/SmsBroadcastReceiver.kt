package com.satark.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony

/**
 * Receives incoming SMS broadcasts from the system.
 * Delegates each message to [SmsReceiverModule] which emits it to React Native.
 */
class SmsBroadcastReceiver : BroadcastReceiver() {

  companion object {
    /** Callback set by [SmsReceiverModule] when it initialises. */
    var onSmsReceived: ((sender: String, body: String, timestamp: Long) -> Unit)? = null
  }

  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return

    val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
    if (messages.isNullOrEmpty()) return

    // SMS can arrive in multiple PDUs — group by originating address and
    // concatenate the body so multi-part messages stay together.
    val grouped = mutableMapOf<String, StringBuilder>()
    var timestamp = System.currentTimeMillis()

    for (sms in messages) {
      val sender = sms.displayOriginatingAddress ?: "Unknown"
      grouped.getOrPut(sender) { StringBuilder() }.append(sms.displayMessageBody ?: "")
      timestamp = sms.timestampMillis
    }

    for ((sender, body) in grouped) {
      onSmsReceived?.invoke(sender, body.toString(), timestamp)
    }
  }
}
