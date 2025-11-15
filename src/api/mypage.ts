import { getMemberResponse, GetMyBusinessPlansResponse } from '@/types/mypage/mypage.type';
import api from './api';

export async function getMember(): Promise<getMemberResponse> {
  const res = await api.get<getMemberResponse>('/v1/members');

  return res.data;
}

export async function getMyBusinessPlans(): Promise<GetMyBusinessPlansResponse> {
  const response = await api.get<GetMyBusinessPlansResponse>('/v1/business-plans');
  return response.data;
}
