import { ExpertReporFeedback } from '@/api/expert';
import { expertReportsResponse } from '@/types/expert/expert.type';
import { useMutation } from '@tanstack/react-query';

export function useExpertReportFeedback(token: string) {
  return useMutation<expertReportsResponse, unknown, expertReportsResponse>({
    mutationFn: (body) => ExpertReporFeedback(token, body),
  });
}
