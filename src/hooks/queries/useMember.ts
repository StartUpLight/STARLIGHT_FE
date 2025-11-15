import { getMember } from '@/api/mypage';
import { useQuery } from '@tanstack/react-query';

export function useGetMember() {
  return useQuery({
    queryKey: ['GetMember'],
    queryFn: () => getMember(),
  });
}
