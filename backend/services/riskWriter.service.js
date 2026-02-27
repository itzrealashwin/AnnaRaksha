import Batch from "../model/batch.model.js";
import AppError from "../utils/AppError.js";
import { getNextCooldownTime } from "../utils/cooldown.js";

export const writeRiskToBatch = async (batchId, riskData) => {
  const updated = await Batch.findByIdAndUpdate(
    batchId,
    {
      riskScore: riskData.riskScore,
      riskLevel: riskData.riskLevel,
      lastAiAnalyzedAt: new Date(),
      aiCooldownUntil: getNextCooldownTime(),
      lastRiskUpdatedAt: new Date(),
    },
    { new: true }
  );

  if (!updated) {
    throw new AppError(
      `Batch ${batchId} not found when writing risk data`,
      404,
      "BATCH_NOT_FOUND"
    );
  }

  return updated;
};