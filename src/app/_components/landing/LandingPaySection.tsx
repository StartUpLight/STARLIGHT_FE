'use client';
import Check from '@/assets/icons/big_check.svg';
import RightIcon from '@/assets/icons/white_right.svg';
import { useRouter } from 'next/navigation';

const LandingPaySection = () => {
  const router = useRouter();
  return (
    <div className="flex h-[978px] w-full flex-col items-center justify-center gap-[67px] px-[375px] py-[120px]">
      <div className="text-[52px] leading-[150%] font-semibold text-gray-900">
        <span className="relative inline-block">
          <span className="absolute inset-0 flex items-center">
            <span className="bg-primary-500 h-[5px] w-full"></span>
          </span>

          <span className="relative">
            300,000원{' '}
            <span className="text-[32px] font-medium text-gray-700">
              / 시간당 비대면 멘토링
            </span>
          </span>
        </span>
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="bg-primary-500 inline-flex w-full items-center justify-center rounded-t-2xl py-3">
          <p className="ds-title font-medium text-white">Lite 이용권의 기능</p>
        </div>

        <div className="flex w-full flex-col rounded-b-2xl bg-gray-900 px-[60px] py-[50px]">
          <p className="text-[48px] font-semibold text-white">
            49,000원{' '}
            <span className="text-[24px] font-medium text-gray-300">
              / 시간당 비대면 멘토링
            </span>
          </p>

          <div className="mt-5 flex flex-row items-center gap-[6px]">
            <Check />
            <p className="text-[22px] text-white">전문가 비대면 멘토링 1회</p>
          </div>

          <div className="ds-subtitle mt-3 flex w-full flex-col gap-1 px-6 font-medium text-gray-300">
            <li>사업계획서 PDF/텍스트 기반 심층 검토</li>
            <li>강·약점 구체 코멘트</li>
            <li>AI 리포트 무제한 포함</li>
          </div>
        </div>

        <button
          className="bg-primary-500 hover:bg-primary-700 mt-12 flex h-[64px] w-[516px] cursor-pointer items-center justify-center rounded-lg px-8"
          onClick={() => router.push('/pay')}
        >
          <p className="ds-title font-semibold text-white">구매하기</p>
          <RightIcon />
        </button>

        <div className="mt-12 flex flex-col">
          <p className="ds-text font-normal text-gray-600">
            *전문가 대면 멘토링 평균 약 30만 원 수준에서 구조 개선을 통해 최대
            약 4.9만 원대까지 절감했습니다.
          </p>
          <p className="ds-text text-center font-normal text-gray-600">
            *전문가 대면 멘토링 평균 비용은 1시간 기준 일반적인 시장 시세를
            참고하였습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPaySection;
