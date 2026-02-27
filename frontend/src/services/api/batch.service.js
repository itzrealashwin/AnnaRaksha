import { api } from '@/lib/react-query.js';

export const batchService = {
    createBatch: async (data) => {
        const response = await api.post('/batches', data);
        return response.data;
    },

    getBatches: async (params) => {
        const response = await api.get('/batches', { params });
        return response.data;
    },

    getBatchById: async (id) => {
        const response = await api.get(`/batches/${id}`);
        return response.data;
    },

    updateBatch: async ({ id, data }) => {
        const response = await api.post(`/batches/${id}`, data);
        return response.data;
    },

    deleteBatch: async (id) => {
        const response = await api.delete(`/batches/${id}`);
        return response.data;
    },

    dispatchBatch: async ({ id, data }) => {
        const response = await api.post(`/batches/${id}/dispatch`, data);
        return response.data;
    }
};
