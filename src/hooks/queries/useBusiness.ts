import { getGrade } from '@/api/business';
import { useQuery } from '@tanstack/react-query';

export function useGetGrade(planId: number) {
  return useQuery({
    queryKey: ['GetAiReport', planId],
    queryFn: () => getGrade(planId),
  });
}
