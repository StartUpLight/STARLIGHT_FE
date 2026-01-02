import { postPdfEvaluation } from '@/api/business';
import { PdfGradingRequestWithFile } from '@/types/business/business.type';
import { useMutation } from '@tanstack/react-query';

export function usePdfGrade() {
  return useMutation({
    mutationFn: (params: PdfGradingRequestWithFile) =>
      postPdfEvaluation(params),
  });
}
