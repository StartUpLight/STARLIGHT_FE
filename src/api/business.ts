import { CheckListResponse } from '@/types/business/checklist.type';
import api from './api';
// import type { AxiosError } from 'axios';
import {
  BusinessPlanCreateResponse,
  BusinessPlanSubsectionRequest,
  BusinessPlanSubsectionResponse,
  BusinessSpellCheckRequest,
  BusinessSpellCheckResponse,
  BusinessPlanTitleResponse,
  SubSectionType,
  AiGradeResponse,
  BusinessPlanSubsectionsResponse,
  PdfGradingRequest,
  PdfGradingRequestWithFile,
} from '@/types/business/business.type';
import { uploadImage } from '@/lib/imageUpload';

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
  subSectionType: SubSectionType,
  signal?: AbortSignal
): Promise<BusinessPlanSubsectionResponse> {
  try {
    const res = await api.get(
      `/v1/business-plans/${planId}/subsections/${subSectionType}`,
      { signal }
    );
    return res.data as BusinessPlanSubsectionResponse;
    //404 에러 처리(임시로 404에러를 무시하도록 처리합니다.)
  } catch (error) {
    // const axiosError = error as AxiosError;
    // if (axiosError.response?.status === 404) {
    //   return {
    //     result: 'SUCCESS',
    //     data: {
    //       message: 'NOT_FOUND',
    //       content: {
    //         subSectionType,
    //         checks: [],
    //         meta: {
    //           author: '',
    //           createdAt: new Date().toISOString().split('T')[0],
    //         },
    //         blocks: [],
    //       },
    //     },
    //     error: null,
    //   };
    // }
    throw error;
  }
}

export async function getBusinessPlanSubsections(
  planId: number
): Promise<BusinessPlanSubsectionsResponse> {
  const res = await api.get(`/v1/business-plans/${planId}/subsections`);
  return res.data as BusinessPlanSubsectionsResponse;
}

export async function getBusinessPlanTitle(
  planId: number
): Promise<BusinessPlanTitleResponse> {
  const res = await api.get(`/v1/business-plans/${planId}/titles`);
  return res.data as BusinessPlanTitleResponse;
}

export async function patchBusinessPlanTitle(
  planId: number,
  title: string
): Promise<BusinessPlanTitleResponse> {
  const res = await api.patch(`/v1/business-plans/${planId}`, { title: title });
  return res.data as BusinessPlanTitleResponse;
}

export async function postSpellCheck(body: BusinessSpellCheckRequest) {
  const res = await api.post<BusinessSpellCheckResponse>(
    `/v1/business-plans/spellcheck`,
    body
  );

  return res.data;
}

export async function postGrade(planId: number) {
  const res = await api.post(`/v1/ai-reports/evaluation/${planId}`);

  return res.data;
}

export async function getGrade(planId: number): Promise<AiGradeResponse> {
  const res = await api.get<AiGradeResponse>(`/v1/ai-reports/${planId}`, {
    params: { planId },
  });
  return res.data;
}

export async function postCheckList(planId: number, body: CheckListResponse) {
  const res = await api.post(
    `/v1/business-plans/${planId}/subsections/check-and-update`,
    body
  );

  return res.data;
}

export async function postPdfEvaluation(
  params: PdfGradingRequestWithFile
): Promise<AiGradeResponse> {
  const { title, file } = params;

  const pdfUrl = await uploadImage(file);

  const body: PdfGradingRequest = {
    title,
    pdfUrl,
  };

  const res = await api.post(`/v1/ai-reports/evaluation/pdf`, body);

  return res.data;
}
