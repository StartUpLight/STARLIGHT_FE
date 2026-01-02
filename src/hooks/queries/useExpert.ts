import {
  GetExpert,
  GetExpertDetail,
  GetExpertReportDetail,
} from '@/api/expert';
import { useQuery } from '@tanstack/react-query';

export function useGetExpert() {
  return useQuery({
    queryKey: ['GetExpert'],
    queryFn: () => GetExpert(),
  });
}

export function useExpertDetail(expertId: number) {
  return useQuery({
    queryKey: ['GetExpertDetail', expertId],
    queryFn: () => GetExpertDetail(expertId),
    enabled: expertId > 0,
  });
}

export function useExpertReportDetail(
  expertId: number,
  options?: { enabled?: boolean }
) {
  const hasToken = localStorage.getItem('accessToken');
  return useQuery({
    queryKey: ['GetExpertReportDetail', expertId, hasToken],
    queryFn: () => GetExpertReportDetail(expertId),
    enabled: expertId > 0 && !!hasToken && (options?.enabled ?? true),
  });
}
