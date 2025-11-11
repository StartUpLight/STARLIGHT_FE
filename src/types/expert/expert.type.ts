export interface getExpertResponse {
  result: string;
  id: number;
  name: string;
  profileImageUrl: string;
  email: string;
  mentoringPriceWon: number;
  careers: string[];
  categories: string[];
  tags: string[];
  workedPeriod: number;
}

export interface getFeedBackExpertResponse {
  result: string;
  data: number[];
}

export interface applyFeedBackProps {
  expertId: number;
  businessPlanId: number;
  file: File | Blob;
}

export interface applyFeedBackResponse {
  result: string;
  data: string;
}
