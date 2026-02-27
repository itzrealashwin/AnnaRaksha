import Batch from "../model/batch.model.js";
import SensorReading from "../model/sensorReading.model.js";
import Warehouse from "../model/warehouse.model.js";
import AppError from "../utils/AppError.js";

import { analyzeRisk } from "../services/riskAnalyzer.service.js";
import { writeRiskToBatch } from "../services/riskWriter.service.js";
import { createAlert } from "../services/alert.service.js";
import { shouldCallGemini } from "../ai/rules/shouldCallGemini.js";

export const runAiScheduler = async () => {
  let batches;
  try {
    batches = await Batch.find({
      isActive: true,
      isDeleted: false,
      status: { $in: ["Fresh", "Maturing", "NearExpiry"] },
    });
  } catch (err) {
    throw new AppError("Scheduler failed to fetch batches", 500, "SCHEDULER_DB_ERROR");
  }

  for (const batch of batches) {
    try {
      const latestSensor = await SensorReading
        .findOne({ warehouseId: batch.warehouseId })
        .sort({ createdAt: -1 });

      if (!latestSensor) continue;

      const warehouse = await Warehouse.findById(batch.warehouseId).select("warehouseType");
      const warehouseType = warehouse?.warehouseType ?? "general";

      if (shouldCallGemini(batch, latestSensor, warehouseType)) {
        const riskData = await analyzeRisk(batch);
        await writeRiskToBatch(batch._id, riskData);
        await createAlert(batch, riskData);
      }
    } catch (err) {
      // Log per-batch errors without stopping the scheduler loop.
      // Operational AppErrors are expected (e.g. sensor missing); log non-operational ones louder.
      const isOp = err.isOperational;
      console[isOp ? "warn" : "error"](
        `[AI Scheduler] Batch ${batch._id} — ${err.code ?? "ERROR"}: ${err.message}`
      );
    }
  }
};