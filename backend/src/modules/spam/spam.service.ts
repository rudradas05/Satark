import { prisma } from '../../db/prisma';
import { CheckSpamInput } from './spam.schema';

const MODEL_API_URL = process.env.MODEL_API_URL || 'http://127.0.0.1:8000';

interface ModelPrediction {
  spam_probability: number;
  prediction: 'SPAM' | 'HAM';
}

/**
 * Call the Python DistilBERT model to classify a message.
 */
async function classifyWithModel(content: string): Promise<ModelPrediction> {
  const response = await fetch(`${MODEL_API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content }),
  });

  if (!response.ok) {
    throw new Error(`Model API returned ${response.status}`);
  }

  return response.json() as Promise<ModelPrediction>;
}

export async function checkSpam(userId: string, data: CheckSpamInput) {
  // Call the AI model for classification
  const prediction = await classifyWithModel(data.content);

  const isSpam = prediction.prediction === 'SPAM';
  const confidence = Math.round(prediction.spam_probability * 100) / 100;
  const riskScore = Math.round(prediction.spam_probability * 100);

  const message = await prisma.message.create({
    data: {
      userId,
      sender: data.sender,
      content: data.content,
      isSpam,
      confidence,
      riskScore,
    },
  });

  return {
    id: message.id,
    isSpam,
    confidence,
    riskScore,
    spamProbability: prediction.spam_probability,
  };
}

export async function getMessages(userId: string) {
  return await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getStats(userId: string) {
  const total = await prisma.message.count({ where: { userId } });
  const spam = await prisma.message.count({ where: { userId, isSpam: true } });
  const safe = total - spam;

  return {
    totalScanned: total,
    spamCount: spam,
    safeCount: safe,
    riskIndex: total > 0 ? Math.round((spam / total) * 100) : 0,
  };
}
