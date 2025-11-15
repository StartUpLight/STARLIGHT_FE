import { getMyBusinessPlans } from '@/api/mypage';
import { useQuery } from '@tanstack/react-query';

export function useGetMyBusinessPlans() {
    return useQuery({
        queryKey: ['GetMyBusinessPlans'],
        queryFn: () => getMyBusinessPlans(),
    });
}

