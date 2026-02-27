import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// Adjust the import path to wherever you saved the warehouse service
import { warehouseService } from '@/services/api/warehouse.service.js'; 

// ============================================================================
// INDIVIDUAL HOOKS (Queries & Mutations)
// ============================================================================

// --- QUERIES ---

export const useWarehouses = (params = {}) => {
    return useQuery({
        // Include params in the queryKey so it automatically refetches if filters/pagination change
        queryKey: ['warehouses', params], 
        queryFn: () => warehouseService.getAllWarehouses(params),
        // Keep data fresh for 5 minutes before background refetching
        staleTime: 1000 * 60 * 5, 
    });
};

export const useWarehouseDetail = (id) => {
    return useQuery({
        queryKey: ['warehouse', id],
        queryFn: () => warehouseService.getWarehouse(id),
        // Only run this query if a valid ID is passed in
        enabled: !!id, 
        staleTime: 1000 * 60 * 5,
    });
};

// --- MUTATIONS ---

export const useCreateWarehouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (warehouseData) => warehouseService.createWarehouse(warehouseData),
        onSuccess: () => {
            // Invalidate the list query so the table/list automatically updates
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        },
    });
};

export const useUpdateWarehouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updateData) => warehouseService.updateWarehouse(updateData),
        onSuccess: (data, variables) => {
            // Invalidate both the list and the specific warehouse detail cache
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
            queryClient.invalidateQueries({ queryKey: ['warehouse', variables.id] });
        },
    });
};

export const useDeleteWarehouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => warehouseService.deleteWarehouse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        },
    });
};


// ============================================================================
// MAIN FACADE HOOK (For clean UI components)
// ============================================================================

export const useWarehouse = (params = {}) => {
    // 1. Get current list state (passing params for pagination/filtering)
    const { 
        data: warehousesData, 
        isLoading: isListLoading, 
        isError: isListError,
        isFetching: isListFetching,
        refetch: refetchList
    } = useWarehouses(params);

    // 2. Get mutations
    const createMutation = useCreateWarehouse();
    const updateMutation = useUpdateWarehouse();
    const deleteMutation = useDeleteWarehouse();

    return {
        // --- List Query State ---
        // Depending on your API structure, you might need to extract the array (e.g., warehousesData.data)
        warehouses: warehousesData, 
        isWarehousesLoading: isListLoading || isListFetching,
        isWarehousesError: isListError,
        refetchWarehouses: refetchList,

        // --- Create Actions & State ---
        createWarehouse: createMutation.mutate,
        createWarehouseAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,

        // --- Update Actions & State ---
        updateWarehouse: updateMutation.mutate,
        updateWarehouseAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,

        // --- Delete Actions & State ---
        deleteWarehouse: deleteMutation.mutate,
        deleteWarehouseAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,
    };
};