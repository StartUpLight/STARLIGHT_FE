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
