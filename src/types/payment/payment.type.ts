export type UsageProductCode = 'AI_REPORT_1' | 'AI_REPORT_2';

export type TossPaymentMethod = 'CARD' | 'EASY_PAY';

export interface OrderPrepareRequestPayload {
  orderCode: string;
  productCode: UsageProductCode | string;
}

export interface OrderPrepareResponseDto {
  orderCode: string;
  amount: number;
  status: string;
}

export interface OrderConfirmRequestPayload {
  paymentKey: string;
  orderCode: string;
}

export interface OrderConfirmResponseDto {
  buyerId: number;
  paymentKey: string;
  orderId: string;
  amount: number;
  status: string;
  approvedAt: number | null;
  receiptUrl: string | null;
  method: string;
  provider: string | null;
}

export interface UsePaymentShOptions {
  successUrl: string;
  failUrl: string;
}

export interface StartPaymentParams {
  productCode: UsageProductCode | string;
  method: TossPaymentMethod;
}

export interface TossPaymentAmount {
  currency: string;
  value: number;
}

export interface TossPaymentRequest {
  method: TossPaymentMethod;
  amount: TossPaymentAmount;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail?: string;
  customerName?: string;
}

export interface TossPayment {
  requestPayment(request: TossPaymentRequest): Promise<void>;
}

export interface TossPaymentsClient {
  payment(options: { customerKey: string }): TossPayment;
}

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPaymentsClient;
  }
  const TossPayments: (clientKey: string) => TossPaymentsClient;
}

export {};
