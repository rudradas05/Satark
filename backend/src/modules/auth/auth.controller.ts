import type { Request, Response } from "express";
import { SignupSchema, LoginSchema } from "./auth.schema";
import * as service from "./auth.service";

export async function signup(req: Request, res: Response) {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  try {
    const result = await service.signup(parsed.data);
    return res.json({
      token: result.token,
      user: {
        id: result.user.id,
        userName: result.user.userName,
        email: result.user.email,
        phone: result.user.phone,
        avatarUrl: result.user.avatarUrl,
      },
    });
  } catch (e: any) {
    if (e.message === "USERNAME_EXISTS") return res.status(409).json({ error: "UserName already exists" });
    if (e.message === "EMAIL_EXISTS") return res.status(409).json({ error: "Email already exists" });
    if (e.message === "PHONE_EXISTS") return res.status(409).json({ error: "Phone already exists" });
    return res.status(500).json({ error: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  try {
    const result = await service.login(parsed.data);
    return res.json({
      token: result.token,
      user: {
        id: result.user.id,
        userName: result.user.userName,
        email: result.user.email,
        phone: result.user.phone,
        avatarUrl: result.user.avatarUrl,
      },
    });
  } catch (e: any) {
    if (e.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "Invalid credentials" });
    return res.status(500).json({ error: "Server error" });
  }
}
