import { GetExpert, GetExpertDetail, GetFeedBackExpert } from '@/api/expert';
import { getFeedBackExpertResponse } from '@/types/expert/expert.type';
import { useQuery } from '@tanstack/react-query';

export function useGetExpert() {
  return useQuery({
    queryKey: ['GetExpert'],
    queryFn: () => GetExpert(),
  });
}

export function useGetFeedBackExpert(
  businessPlanId?: number,
  options?: { enabled?: boolean }
) {
  const hasToken =
    typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  const hasPlanId =
    typeof businessPlanId === 'number' &&
    businessPlanId > 0 &&
    (options?.enabled ?? true);

  const enabled = hasToken && hasPlanId;

  return useQuery<getFeedBackExpertResponse>({
    queryKey: ['GetFeedBackExpert', enabled ? businessPlanId : 'disabled'],
    queryFn: () => GetFeedBackExpert(businessPlanId as number),
    enabled,
  });
}

export function useExpertDetail(expertId: number) {
  return useQuery({
    queryKey: ['GetExpertDetail', expertId],
    queryFn: () => GetExpertDetail(expertId),
    enabled: expertId > 0,
  });
}
