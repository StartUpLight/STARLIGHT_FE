import { postSpellCheck } from '@/api/business';
import {
  BusinessSpellCheckRequest,
  BusinessSpellCheckResponse,
} from '@/types/business/business.type';
import { useMutation } from '@tanstack/react-query';

export function useSpellCheck() {
  return useMutation<
    BusinessSpellCheckResponse,
    unknown,
    BusinessSpellCheckRequest
  >({
    mutationFn: postSpellCheck,
  });
}
