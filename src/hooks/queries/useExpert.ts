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

export function useExpertReportDetail(expertId: number) {
  return useQuery({
    queryKey: ['GetExpertReportDetail', expertId],
    queryFn: () => GetExpertReportDetail(expertId),
    enabled: expertId > 0,
  });
}
