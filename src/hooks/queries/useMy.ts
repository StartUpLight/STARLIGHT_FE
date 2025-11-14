import { getMyBusinessPlans } from '@/api/my';
import { useQuery } from '@tanstack/react-query';

export function useGetMyBusinessPlans() {
    return useQuery({
        queryKey: ['GetMyBusinessPlans'],
        queryFn: () => getMyBusinessPlans(),
    });
}

