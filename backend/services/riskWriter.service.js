import Batch from "../model/batch.model.js";
import { getNextCooldownTime } from "../utils/cooldown.js";

export const writeRiskToBatch = async (batchId, riskData) => {
  return await Batch.findByIdAndUpdate(
    batchId,
    {
      riskScore: riskData.riskScore,
      riskLevel: riskData.riskLevel,
      lastAiAnalyzedAt: new Date(),
      aiCooldownUntil: getNextCooldownTime()
    },
    { new: true }
  );
};