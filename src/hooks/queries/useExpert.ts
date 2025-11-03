import { GetExpert, GetFeedBackExpert } from '@/api/expert';
import { getFeedBackExpertResponse } from '@/types/expert/expert.type';
import { useQuery } from '@tanstack/react-query';

export function useGetExpert() {
  return useQuery({
    queryKey: ['GetExpert'],
    queryFn: () => GetExpert(),
  });
}

export function useGetFeedBackExpert(businessPlanId: number) {
  return useQuery<getFeedBackExpertResponse>({
    queryKey: ['GetFeedBackExpert', businessPlanId],
    queryFn: () => GetFeedBackExpert(businessPlanId),
  });
}
