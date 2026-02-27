import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { batchService } from '@/services/api/batch.service.js';

// ============================================================================
// INDIVIDUAL HOOKS (Queries & Mutations)
// ============================================================================

// --- QUERIES ---

export const useBatches = (params = {}) => {
    return useQuery({
        queryKey: ['batches', params],
        queryFn: () => batchService.getBatches(params),
        staleTime: 1000 * 60 * 5,
    });
};

export const useBatchDetail = (id) => {
    return useQuery({
        queryKey: ['batch', id],
        queryFn: () => batchService.getBatchById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

// --- MUTATIONS ---

export const useCreateBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (batchData) => batchService.createBatch(batchData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
        },
    });
};

export const useUpdateBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updateData) => batchService.updateBatch(updateData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['batch', variables.id] });
        },
    });
};

export const useDeleteBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => batchService.deleteBatch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
        },
    });
};

export const useDispatchBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dispatchData) => batchService.dispatchBatch(dispatchData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['batch', variables.id] });
        },
    });
};


// ============================================================================
// MAIN FACADE HOOK (For clean UI components)
// ============================================================================

export const useBatch = (params = {}) => {
    // 1. Get current list state (passing params for pagination/filtering)
    const { 
        data: batchesData, 
        isLoading: isListLoading, 
        isError: isListError,
        isFetching: isListFetching,
        refetch: refetchList
    } = useBatches(params);

    // 2. Get mutations
    const createMutation = useCreateBatch();
    const updateMutation = useUpdateBatch();
    const deleteMutation = useDeleteBatch();
    const dispatchMutation = useDispatchBatch();

    return {
        // --- List Query State ---
        batches: batchesData, 
        isBatchesLoading: isListLoading || isListFetching,
        isBatchesError: isListError,
        refetchBatches: refetchList,

        // --- Create Actions & State ---
        createBatch: createMutation.mutate,
        createBatchAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,

        // --- Update Actions & State ---
        updateBatch: updateMutation.mutate,
        updateBatchAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,

        // --- Delete Actions & State ---
        deleteBatch: deleteMutation.mutate,
        deleteBatchAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,

        // --- Dispatch Actions & State ---
        dispatchBatch: dispatchMutation.mutate,
        dispatchBatchAsync: dispatchMutation.mutateAsync,
        isDispatching: dispatchMutation.isPending,
        dispatchError: dispatchMutation.error,
    };
};