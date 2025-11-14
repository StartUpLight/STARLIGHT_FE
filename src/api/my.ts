import api from './api';
import { GetMyBusinessPlansResponse } from '@/types/my/my.type';

export async function getMyBusinessPlans(): Promise<GetMyBusinessPlansResponse> {
    const response = await api.get<GetMyBusinessPlansResponse>('/v1/business-plans');
    return response.data;
}