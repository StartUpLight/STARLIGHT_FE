import api from './api';
import {
  AiGradeResponse,
  BusinessPlanCreateResponse,
  BusinessPlanSubsectionRequest,
  BusinessPlanSubsectionResponse,
  BusinessSpellCheckRequest,
  BusinessSpellCheckResponse,
  SubSectionType,
} from '@/types/business/business.type';

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
  const res = await api.get(
    `/v1/business-plans/${planId}/subsections/${subSectionType}`
  );
  return res.data as BusinessPlanSubsectionResponse;
}

export async function postSpellCheck(body: BusinessSpellCheckRequest) {
  const res = await api.post<BusinessSpellCheckResponse>(
    `/v1/business-plans/spellcheck`,
    body
  );

  return res.data;
}

export async function postGrade(planId: number) {
  const res = await api.post(`/v1/ai-reports/${planId}/grade`);

  return res.data;
}

export async function getGrade(planId: number): Promise<AiGradeResponse> {
  const res = await api.get<AiGradeResponse>(`/v1/ai-reports/${planId}`, {
    params: { planId },
  });
  return res.data;
}
