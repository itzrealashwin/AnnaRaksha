import Batch from "../model/batch.model.js";
import SensorReading from "../model/sensorReading.model.js";

import { analyzeRisk } from "../services/riskAnalyzer.service.js";
import { writeRiskToBatch } from "../services/riskWriter.service.js";
import { createAlert } from "../services/alert.service.js";
import { shouldCallGemini } from "../ai/rules/shouldCallGemini.js";

export const runAiScheduler = async () => {
  const batches = await Batch.find({ status: { $in: ["stored", "atRisk"] } });

  for (const batch of batches) {
    const latestSensor = await SensorReading
      .findOne({ warehouseId: batch.warehouseId })
      .sort({ createdAt: -1 });

    if (!latestSensor) continue;

    if (shouldCallGemini(batch, latestSensor)) {
      const riskData = await analyzeRisk(batch);
      await writeRiskToBatch(batch._id, riskData);
      await createAlert(batch, riskData);
    }
  }
};