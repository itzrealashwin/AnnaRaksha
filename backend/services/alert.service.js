import AiAlert from "../model/aiAlert.model.js";

export const createAlert = async (batch, riskData) => {
  return await AiAlert.create({
    alertType: "spoilage",
    warehouseId: batch.warehouseId,
    batchId: batch._id,
    riskLevel: riskData.riskLevel,
    riskScore: riskData.riskScore,
    reason: riskData.reason,
    recommendedAction: riskData.recommendedAction,
    timeToCriticalHours: riskData.timeToCriticalHours
  });
};