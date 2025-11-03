import {
  getExpertResponse,
  getFeedBackExpertResponse,
} from '@/types/expert/expert.type';
import api from './api';

export async function GetExpert(): Promise<getExpertResponse[]> {
  const res = await api.get<{ data: getExpertResponse[] }>('/v1/experts');
  return res.data.data;
}

export async function GetFeedBackExpert(
  businessPlanId: number
): Promise<getFeedBackExpertResponse> {
  if (!Number.isFinite(businessPlanId) || businessPlanId <= 0) {
    throw new Error('유효하지 않는 아이디입니다.');
  }
  const { data } = await api.get<getFeedBackExpertResponse>(
    '/v1/expert-applications',
    { params: { businessPlanId } }
  );
  return data;
}
