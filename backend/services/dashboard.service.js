// src/services/dashboard.service.js
import Warehouse from "../model/warehouse.model.js";
import Batch from "../model/batch.model.js";
import SensorReading from "../model/sensorReading.model.js";
import Alert from "../model/aiAlert.model.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
const DEFAULT_RISK_THRESHOLD = 50;
const DEFAULT_LIMIT = 10;

/**
 * Main overview stats card
 */
export const getDashboardOverview = async (warehouseId, userId, role) => {
  // Permission check (very basic – improve as per your auth logic)
  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse || !warehouse.isActive) {
    throw new AppError("Warehouse not found or inactive", 404);
  }
  // Add role-based check if needed

  const batchStats = await Batch.aggregate([
    {
      $match: { warehouseId: warehouse._id, isActive: true, isDeleted: false },
    },
    {
      $group: {
        _id: null,
        totalBatches: { $sum: 1 },
        totalStock: { $sum: "$quantityCurrent" },
        highRiskCount: {
          $sum: {
            $cond: [{ $gte: ["$riskScore", DEFAULT_RISK_THRESHOLD] }, 1, 0],
          },
        },
        criticalRiskCount: {
          $sum: { $cond: [{ $gte: ["$riskScore", 80] }, 1, 0] },
        },
      },
    },
  ]);

  const stats = batchStats[0] || {
    totalBatches: 0,
    totalStock: 0,
    highRiskCount: 0,
    criticalRiskCount: 0,
  };

  return {
    warehouseName: warehouse.name,
    capacity: warehouse.capacity,
    currentStock: warehouse.currentStock || stats.totalStock,
    utilizationPercent: warehouse.utilizationPercent,
    totalBatches: stats.totalBatches,
    riskBatchCount: stats.highRiskCount,
    criticalRiskCount: stats.criticalRiskCount,
    status: warehouse.status,
    lastUpdated: new Date(),
  };
};

/**
 * Current environment + short history
 */
export const getEnvironmentTrend = async (warehouseId, hours = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const readings = await SensorReading.find({
    warehouseId,
    recordedAt: { $gte: since },
  })
    .sort({ recordedAt: -1 })
    .limit(100) // prevent too much data
    .lean();

  if (readings.length === 0) {
    return { latest: null, trend: [] };
  }

  const latest = readings[0];

  // Simple trend: last 20 points or all if less
  const trend = readings.slice(0, Math.min(20, readings.length)).map((r) => ({
    timestamp: r.recordedAt,
    temperature: r.temperature,
    humidity: r.humidity,
  }));

  return { latest, trend };
};

/**
 * Risk batches list
 */
export const getRiskBatches = async (
  warehouseId,
  minRisk = DEFAULT_RISK_THRESHOLD,
  limit = DEFAULT_LIMIT,
) => {
  const batches = await Batch.find({
    warehouseId,
    isActive: true,
    isDeleted: false,
    riskScore: { $gte: minRisk },
  })
    .sort({ riskScore: -1, expiryDate: 1 })
    .limit(limit)
    .select(
      "batchId produceType quantityCurrent quantityInitial expiryDate riskScore riskLevel status daysStored",
    )
    .lean();

  return batches;
};

/**
 * Recent active alerts
 */
export const getRecentAlerts = async (warehouseId, limit = 15) => {
  const alerts = await Alert.find({
    warehouseId,
    isResolved: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select(
      "severity message riskScore batchId createdAt reason recommendedAction",
    )
    .populate("batchId", "batchId produceType")
    .lean();

  return alerts;
};

/**
 * Inventory summary grouped by produceType
 */
export const getInventorySummary = async (warehouseId) => {
  const summary = await Batch.aggregate([
    {
      $match: {
        // Explicitly cast the string to an ObjectId
        warehouseId: new mongoose.Types.ObjectId(warehouseId), 
        isActive: true,
        isDeleted: false,
        status: { $nin: ["Dispatched", "Disposed"] },
      },
    },
    {
      $group: {
        _id: "$produceType",
        totalQuantity: { $sum: "$quantityCurrent" },
        batchCount: { $sum: 1 },
        avgRisk: { $avg: "$riskScore" },
        nearExpiryCount: {
          $sum: {
            $cond: [
              { $lte: ["$daysStored", { $multiply: ["$shelfLifeDays", 0.8] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        produceType: "$_id",
        totalQuantity: 1,
        batchCount: 1,
        avgRisk: { $round: ["$avgRisk", 1] },
        nearExpiryCount: 1,
        _id: 0,
      },
    },
    { $sort: { totalQuantity: -1 } },
  ]);

  return summary;
};

export default {
  getDashboardOverview,
  getEnvironmentTrend,
  getRiskBatches,
  getRecentAlerts,
  getInventorySummary,
};
