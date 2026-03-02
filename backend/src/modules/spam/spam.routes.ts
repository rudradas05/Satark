import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import * as controller from "./spam.controller";

const router = Router();

router.post("/check-spam", authMiddleware, controller.checkSpam);
router.get("/messages", authMiddleware, controller.getMessages);
router.get("/stats", authMiddleware, controller.getStats);

export default router;