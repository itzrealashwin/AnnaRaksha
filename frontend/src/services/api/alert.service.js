import { api } from '@/lib/react-query.js';

export const alertService = {
    getAlerts: async (params) => {
        const response = await api.get('/alerts', { params });
        return response.data;
    },

    getAlertById: async (id) => {
        const response = await api.get(`/alerts/${id}`);
        return response.data;
    },

    resolveAlert: async ({ id, resolutionNotes }) => {
        const response = await api.put(`/alerts/${id}/resolve`, { resolutionNotes });
        return response.data;
    },

    manualReAnalyze: async (batchId) => {
        const response = await api.post(`/alerts/manual/${batchId}`);
        return response.data;
    },

    dismissAlert: async (id) => {
        const response = await api.delete(`/alerts/${id}`);
        return response.data;
    }
};
