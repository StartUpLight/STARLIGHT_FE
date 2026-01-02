import { useMutation } from '@tanstack/react-query';
import { postCheckList } from '@/api/business';
import { CheckListResponse } from '@/types/business/checklist.type';

type CheckListRequest = { planId: number; body: CheckListResponse };
type CheckListApiResponse = { data: boolean[] };

export function usePostCheckList() {
  return useMutation<CheckListApiResponse, unknown, CheckListRequest>({
    mutationFn: ({ planId, body }) => postCheckList(planId, body),
  });
}
