import { GetExpertReport } from '@/api/expert';
import { useQuery } from '@tanstack/react-query';

export function useExperReport(token: string) {
  return useQuery({
    queryKey: ['GetExpertReport', token],
    queryFn: () => GetExpertReport(token),
    enabled: !!token,
  });
}
