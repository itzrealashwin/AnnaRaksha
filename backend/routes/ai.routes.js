import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { manualCheck, reAnalyzeBatch } from "../controller/ai.controller.js";

const router = Router();

router.post("/manual-check", protect, authLimiter, manualCheck);
router.post("/re-analyze/:batchId", protect, reAnalyzeBatch);

export default router;
