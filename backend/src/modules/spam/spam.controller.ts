import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { CheckSpamSchema } from "./spam.schema";
import * as service from "./spam.service";

export async function checkSpam(req: AuthRequest, res: Response) {
  const parsed = CheckSpamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  try {
    const result = await service.checkSpam(req.userId!, parsed.data);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getMessages(req: AuthRequest, res: Response) {
  try {
    const messages = await service.getMessages(req.userId!);
    return res.json(messages);
  } catch (error: any) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getStats(req: AuthRequest, res: Response) {
  try {
    const stats = await service.getStats(req.userId!);
    return res.json(stats);
  } catch (error: any) {
    return res.status(500).json({ error: "Server error" });
  }
}