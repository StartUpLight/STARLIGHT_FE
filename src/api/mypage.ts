import {
  getMemberResponse,
  GetMyBusinessPlansResponse,
  GetOrderProps,
  GetOrderResponse,
} from '@/types/mypage/mypage.type';
import api from './api';

export async function getMember(): Promise<getMemberResponse> {
  const res = await api.get<getMemberResponse>('/v1/members');

  return res.data;
}

export interface GetMyBusinessPlansParams {
  page?: number;
  size?: number;
}

export async function getMyBusinessPlans(
  params: GetMyBusinessPlansParams
): Promise<GetMyBusinessPlansResponse> {
  const response = await api.get<GetMyBusinessPlansResponse>(
    '/v1/business-plans',
    {
      params,
    }
  );
  return response.data;
}

export async function getOrders(): Promise<GetOrderProps[]> {
  const res = await api.get<GetOrderResponse>('/v1/orders');

  return res.data.data;
}
