import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/api/dashboard.service.js";

const staleShort = 1000 * 30;

export const useDashboardOverview = (warehouseId) =>
  useQuery({
    queryKey: ["dashboard", "overview", warehouseId],
    queryFn: () => dashboardService.getOverview(warehouseId),
    enabled: Boolean(warehouseId),
    staleTime: staleShort,
  });

export const useEnvironmentTrend = (warehouseId, options = {}) =>
  useQuery({
    queryKey: ["dashboard", "environment", warehouseId, options],
    queryFn: () => dashboardService.getEnvironment(warehouseId, options),
    enabled: Boolean(warehouseId),
    staleTime: staleShort,
  });

export const useRiskBatches = (warehouseId, options = {}) =>
  useQuery({
    queryKey: ["dashboard", "risk-batches", warehouseId, options],
    queryFn: () => dashboardService.getRiskBatches(warehouseId, options),
    enabled: Boolean(warehouseId),
    staleTime: staleShort,
  });

export const useAlertsFeed = (warehouseId, options = {}) =>
  useQuery({
    queryKey: ["dashboard", "alerts", warehouseId, options],
    queryFn: () => dashboardService.getAlerts(warehouseId, options),
    enabled: Boolean(warehouseId),
    staleTime: staleShort,
  });

export const useInventorySummary = (warehouseId) =>
  useQuery({
    queryKey: ["dashboard", "inventory-summary", warehouseId],
    queryFn: () => dashboardService.getInventorySummary(warehouseId),
    enabled: Boolean(warehouseId),
    staleTime: staleShort,
  });

export default {
  useDashboardOverview,
  useEnvironmentTrend,
  useRiskBatches,
  useAlertsFeed,
  useInventorySummary,
};