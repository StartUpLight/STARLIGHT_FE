import { GetExpert, GetFeedBackExpert } from '@/api/expert';
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
  const enabled =
    typeof businessPlanId === 'number' &&
    businessPlanId > 0 &&
    (options?.enabled ?? true);

  return useQuery<getFeedBackExpertResponse>({
    queryKey: ['GetFeedBackExpert', enabled ? businessPlanId : 'none'],
    queryFn: () => GetFeedBackExpert(businessPlanId as number),
    enabled,
  });
}
