import { prisma } from "../../db/prisma";
import { CheckSpamInput } from "./spam.schema";

export async function checkSpam(userId: string, data: CheckSpamInput) {
  // TODO: Call Python prediction script here
  // For now, mock response
  const isSpam = Math.random() > 0.5;
  const confidence = Math.random() * 0.4 + 0.6;
  const riskScore = Math.floor(Math.random() * 100);

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
  };
}

export async function getMessages(userId: string) {
  return await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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