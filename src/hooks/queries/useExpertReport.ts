import { GetExpertReport } from '@/api/expert';
import { useQuery } from '@tanstack/react-query';

export function useExpertReport(token: string) {
  return useQuery({
    queryKey: ['GetExpertReport', token],
    queryFn: () => GetExpertReport(token),
    enabled: !!token,
  });
}
