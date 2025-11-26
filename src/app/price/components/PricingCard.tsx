'use client';

import Script from 'next/script';
import PricingItem from './PricingItem';
import usePayment from '@/hooks/queries/usePayment';
import {
  TossPaymentMethod,
  UsageProductCode,
} from '@/types/payment/payment.type';

type PricingDataItem = {
  title: string;
  description: string;
  price: string;
  cycle: string;
  highlight: string;
  features: string[];
  background?: string;
  productCode?: UsageProductCode;
};

const DEFAULT_METHOD: TossPaymentMethod = 'CARD';

const pricingData: PricingDataItem[] = [
  {
    title: 'Lite',
    description: '지금 당장 제출 직전, 한 번만 빠르게 퀄리티 올리고 싶은 분',
    price: '49,000원',
    cycle: '1회',
    highlight: 'Lite의 모든 기능',
    features: [
      '전문가 비대면 멘토링 1회',
      '전문가 비대면 1:1 멘토링 1회',
      '사업계획서 PDF/텍스트 기반 심층 검토',
      '강·약점 구체 코멘트',
      'AI 리포트 무제한 포함',
    ],
    productCode: 'AI_REPORT_1',
  },
  {
    title: 'Standard',
    description: '여러 전문가 피드백으로 제출용 완성도를 높이고 싶은 분',
    price: '89,000원',
    cycle: '2회',
    highlight: 'Standard의 모든 기능',
    features: [
      '전문가 비대면 멘토링 2회',
      '전문가 비대면 1:1 멘토링 2회',
      '사업계획서 PDF/텍스트 기반 심층 검토',
      '강·약점 구체 코멘트',
      'AI 리포트 무제한 포함',
    ],
    productCode: 'AI_REPORT_2',
  },
  {
    title: 'Special',
    description: 'AI 리포트 70점 미만이라 전문가의 집중 보완이 필요한 분',
    price: '4,900원',
    cycle: '1회',
    highlight: 'Special의 모든 기능',
    background: 'bg-[linear-gradient(180deg,#EAE5FF_14.61%,#FFF_100%)]',
    features: [
      '전문가 비대면 멘토링 프리패스권 1회',
      'AI 리포트 무제한 포함',
      'AI 리포트 총점(70점 기준 충족 여부) 확인 가능',
      '항목별 강·약점 및 구체적 개선 코멘트 제공',
    ],
  },
];

const PricingCard = () => {
  const { startPayment, isProcessing } = usePayment({
    successUrl: '/price/complete',
    failUrl: '/price/complete',
  });

  const handleClickProduct = async (productCode: UsageProductCode) => {
    try {
      await startPayment({
        productCode,
        method: DEFAULT_METHOD,
      });
    } catch (e) {
      console.error('결제 시작 에러:', e);
    }
  };

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="afterInteractive"
      />

      <div className="mt-12 flex w-full flex-row gap-6">
        {pricingData.map((item) => {
          const { productCode } = item;

          const handleClick = () => {
            if (!productCode) return;
            if (isProcessing) return;

            handleClickProduct(productCode);
          };

          return (
            <PricingItem
              key={item.title}
              {...item}
              onClick={productCode ? handleClick : undefined}
              disabled={isProcessing}
            />
          );
        })}
      </div>
    </>
  );
};
export default PricingCard;
