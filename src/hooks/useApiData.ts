/**
 * API Data Hook - Manages data fetching and caching
 * Provides React hooks for all Flask API endpoints
 */

import { useState, useEffect, useCallback } from 'react';
import api, { ApiResponse } from '@/utils/api';
import { toast } from 'sonner';

interface UseApiDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  autoFetch?: boolean;
  dependencies?: any[];
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: (data: T) => void;
}

/**
 * Generic API data fetching hook
 */
function useApiData<T = any>(
  fetchFn: () => Promise<ApiResponse<T>>,
  options: UseApiDataOptions<T> = {}
): UseApiDataReturn<T> {
  const {
    initialData = null,
    onSuccess,
    onError,
    autoFetch = true,
    dependencies = []
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchFn();
      
      if (response.error) {
        setError(response.error);
        onError?.(response.error);
      } else if (response.data) {
        setData(response.data);
        onSuccess?.(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData
  };
}

/**
 * Employee data hooks
 */
export function useEmployees(filters?: any) {
  return useApiData(
    () => api.employee.getEmployees(filters),
    { dependencies: [filters] }
  );
}

export function useEmployee(id: string) {
  return useApiData(
    () => api.employee.getEmployee(id),
    { 
      autoFetch: !!id,
      dependencies: [id] 
    }
  );
}

/**
 * Attendance data hooks
 */
export function useAttendanceLogs(startDate?: string, endDate?: string) {
  return useApiData(
    () => api.attendance.getLogs(startDate, endDate),
    { dependencies: [startDate, endDate] }
  );
}

export function useAttendanceSummary(period: string = 'current_month') {
  return useApiData(
    () => api.attendance.getSummary(period),
    { dependencies: [period] }
  );
}

/**
 * Leave management hooks
 */
export function useLeaveRequests(status?: string) {
  return useApiData(
    () => api.leave.getRequests(status),
    { dependencies: [status] }
  );
}

export function useLeaveBalance() {
  return useApiData(() => api.leave.getBalance());
}

/**
 * Performance data hooks
 */
export function useGoals() {
  return useApiData(() => api.performance.getGoals());
}

export function usePerformanceReviews() {
  return useApiData(() => api.performance.getReviews());
}

/**
 * Dashboard data hooks
 */
export function useDashboardWidgets() {
  return useApiData(() => api.dashboard.getWidgets());
}

/**
 * Notifications hooks
 */
export function useNotifications() {
  return useApiData(() => api.notifications.getNotifications());
}

/**
 * Custom hook for form submissions
 */
export function useApiMutation<TData = any, TVariables = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (
    mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
    variables: TVariables,
    options?: {
      onSuccess?: (data: TData) => void;
      onError?: (error: string) => void;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<TData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);
      
      if (response.error) {
        setError(response.error);
        options?.onError?.(response.error);
        if (options?.errorMessage) {
          toast.error(options.errorMessage);
        }
        return null;
      } else if (response.data) {
        options?.onSuccess?.(response.data);
        if (options?.successMessage) {
          toast.success(options.successMessage);
        }
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mutate,
    loading,
    error
  };
}

/**
 * Specific mutation hooks for common operations
 */
export function useClockInOut() {
  const { mutate, loading, error } = useApiMutation();

  const clockInOut = useCallback((action: 'in' | 'out', location?: string) => {
    return mutate(
      (variables: { action: 'in' | 'out'; location?: string }) => 
        api.attendance.clockInOut(variables.action, variables.location),
      { action, location },
      {
        successMessage: `Successfully clocked ${action}`,
        errorMessage: `Failed to clock ${action}`
      }
    );
  }, [mutate]);

  return { clockInOut, loading, error };
}

export function useSubmitLeaveRequest() {
  const { mutate, loading, error } = useApiMutation();

  const submitRequest = useCallback((requestData: any) => {
    return mutate(
      (data: any) => api.leave.submitRequest(data),
      requestData,
      {
        successMessage: 'Leave request submitted successfully',
        errorMessage: 'Failed to submit leave request'
      }
    );
  }, [mutate]);

  return { submitRequest, loading, error };
}

export function useCreateEmployee() {
  const { mutate, loading, error } = useApiMutation();

  const createEmployee = useCallback((employeeData: any) => {
    return mutate(
      (data: any) => api.employee.createEmployee(data),
      employeeData,
      {
        successMessage: 'Employee created successfully',
        errorMessage: 'Failed to create employee'
      }
    );
  }, [mutate]);

  return { createEmployee, loading, error };
}

export function useUpdateEmployee() {
  const { mutate, loading, error } = useApiMutation();

  const updateEmployee = useCallback((id: string, employeeData: any) => {
    return mutate(
      ({ id, data }: { id: string; data: any }) => api.employee.updateEmployee(id, data),
      { id, data: employeeData },
      {
        successMessage: 'Employee updated successfully',
        errorMessage: 'Failed to update employee'
      }
    );
  }, [mutate]);

  return { updateEmployee, loading, error };
}

export function useCreateGoal() {
  const { mutate, loading, error } = useApiMutation();

  const createGoal = useCallback((goalData: any) => {
    return mutate(
      (data: any) => api.performance.createGoal(data),
      goalData,
      {
        successMessage: 'Goal created successfully',
        errorMessage: 'Failed to create goal'
      }
    );
  }, [mutate]);

  return { createGoal, loading, error };
}

/**
 * Hook for search functionality
 */
export function useGlobalSearch() {
  const [searchResults, setSearchResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, modules?: string[]) => {
    if (!query || query.length < 2) {
      setSearchResults({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.search.globalSearch(query, modules);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setSearchResults(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchResults,
    loading,
    error,
    search
  };
}

/**
 * Hook for report generation
 */
export function useReportGeneration() {
  const { mutate, loading, error } = useApiMutation();

  const generateReport = useCallback((type: string, filters: any) => {
    return mutate(
      ({ type, filters }: { type: string; filters: any }) => 
        api.reports.generateReport(type, filters),
      { type, filters },
      {
        successMessage: 'Report generated successfully',
        errorMessage: 'Failed to generate report'
      }
    );
  }, [mutate]);

  const exportReport = useCallback((reportId: string, format: string) => {
    return mutate(
      ({ reportId, format }: { reportId: string; format: string }) => 
        api.reports.exportReport(reportId, format),
      { reportId, format },
      {
        successMessage: 'Report exported successfully',
        errorMessage: 'Failed to export report'
      }
    );
  }, [mutate]);

  return { generateReport, exportReport, loading, error };
}

// Export the base hook for custom usage
export { useApiData };
