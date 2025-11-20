import { GetExpertReport, GetUserExpertReport } from '@/api/expert';
import { useQuery } from '@tanstack/react-query';

export function useExpertReport(token: string) {
  return useQuery({
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
