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
  pdfUrl: string;
}

export interface BusinessPlansPage {
  content: BusinessPlanItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface GetMyBusinessPlansResponse {
  result: 'SUCCESS';
  data: BusinessPlansPage;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface GetOrderProps {
  productName: string;
  paymentMethod: string;
  price: number;
  paidAt: number;
  receiptUrl: string;
}

export interface GetOrderResponse {
  result: string;
  data: GetOrderProps[];
  error: {
    code: string;
    message: string;
  };
}
