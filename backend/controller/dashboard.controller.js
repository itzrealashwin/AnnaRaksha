// src/controllers/dashboard.controller.js
import catchAsync from "../utils/catchAsync.js";
import * as dashboardService from "../services/dashboard.service.js";

export const getOverview = catchAsync(async (req, res) => {
  const { warehouseId } = req.params;
  const data = await dashboardService.getDashboardOverview(
    warehouseId,
    req.user._id,
    req.user.role,
  );
  res.status(200).json({ success: true, data });
});

export const getEnvironment = catchAsync(async (req, res) => {
  const { warehouseId } = req.params;
  const hours = parseInt(req.query.hours) || 24;
  const data = await dashboardService.getEnvironmentTrend(warehouseId, hours);
  res.status(200).json({ success: true, data });
});

export const getRiskBatches = catchAsync(async (req, res) => {
  const { warehouseId } = req.params;
  const minRisk = parseInt(req.query.minRisk) || 50;
  const limit = parseInt(req.query.limit) || 10;
  const data = await dashboardService.getRiskBatches(
    warehouseId,
    minRisk,
    limit,
  );
  res.status(200).json({ success: true, data });
});

export const getAlertsFeed = catchAsync(async (req, res) => {
  const { warehouseId } = req.params;
  const limit = parseInt(req.query.limit) || 15;
  const data = await dashboardService.getRecentAlerts(warehouseId, limit);
  res.status(200).json({ success: true, data });
});

export const getInventorySummary = catchAsync(async (req, res) => {
  const { warehouseId } = req.params;
  const data = await dashboardService.getInventorySummary(warehouseId);
  res.status(200).json({ success: true, data });
});
