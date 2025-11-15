import { postGrade } from '@/api/business';
import { useMutation } from '@tanstack/react-query';

export function usePostGrade() {
  return useMutation({
    mutationFn: (planId: number) => postGrade(planId),
  });
}
