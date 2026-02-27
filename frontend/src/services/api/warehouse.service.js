import { api } from '@/lib/react-query.js';

export const warehouseService = {
    createWarehouse: async (data) => {
        const response = await api.post('/warehouse', data);
        return response.data;
    },

    getAllWarehouses: async (params) => {
        // params can be used for pagination, filtering, or sorting (e.g., ?page=1&limit=10)
        const response = await api.get('/warehouse', { params });
        return response.data;
    },

    getWarehouse: async (id) => {
        const response = await api.get(`/warehouse/${id}`);
        return response.data;
    },

    updateWarehouse: async ({ id, data }) => {
        const response = await api.patch(`/warehouse/${id}`, data);
        return response.data;
    },

    deleteWarehouse: async (id) => {
        const response = await api.delete(`/warehouse/${id}`);
        return response.data;
    }
};