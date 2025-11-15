export interface getMemberRequest {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  provider: string;
  profileImageUrl: string;
}
export interface getMemberResponse {
  result: string;
  data: getMemberRequest;
  error: {
    code: string;
    message: string;
  };
}

export interface BusinessPlanItem {
  businessPlanId: number;
  title: string;
  lastSavedAt: string;
  planStatus: string;
}

export interface GetMyBusinessPlansResponse {
  result: 'SUCCESS';
  data: BusinessPlanItem[];
  error: {
    code: string;
    message: string;
  } | null;
}