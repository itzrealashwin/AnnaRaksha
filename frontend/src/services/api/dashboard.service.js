import { api } from "@/lib/react-query.js";

// Dashboard data service talking to protected backend routes
export const dashboardService = {
  getOverview: async (warehouseId) => {
    const response = await api.get(`/dashboard/${warehouseId}/overview`);
    return response.data?.data;
  },

  getEnvironment: async (warehouseId, { hours = 24 } = {}) => {
    const response = await api.get(`/dashboard/${warehouseId}/environment`, {
      params: { hours },
    });
    return response.data?.data;
  },

  getRiskBatches: async (
    warehouseId,
    { minRisk = 50, limit = 10 } = {},
  ) => {
    const response = await api.get(`/dashboard/${warehouseId}/risk-batches`, {
      params: { minRisk, limit },
    });
    return response.data?.data;
  },

  getAlerts: async (warehouseId, { limit = 15 } = {}) => {
    const response = await api.get(`/dashboard/${warehouseId}/alerts`, {
      params: { limit },
    });
    return response.data?.data;
  },

  getInventorySummary: async (warehouseId) => {
    const response = await api.get(
      `/dashboard/${warehouseId}/inventory-summary`,
    );
    return response.data?.data;
  },
};

export default dashboardService;