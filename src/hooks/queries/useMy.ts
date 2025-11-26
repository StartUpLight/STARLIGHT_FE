import {
  getMyBusinessPlans,
  GetMyBusinessPlansParams,
  getOrders,
} from '@/api/mypage';
import { GetOrderProps } from '@/types/mypage/mypage.type';
import { useQuery } from '@tanstack/react-query';

export function useGetMyBusinessPlans(params: GetMyBusinessPlansParams) {
  return useQuery({
    queryKey: ['GetMyBusinessPlans', params],
    queryFn: () => getMyBusinessPlans(params),
  });
}

export function useGetOrders() {
  return useQuery<GetOrderProps[]>({
    queryKey: ['GetOrder'],
    queryFn: getOrders,
  });
}
