import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Batch from "../model/batch.model.js";

import {
  listAlerts,
  getAlertById,
  resolveAlert,
  dismissAlert,
  createAlert,
} from "../services/alert.service.js";
import { analyzeRisk } from "../services/riskAnalyzer.service.js";
import { writeRiskToBatch } from "../services/riskWriter.service.js";

// ─── GET /api/alerts ─────────────────────────────────────────
// ?warehouseId= &severity= &isResolved=false &page= &limit=
export const getAlerts = catchAsync(async (req, res) => {
  const result = await listAlerts(req.query);
  res.status(200).json({ success: true, ...result });
});

// ─── GET /api/alerts/:id ──────────────────────────────────────
export const getAlert = catchAsync(async (req, res) => {
  const alert = await getAlertById(req.params.id);
  res.status(200).json({ success: true, data: alert });
});

// ─── PUT /api/alerts/:id/resolve ──────────────────────────────
// Body: { comment? }  (comment stored in reason extension — optional)
export const resolve = catchAsync(async (req, res) => {
  const alert = await resolveAlert(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: alert });
});

// ─── POST /api/alerts/manual/:batchId ────────────────────────
// Manually trigger Gemini re-analysis; creates alert if riskLevel > Low
export const manualReAnalyze = catchAsync(async (req, res) => {
  const batch = await Batch.findById(req.params.batchId);
  if (!batch) throw new AppError("Batch not found", 404, "BATCH_NOT_FOUND");

  const riskData = await analyzeRisk(batch);
  const updatedBatch = await writeRiskToBatch(batch._id, riskData);

  let alert = null;
  if (riskData.riskLevel !== "Low") {
    alert = await createAlert(batch, riskData);
  }

  res.status(200).json({
    success: true,
    message: "Re-analysis complete",
    data: { updatedBatch, alert },
  });
});

// ─── DELETE /api/alerts/:id ───────────────────────────────────
export const dismiss = catchAsync(async (req, res) => {
  const alert = await dismissAlert(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: alert });
});
