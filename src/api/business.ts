import api from './api';
import { BusinessPlanCreateResponse, BusinessPlanSubsectionRequest, BusinessPlanSubsectionResponse, SubSectionType } from '@/types/business/business.type';

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

export async function getBusinessPlanSubsection(
    planId: number,
    subSectionType: SubSectionType
): Promise<BusinessPlanSubsectionResponse> {
    const res = await api.get(`/v1/business-plans/${planId}/subsections/${subSectionType}`);
    return res.data as BusinessPlanSubsectionResponse;
}


