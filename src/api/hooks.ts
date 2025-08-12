// hooks.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult
} from '@tanstack/react-query';
import {
  addLog,
  fetchComputers,
  fetchLogs,
  fetchApplications,
  fetchApplicationByName,
  type AddLogDto,
  type AddLogResponse,
  type FetchLogsResponse,
  type ApplicationsResponse,
  type ApplicationDetail,
  type FetchLogsParams,
  type Computer
} from './axiosInstance';

// --- useAddLog ---
export function useAddLog(): UseMutationResult<
  AddLogResponse,
  unknown,
  AddLogDto
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['computers'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });
}

// --- useFetchComputers ---
export function useFetchComputers(): UseQueryResult<Computer[], unknown> {
  return useQuery({
    queryKey: ['computers'],
    queryFn: fetchComputers,
    staleTime: 5 * 60 * 1000
  });
}

// --- useFetchLogs ---
export function useFetchLogs(
  params: FetchLogsParams
): UseQueryResult<FetchLogsResponse, unknown> {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: () => fetchLogs(params),
    staleTime: 2 * 60 * 1000,
    enabled: !!params.device
  });
}

// --- useFetchApplications ---
export function useFetchApplications(
  page = 1,
  limit = 20
): UseQueryResult<ApplicationsResponse, unknown> {
  return useQuery({
    queryKey: ['applications', page, limit],
    queryFn: () => fetchApplications(page, limit),
    staleTime: 5 * 60 * 1000
  });
}

// --- useFetchApplicationByName ---
export function useFetchApplicationByName(
  name: string
): UseQueryResult<ApplicationDetail, unknown> {
  return useQuery({
    queryKey: ['application', name],
    queryFn: () => fetchApplicationByName(name),
    enabled: !!name
  });
}
