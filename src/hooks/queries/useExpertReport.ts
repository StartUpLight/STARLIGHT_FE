import { GetExpertReport, GetUserExpertReport } from '@/api/expert';
import { getExpertReportsResponse } from '@/types/expert/expert.type';
import { useQuery } from '@tanstack/react-query';

export function useExpertReport(token: string) {
  return useQuery<getExpertReportsResponse, Error>({
    queryKey: ['GetExpertReport', token],
    queryFn: () => GetExpertReport(token),
    enabled: !!token,
  });
}

export function useUserExpertReport(businessPlanId: number) {
  return useQuery({
    queryKey: ['GetUserExpertReport', businessPlanId],
    queryFn: () => GetUserExpertReport(businessPlanId),
  });
}
