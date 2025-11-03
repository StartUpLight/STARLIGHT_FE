import api from './api';
import { BusinessPlanCreateResponse, BusinessPlanSubsectionRequest } from '@/types/business/business.type';

export async function postBusinessPlan(): Promise<BusinessPlanCreateResponse> {
    const res = await api.post(`/v1/business-plans`);
    return res.data as BusinessPlanCreateResponse;
}

export async function postBusinessPlanSubsections(
    planId: number,
    body: BusinessPlanSubsectionRequest
) {
    const res = await api.post(`/v1/business-plans/${planId}/subsections`, body);
    return res.data;
}


