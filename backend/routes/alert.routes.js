import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getAlerts,
  getAlert,
  resolve,
  manualReAnalyze,
  dismiss,
} from "../controller/alert.controller.js";

const router = Router();

// All alert routes require a valid access token
router.use(protect);

// GET  /api/alerts           — any authenticated user (filtered by warehouseId in service)
router.get("/", getAlerts);

// GET  /api/alerts/:id       — any authenticated user
router.get("/:id", getAlert);

// PUT  /api/alerts/:id/resolve  — manager, admin, superadmin
router.put(
  "/:id/resolve",
  authorizeRoles("manager", "admin", "superadmin"),
  resolve
);

// POST /api/alerts/manual/:batchId  — manager, admin, superadmin
router.post(
  "/manual/:batchId",
  authorizeRoles("manager", "admin", "superadmin"),
  manualReAnalyze
);

// DELETE /api/alerts/:id    — admin, superadmin only (soft-dismiss)
router.delete("/:id", authorizeRoles("admin", "superadmin"), dismiss);

export default router;
