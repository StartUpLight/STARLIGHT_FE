import { getMemberResponse } from '@/types/mypage/mypage.type';
import api from './api';

export async function getMember(): Promise<getMemberResponse> {
  const res = await api.get<getMemberResponse>('/v1/members');

  return res.data;
}
