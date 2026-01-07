export interface getExpertResponse {
  result: string;
  id: number;
  name: string;
  oneLineIntroduction: string;
  profileImageUrl: string;
  email: string;
  careers: {
    orderIndex: number;
    careerTitle: string;
  }[];
  categories: string[];
  tags: string[];
  workedPeriod: number;
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

export interface expertReportsResponse {
  saveType: 'FINAL';
  overallComment: string;
  details: {
    commentType: string;
    content: string;
  }[];
}

export interface expertReportProps {
  token: string;
}

export interface getExpertReportsResponse {
  result: string;
  data: getExpertReportsData;
  status: string;
  canEdit: boolean;
  overallComment: string;
  details: {
    commentType: string;
    content: string;
  }[];
  error: {
    code: string;
    message: string;
  };
}

export interface getExpertReportsData {
  expertDetailResponse: {
    id: number;
    name: string;
    profileImageUrl: string;
    workedPeriod: number;
    email: string;
    mentoringPriceWon: number;
    careers: string[];
    tags: string[];
    categories: string[];
  };
}

export interface getUserExpertReportResponse {
  result: string;
  data: getUserExpertReportResponseData[];
  error: null;
}

export interface getUserExpertReportResponseData {
  canEdit: boolean;
  details: {
    commentType: string;
    content: string;
  }[];
  expertDetailResponse: {
    id: number;
    name: string;
    profileImageUrl: string;
    workedPeriod: string;
    email: string;
    mentoringPriceWon: number;
    careers: string[];
    tags: string[];
    categories: string[];
  };
  status: string;
  overallComment: string;
}
