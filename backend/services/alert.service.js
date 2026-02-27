import AiAlert from "../model/aiAlert.model.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

// ─── Create ───────────────────────────────────────────────────
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

// ─── List (filtered + paginated) ─────────────────────────────
export const listAlerts = async (query = {}) => {
  const filter = {};

  if (query.warehouseId) filter.warehouseId = new mongoose.Types.ObjectId(query.warehouseId);
  if (query.batchId)     filter.batchId     = new mongoose.Types.ObjectId(query.batchId);
  if (query.severity)    filter.riskLevel   = query.severity;
  if (query.alertType)   filter.alertType   = query.alertType;

  if (query.isResolved !== undefined) {
    filter.status = query.isResolved === "true"
      ? { $in: ["resolved", "dismissed"] }
      : "active";
  }

  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 20);
  const skip  = (page - 1) * limit;

  const [result] = await AiAlert.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "batches",
              localField: "batchId",
              foreignField: "_id",
              pipeline: [{ $project: { batchId: 1, produceType: 1, status: 1 } }],
              as: "batchId",
            },
          },
          { $unwind: { path: "$batchId", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "warehouses",
              localField: "warehouseId",
              foreignField: "_id",
              pipeline: [{ $project: { name: 1, code: 1 } }],
              as: "warehouseId",
            },
          },
          { $unwind: { path: "$warehouseId", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "users",
              localField: "resolvedBy",
              foreignField: "_id",
              pipeline: [{ $project: { name: 1, email: 1 } }],
              as: "resolvedBy",
            },
          },
          { $unwind: { path: "$resolvedBy", preserveNullAndEmptyArrays: true } },
        ],
        total: [{ $count: "count" }],
      },
    },
    {
      $project: {
        data: 1,
        total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
      },
    },
  ]);

  const total = result?.total ?? 0;

  return {
    data: result?.data ?? [],
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

// ─── Get single ───────────────────────────────────────────────
export const getAlertById = async (alertId) => {
  const [alert] = await AiAlert.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(alertId) } },
    {
      $lookup: {
        from: "batches",
        localField: "batchId",
        foreignField: "_id",
        pipeline: [{ $project: { batchId: 1, produceType: 1, status: 1, arrivalDate: 1, expiryDate: 1 } }],
        as: "batchId",
      },
    },
    { $unwind: { path: "$batchId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "warehouses",
        localField: "warehouseId",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, code: 1, warehouseType: 1 } }],
        as: "warehouseId",
      },
    },
    { $unwind: { path: "$warehouseId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "resolvedBy",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, email: 1 } }],
        as: "resolvedBy",
      },
    },
    { $unwind: { path: "$resolvedBy", preserveNullAndEmptyArrays: true } },
  ]);

  if (!alert) throw new AppError("Alert not found", 404, "ALERT_NOT_FOUND");
  return alert;
};

// ─── Resolve ─────────────────────────────────────────────────
export const resolveAlert = async (alertId, resolvedBy) => {
  const alert = await AiAlert.findById(alertId);
  if (!alert) throw new AppError("Alert not found", 404, "ALERT_NOT_FOUND");
  if (alert.status !== "active") {
    throw new AppError("Alert is already resolved or dismissed", 409, "ALERT_NOT_ACTIVE");
  }

  alert.status     = "resolved";
  alert.resolvedBy = resolvedBy;
  alert.resolvedAt = new Date();
  return await alert.save();
};

// ─── Dismiss (soft-delete) ────────────────────────────────────
export const dismissAlert = async (alertId, resolvedBy) => {
  const alert = await AiAlert.findById(alertId);
  if (!alert) throw new AppError("Alert not found", 404, "ALERT_NOT_FOUND");
  if (alert.status !== "active") {
    throw new AppError("Alert is already resolved or dismissed", 409, "ALERT_NOT_ACTIVE");
  }

  alert.status     = "dismissed";
  alert.resolvedBy = resolvedBy;
  alert.resolvedAt = new Date();
  return await alert.save();
};