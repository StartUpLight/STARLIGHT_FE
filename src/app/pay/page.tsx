'use client';

import Script from 'next/script';
import Button from '../_components/common/Button';
import OrderDetails from './components/OrderDetails';
import PaymentAmount from './components/PaymentAmount';
import { useExpertStore } from '@/store/expert.store';
import usePayment from '@/hooks/queries/usePayment';
import {
  TossPaymentMethod,
  UsageProductCode,
} from '@/types/payment/payment.type';
import { useBusinessStore } from '@/store/business.store';

const DEFAULT_METHOD: TossPaymentMethod = 'CARD';
const EXPERT_PRODUCT_CODE: UsageProductCode = 'AI_REPORT_1';

const Page = () => {
  const { selectedMentor } = useExpertStore();

  const planId = useBusinessStore((s) => s.planId);
  const expertId = selectedMentor?.id ?? null;

  const { startPayment, isProcessing } = usePayment({
    successUrl:
      planId != null && expertId != null
        ? `/pay/complete?planId=${planId}&expertId=${expertId}`
        : '/pay/complete',
    failUrl: '/price/complete',
  });

  const handlePayClick = async () => {
    if (!selectedMentor) {
      alert('선택된 전문가 정보가 없습니다. 전문가를 먼저 선택해 주세요.');
      return;
    }

    try {
      await startPayment({
        productCode: EXPERT_PRODUCT_CODE,
        method: DEFAULT_METHOD,
      });
    } catch (e) {
      console.error('결제 시작 에러:', e);
      alert('결제를 시작하는 데 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="h-full bg-white">
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="afterInteractive"
      />

      <div className="mx-auto max-w-[944px] min-w-[550px] px-6 py-[30px]">
        <h1 className="ds-title mb-6 font-semibold text-gray-900">결제</h1>

        <OrderDetails mentor={selectedMentor} />
        <PaymentAmount />

        <Button
          text={isProcessing ? '결제 요청 중' : '결제하기'}
          className="h-11 w-full"
          disabled={isProcessing}
          onClick={handlePayClick}
        />
      </div>
    </div>
  );
};

export default Page;
