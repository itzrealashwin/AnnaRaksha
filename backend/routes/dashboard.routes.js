// src/routes/dashboard.routes.js
import express from "express";
import * as dashboardController from "../controller/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
// import { restrictTo } from '../middlewares/role.middleware.js';   // optional

const router = express.Router();

router.use(protect); // sab protected

router.get("/:warehouseId/overview", dashboardController.getOverview);
router.get("/:warehouseId/environment", dashboardController.getEnvironment);
router.get("/:warehouseId/risk-batches", dashboardController.getRiskBatches);
router.get("/:warehouseId/alerts", dashboardController.getAlertsFeed);
router.get(
  "/:warehouseId/inventory-summary",
  dashboardController.getInventorySummary,
);

export default router;
