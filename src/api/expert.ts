import {
  applyFeedBackProps,
  applyFeedBackResponse,
  expertReportsResponse,
  getExpertReportsResponse,
  getExpertResponse,
  getFeedBackExpertResponse,
  getUserExpertReportResponse,
} from '@/types/expert/expert.type';
import api from './api';
import { ExpertDetailResponse } from '@/types/expert/expert.detail';

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

export async function ApplyFeedback({
  businessPlanId,
  expertId,
  file,
}: applyFeedBackProps): Promise<applyFeedBackResponse> {
  const form = new FormData();
  form.append('businessPlanId', String(businessPlanId));
  form.append('file', file);

  const { data } = await api.post<applyFeedBackResponse>(
    `/v1/expert-applications/${expertId}/request`,
    form,
    {
      params: { businessPlanId, expertId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
}

export async function ExpertReporFeedback(
  token: string,
  body: expertReportsResponse
): Promise<expertReportsResponse> {
  const { data } = await api.post<expertReportsResponse>(
    `/v1/expert-reports/${token}`,
    body
  );

  return data;
}

export async function GetExpertReport(
  token: string
): Promise<getExpertReportsResponse> {
  const res = await api.get<{ data: getExpertReportsResponse }>(
    `/v1/expert-reports/${token}`
  );

  return res.data.data;
}

export async function GetUserExpertReport(
  businessPlanId: number
): Promise<getUserExpertReportResponse> {
  const res = await api.get<getUserExpertReportResponse>('/v1/expert-reports', {
    params: { businessPlanId },
  });

  return res.data;
}

export async function GetExpertDetail(
  expertId: number
): Promise<ExpertDetailResponse> {
  const res = await api.get<{ data: ExpertDetailResponse }>(
    `/v1/experts/${expertId}`,
    {
      params: { expertId },
    }
  );

  return res.data.data;
}
