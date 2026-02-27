import cron from "node-cron";
import Batch from "../model/batch.model.js";
import SensorReading from "../model/sensorReading.model.js";
import Warehouse from "../model/warehouse.model.js";
import AppError from "../utils/AppError.js";
import { analyzeRisk } from "../services/riskAnalyzer.service.js";
import { writeRiskToBatch } from "../services/riskWriter.service.js";
import { createAlert } from "../services/alert.service.js";
import { shouldCallGemini } from "../ai/rules/shouldCallGemini.js";
import geminiQueue from "../utils/geminiQueue.js";

// Processes a single batch — this is what gets enqueued
const processBatch = async (batch, warehouseType) => {
  const riskData = await analyzeRisk(batch);
  await writeRiskToBatch(batch._id, riskData);
  await createAlert(batch, riskData);
  console.log(`[AI Scheduler] Batch ${batch._id} processed successfully.`);
};

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

  console.log(`[AI Scheduler] Found ${batches.length} active batches to evaluate.`);

  for (const batch of batches) {
    try {
      const latestSensor = await SensorReading
        .findOne({ warehouseId: batch.warehouseId })
        .sort({ createdAt: -1 });

      if (!latestSensor) {
        console.warn(`[AI Scheduler] No sensor data for batch ${batch._id}, skipping.`);
        continue;
      }

      const warehouse = await Warehouse.findById(batch.warehouseId).select("warehouseType");
      const warehouseType = warehouse?.warehouseType ?? "general";

      if (shouldCallGemini(batch, latestSensor, warehouseType)) {
        // Add to queue instead of calling directly — respects rate limits automatically
        geminiQueue.add(() => processBatch(batch, warehouseType)).catch((err) => {
          const isOp = err.isOperational;
          console[isOp ? "warn" : "error"](
            `[AI Scheduler] Batch ${batch._id} — ${err.code ?? "ERROR"}: ${err.message}`
          );
        });
      }
    } catch (err) {
      const isOp = err.isOperational;
      console[isOp ? "warn" : "error"](
        `[AI Scheduler] Batch ${batch._id} — ${err.code ?? "ERROR"}: ${err.message}`
      );
    }
  }

  // Wait for all queued tasks to finish before marking the run as complete
  await geminiQueue.onIdle();
  console.log("[AI Scheduler] All batches have been processed.");
};

export const startAiCronJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log(`[AI Scheduler] Daily run started at ${new Date().toISOString()}`);
    try {
      await runAiScheduler();
      console.log("[AI Scheduler] Daily run completed.");
    } catch (err) {
      console.error(`[AI Scheduler] Daily run failed: ${err.message}`);
    }
  });

  console.log("[AI Scheduler] Cron job registered — runs daily at midnight.");
};

