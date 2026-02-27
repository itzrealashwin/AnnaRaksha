import AiAlert from "../model/aiAlert.model.js";
import AppError from "../utils/AppError.js";

export const createAlert = async (batch, riskData) => {
  if (!batch?.warehouseId) {
    throw new AppError("Batch is missing warehouseId", 400, "INVALID_BATCH");
  }
  if (!riskData?.riskLevel || riskData.riskScore == null) {
    throw new AppError("Incomplete risk data from AI", 422, "INVALID_RISK_DATA");
  }

  return await AiAlert.create({
    alertType: "spoilage",
    warehouseId: batch.warehouseId,
    batchId: batch._id,
    riskLevel: riskData.riskLevel,
    riskScore: riskData.riskScore,
    reason: riskData.reason,
    recommendedAction: riskData.recommendedAction,
    timeToCriticalHours: riskData.timeToCriticalHours,
  });
};

export const resolveAlert = async (alertId, resolvedBy) => {
  const alert = await AiAlert.findById(alertId);
  if (!alert) throw new AppError("Alert not found", 404, "ALERT_NOT_FOUND");
  if (alert.status !== "active") {
    throw new AppError("Alert is already resolved or dismissed", 409, "ALERT_NOT_ACTIVE");
  }

  alert.status = "resolved";
  alert.resolvedBy = resolvedBy;
  alert.resolvedAt = new Date();
  return await alert.save();
};

export const dismissAlert = async (alertId, resolvedBy) => {
  const alert = await AiAlert.findById(alertId);
  if (!alert) throw new AppError("Alert not found", 404, "ALERT_NOT_FOUND");
  if (alert.status !== "active") {
    throw new AppError("Alert is already resolved or dismissed", 409, "ALERT_NOT_ACTIVE");
  }

  alert.status = "dismissed";
  alert.resolvedBy = resolvedBy;
  alert.resolvedAt = new Date();
  return await alert.save();
};