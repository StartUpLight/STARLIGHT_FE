import {
  OrderConfirmRequestPayload,
  OrderConfirmResponseDto,
  OrderPrepareRequestPayload,
  OrderPrepareResponseDto,
} from '@/types/payment/payment.type';
import api from './api';

interface ApiResponse<T> {
  result: 'SUCCESS' | 'FAIL';
  data: T;
  error: {
    code: string;
    message: string;
  } | null;
}

export async function postTossPrepare(
  payload: OrderPrepareRequestPayload
): Promise<OrderPrepareResponseDto> {
  const res = await api.post<ApiResponse<OrderPrepareResponseDto>>(
    '/v1/orders/request',
    payload
  );

  return res.data.data;
}

export async function postTossConfirm(
  payload: OrderConfirmRequestPayload
): Promise<OrderConfirmResponseDto> {
  const res = await api.post<ApiResponse<OrderConfirmResponseDto>>(
    '/v1/orders/confirm',
    payload
  );

  return res.data.data;
}
