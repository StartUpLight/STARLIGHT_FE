import { getMyBusinessPlans, GetMyBusinessPlansParams } from '@/api/mypage';
import { useQuery } from '@tanstack/react-query';

export function useGetMyBusinessPlans(params: GetMyBusinessPlansParams) {
    return useQuery({
        queryKey: ['GetMyBusinessPlans', params],
        queryFn: () => getMyBusinessPlans(params),
    });
}

