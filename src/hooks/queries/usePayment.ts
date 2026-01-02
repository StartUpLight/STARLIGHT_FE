'use client';

import { useCallback, useState } from 'react';
import { postTossPrepare } from '@/api/payment';
import {
  OrderPrepareResponseDto,
  StartPaymentParams,
  TossPaymentMethod,
  TossPaymentsClient,
  UsageProductCode,
  UsePaymentShOptions,
} from '@/types/payment/payment.type';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? '';

const PRODUCT_NAME_MAP: Record<string, string> = {
  AI_REPORT_1: 'Lite',
  AI_REPORT_2: 'Standard',
};

function generateOrderCode(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `ORD${yyyy}${mm}${dd}-${rand}`;
}

function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}

function getOrderName(productCode: string): string {
  return PRODUCT_NAME_MAP[productCode] ?? 'starlight 크레딧 결제';
}

export function usePayment(options: UsePaymentShOptions) {
  const [isProcessing, setIsProcessing] = useState(false);

  const startPayment = useCallback(
    async ({ productCode, method }: StartPaymentParams) => {
      if (typeof window === 'undefined') {
        throw new Error('브라우저 환경에서만 결제를 실행할 수 있습니다.');
      }

      if (!TOSS_CLIENT_KEY) {
        throw new Error(
          'NEXT_PUBLIC_TOSS_CLIENT_KEY 환경변수가 설정되어 있지 않습니다.'
        );
      }

      if (!window.TossPayments) {
        throw new Error('TossPayments SDK가 로드되지 않았습니다.');
      }

      setIsProcessing(true);

      try {
        const orderCode = generateOrderCode();

        const prepared: OrderPrepareResponseDto = await postTossPrepare({
          orderCode,
          productCode: productCode as UsageProductCode,
        });

        const successUrl = toAbsoluteUrl(options.successUrl);
        const failUrl = toAbsoluteUrl(options.failUrl);

        const toss: TossPaymentsClient = window.TossPayments(TOSS_CLIENT_KEY);
        const payment = toss.payment({ customerKey: 'ANONYMOUS' });

        await payment.requestPayment({
          method: method as TossPaymentMethod,
          amount: {
            currency: 'KRW',
            value: prepared.amount,
          },
          orderId: prepared.orderCode,
          orderName: getOrderName(productCode),
          successUrl,
          failUrl,
        });
      } catch (error) {
        console.error('결제 시작 중 오류:', error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [options.failUrl, options.successUrl]
  );

  return {
    startPayment,
    isProcessing,
  };
}

export default usePayment;
