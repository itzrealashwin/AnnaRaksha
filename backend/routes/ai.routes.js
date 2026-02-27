import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { manualCheck, reAnalyzeBatch } from "../controller/ai.controller.js";

const router = Router();

router.use(protect);

// Admin/superadmin only — triggers full AI scan across all batches
router.post("/manual-check", authorizeRoles("admin", "superadmin"), authLimiter, manualCheck);

// Any authenticated user (manager/admin/superadmin) can force re-analyze a single batch
router.post("/re-analyze/:batchId", reAnalyzeBatch);

export default router;
