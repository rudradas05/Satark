import { Platform } from 'react-native';
import type { MessageRecord, ThreatLevel } from '../types/message';

/**
 * Model API runs on the host machine.
 * - Android emulator: 10.0.2.2 maps to host's localhost
 * - Physical device / iOS: use the machine's LAN IP or localhost
 */
const MODEL_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

/** Backend API for persisting messages to the database. */
const BACKEND_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export interface PredictionResult {
  spam_probability: number;
  prediction: 'SPAM' | 'HAM';
}

/**
 * Classify a single SMS message using the DistilBERT model API.
 *
 * Returns the prediction result, or `null` if the request fails
 * (so the app still works even if the model server is down).
 */
export async function classifySms(
  message: string,
): Promise<PredictionResult | null> {
  try {
    const response = await fetch(`${MODEL_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as PredictionResult;
    return data;
  } catch {
    // Model server unreachable — degrade gracefully
    return null;
  }
}

/**
 * Map model prediction to the app's ThreatLevel + riskScore + reasons.
 */
export function predictionToThreat(result: PredictionResult): {
  level: ThreatLevel;
  riskScore: number;
  confidence: number;
  reasons: string[];
} {
  const prob = result.spam_probability;
  const confidence = Math.round(prob * 100) / 100;

  if (prob >= 0.75) {
    return {
      level: 'spam',
      riskScore: Math.round(70 + prob * 30), // 70–100
      confidence,
      reasons: [
        'AI model detected spam patterns',
        `Spam probability: ${(prob * 100).toFixed(1)}%`,
      ],
    };
  }

  if (prob >= 0.4) {
    return {
      level: 'suspicious',
      riskScore: Math.round(30 + prob * 40), // 46–70
      confidence,
      reasons: [
        'AI model flagged as suspicious',
        `Spam probability: ${(prob * 100).toFixed(1)}%`,
      ],
    };
  }

  return {
    level: 'safe',
    riskScore: Math.round(prob * 30), // 0–12
    confidence,
    reasons: ['AI model classified as safe'],
  };
}

/**
 * Send a message to the backend for AI classification and database persistence.
 * The backend calls the model itself and saves the result.
 *
 * @param token  JWT auth token from the logged-in user.
 * @param sender The SMS sender address.
 * @param content The SMS body text.
 * @returns      The classification result from the backend, or `null` on failure.
 */
export async function saveMessageToDb(
  token: string,
  sender: string,
  content: string,
): Promise<{
  id: string;
  isSpam: boolean;
  confidence: number;
  riskScore: number;
  spamProbability: number;
} | null> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/spam/check-spam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sender, content }),
    });

    if (!response.ok) return null;

    return (await response.json()) as {
      id: string;
      isSpam: boolean;
      confidence: number;
      riskScore: number;
      spamProbability: number;
    };
  } catch {
    // Backend unreachable — degrade gracefully
    return null;
  }
}

/** Shape of a message returned by GET /spam/messages */
interface DbMessage {
  id: string;
  sender: string;
  content: string;
  isSpam: boolean;
  confidence: number;
  riskScore: number;
  createdAt: string;
}

/** Convert a DB message to the frontend MessageRecord format. */
function dbMessageToRecord(msg: DbMessage): MessageRecord {
  const hasLink = /https?:\/\/|www\./i.test(msg.content);
  const level: ThreatLevel = msg.isSpam
    ? 'spam'
    : msg.riskScore >= 40
      ? 'suspicious'
      : 'safe';

  const reasons: string[] = msg.isSpam
    ? ['AI model detected spam patterns', `Confidence: ${(msg.confidence * 100).toFixed(1)}%`]
    : level === 'suspicious'
      ? ['AI model flagged as suspicious', `Confidence: ${(msg.confidence * 100).toFixed(1)}%`]
      : ['AI model classified as safe'];

  return {
    id: msg.id,
    sender: msg.sender,
    preview: msg.content.length > 80 ? msg.content.slice(0, 77) + '...' : msg.content,
    body: msg.content,
    receivedAt: msg.createdAt,
    level,
    riskScore: msg.riskScore,
    confidence: msg.confidence,
    reasons,
    hasLink,
  };
}

/**
 * Fetch all saved messages from the backend database.
 *
 * @param token JWT auth token from the logged-in user.
 * @returns Array of MessageRecord, or empty array on failure.
 */
export async function fetchSavedMessages(
  token: string,
): Promise<MessageRecord[]> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/spam/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as DbMessage[];
    return data.map(dbMessageToRecord);
  } catch {
    return [];
  }
}
