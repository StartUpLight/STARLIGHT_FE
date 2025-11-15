import { ApplyFeedback } from '@/api/expert';
import { useMutation } from '@tanstack/react-query';

export function useApplyFeedback() {
  return useMutation({
    mutationFn: ApplyFeedback,
  });
}
