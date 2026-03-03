import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../state/AuthState';
import { useMessageState } from '../state/MessageState';
import {
  fetchSavedMessages,
  predictionToThreat,
  saveMessageToDb,
} from '../utils/modelApi';
import {
  RawSmsEvent,
  requestSmsPermission,
  useSmsListener,
} from '../utils/smsInterceptor';

/**
 * Invisible component that:
 * 1. Requests SMS permissions on mount.
 * 2. Loads previously saved messages from the DB when signed in.
 * 3. Listens for incoming SMS and feeds them into MessageState.
 * 4. Sends to backend which calls the AI model, classifies, and saves to DB.
 * 5. Updates the UI with real classification from the backend response.
 *
 * Must be rendered inside <MessageStateProvider> and <AuthProvider>.
 */
export function SmsGate() {
  const { addInterceptedSms, classifyMessage, loadMessages } =
    useMessageState();
  const { token } = useAuth();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    requestSmsPermission();
  }, []);

  // Fetch saved messages from DB when user signs in (or app reopens with session)
  useEffect(() => {
    if (!token || hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    (async () => {
      try {
        const saved = await fetchSavedMessages(token);
        if (saved.length > 0) {
          loadMessages(saved);
        }
      } catch (e) {
        console.warn('SmsGate: failed to load saved messages', e);
      }
    })();
  }, [token, loadMessages]);

  const handleSms = useCallback(
    async (event: RawSmsEvent) => {
      // 1. Add message to list immediately (shows as "Pending analysis")
      const messageId = addInterceptedSms(event);

      // 2. Send to backend — it calls the model, classifies, and saves to DB
      if (token) {
        const result = await saveMessageToDb(token, event.sender, event.body);

        if (result) {
          // 3. Update the UI with real classification from backend
          const threat = predictionToThreat({
            spam_probability: result.spamProbability,
            prediction: result.isSpam ? 'SPAM' : 'HAM',
          });
          classifyMessage(
            messageId,
            threat.level,
            threat.riskScore,
            threat.confidence,
            threat.reasons,
          );
        }
      }
      // If backend/model unreachable, message stays as "suspicious / Pending analysis"
    },
    [addInterceptedSms, classifyMessage, token],
  );

  useSmsListener(handleSms);

  return null;
}
