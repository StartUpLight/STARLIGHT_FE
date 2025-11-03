import api from './api';
import { BusinessPlanSubsectionRequest } from '@/types/business/business.type';

export async function postBusinessPlanSubsections(
    planId: number,
    body: BusinessPlanSubsectionRequest
) {
    const res = await api.post(`/v1/business-plans/${planId}/subsections`, body);
    return res.data;
}


