import Batch from "../model/batch.model.js";
import AppError from "../utils/AppError.js";
import { analyzeRisk } from "../services/riskAnalyzer.service.js";
import { writeRiskToBatch } from "../services/riskWriter.service.js";
import { createAlert } from "../services/alert.service.js";

// ─── POST /ai/re-analyze/:batchId ────────────────────────────
export const reAnalyzeBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findById(req.params.batchId);
    if (!batch) throw new AppError("Batch not found", 404, "BATCH_NOT_FOUND");

    const riskData = await analyzeRisk(batch);
    const updatedBatch = await writeRiskToBatch(batch._id, riskData);
    const alert = await createAlert(batch, riskData);

    res.status(200).json({ success: true, updatedBatch, alert });
  } catch (error) {
    next(error);
  }
};

// ─── POST /ai/manual-check ────────────────────────────────────
export const manualCheck = async (req, res, next) => {
  try {
    const { batchId } = req.body;

    // Single batch analysis
    if (batchId) {
      const batch = await Batch.findById(batchId);
      if (!batch) throw new AppError("Batch not found", 404, "BATCH_NOT_FOUND");

      const riskData = await analyzeRisk(batch);
      const updatedBatch = await writeRiskToBatch(batch._id, riskData);
      const alert = await createAlert(batch, riskData);

      return res.status(200).json({
        success: true,
        message: "Batch analyzed successfully",
        result: updatedBatch,
        alert,
      });
    }

    // All active batches
    const batches = await Batch.find({ isActive: true, isDeleted: false });

    const results = [];
    for (const batch of batches) {
      const riskData = await analyzeRisk(batch);
      await writeRiskToBatch(batch._id, riskData);
      await createAlert(batch, riskData);
      results.push({
        batchId: batch._id,
        riskLevel: riskData.riskLevel,
        riskScore: riskData.riskScore,
      });
    }

    return res.status(200).json({
      success: true,
      message: "All batches analyzed successfully",
      totalAnalyzed: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};