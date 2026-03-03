import { useEffect, useRef } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const { SmsReceiver } = NativeModules;

/** Shape of the event emitted from the native SmsReceiverModule. */
export interface RawSmsEvent {
  sender: string;
  body: string;
  timestamp: number;
}

/**
 * Request RECEIVE_SMS + READ_SMS permissions on Android.
 * Returns `true` if both are granted.
 */
export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  try {
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);

    return (
      results[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      results[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    return false;
  }
}

/**
 * Hook that subscribes to incoming SMS events from the native module.
 *
 * @param onSms  Callback fired for every intercepted SMS.
 *               Receives sender, body, and epoch-ms timestamp.
 */
export function useSmsListener(onSms: (event: RawSmsEvent) => void) {
  const callbackRef = useRef(onSms);
  callbackRef.current = onSms;

  useEffect(() => {
    if (Platform.OS !== 'android' || !SmsReceiver) return;

    const emitter = new NativeEventEmitter(SmsReceiver);
    const subscription = emitter.addListener(
      'onSmsReceived',
      (event: RawSmsEvent) => {
        callbackRef.current(event);
      },
    );

    return () => subscription.remove();
  }, []);
}
