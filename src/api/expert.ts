import { getExpertResponse } from '@/types/expert/expert.type';
import api from './api';

export async function GetExpert(): Promise<getExpertResponse[]> {
  const res = await api.get<{ data: getExpertResponse[] }>('/v1/experts');
  return res.data.data;
}
