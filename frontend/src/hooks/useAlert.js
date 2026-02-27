import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alertService } from '@/services/api/alert.service.js';

// ============================================================================
// INDIVIDUAL HOOKS (Queries & Mutations)
// ============================================================================

// --- QUERIES ---

export const useAlerts = (params = {}) => {
    return useQuery({
        queryKey: ['alerts', params],
        queryFn: () => alertService.getAlerts(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useAlertDetail = (id) => {
    return useQuery({
        queryKey: ['alert', id],
        queryFn: () => alertService.getAlertById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

// --- MUTATIONS ---

export const useResolveAlert = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => alertService.resolveAlert(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
            queryClient.invalidateQueries({ queryKey: ['alert', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // Refresh dashboard alerts
        },
    });
};

export const useManualReAnalyze = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (batchId) => alertService.manualReAnalyze(batchId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

export const useDismissAlert = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => alertService.dismissAlert(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['alerts'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

// ============================================================================
// MAIN FACADE HOOK (For clean UI components)
// ============================================================================

export const useAlert = (params = {}) => {
    const { 
        data: alertsData, 
        isLoading: isAlertsLoading, 
        isError: isAlertsError,
        isFetching: isAlertsFetching,
        refetch: refetchAlerts
    } = useAlerts(params);

    const resolveMutation = useResolveAlert();
    const reAnalyzeMutation = useManualReAnalyze();
    const dismissMutation = useDismissAlert();

    return {
        // --- List Query State ---
        alerts: alertsData, 
        isAlertsLoading: isAlertsLoading || isAlertsFetching,
        isAlertsError,
        refetchAlerts,

        // --- Resolve Actions & State ---
        resolveAlert: resolveMutation.mutate,
        resolveAlertAsync: resolveMutation.mutateAsync,
        isResolving: resolveMutation.isPending,
        resolveError: resolveMutation.error,

        // --- Re-Analyze Actions & State ---
        manualReAnalyze: reAnalyzeMutation.mutate,
        manualReAnalyzeAsync: reAnalyzeMutation.mutateAsync,
        isReAnalyzing: reAnalyzeMutation.isPending,
        reAnalyzeError: reAnalyzeMutation.error,

        // --- Dismiss Actions & State ---
        dismissAlert: dismissMutation.mutate,
        dismissAlertAsync: dismissMutation.mutateAsync,
        isDismissing: dismissMutation.isPending,
        dismissError: dismissMutation.error,
    };
};
