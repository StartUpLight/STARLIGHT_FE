export interface ExpertDetailResponse {
  id: number;
  applicationCount: number;
  name: string;
  oneLineIntroduction: string;
  detailedIntroduction: string;
  profileImageUrl: string;
  workedPeriod: number;
  email: string;
  mentoringPriceWon: number;
  careers: {
    id: number;
    orderIndex: number;
    careerTitle: string;
    careerExplanation: string;
    careerStartedAt: string;
    careerEndedAt: string;
  }[];
  tags: string[];
}
