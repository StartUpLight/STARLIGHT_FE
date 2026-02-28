'use client';
import Check from '@/assets/icons/big_check.svg';
import BCheck from '@/assets/icons/black_check.svg';
import RightIcon from '@/assets/icons/white_right.svg';
import ArrowWhiteSmall from '@/assets/icons/arrow_white_small.svg';
import Polygon from '@/assets/icons/polygon.svg';
import PolygonSmall from '@/assets/icons/polygon_small.svg';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginModal from '../common/LoginModal';
import { useAuthStore } from '@/store/auth.store';

const LandingPaySection = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div className="flex w-full flex-col items-center justify-center bg-white px-5 py-15 md:px-10 md:py-20 lg:h-[1047px] lg:px-0 lg:py-[120px]">
      <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
        <span className="text-primary-500 ds-subtitle font-semibold md:ds-title lg:ds-heading">
          멘토링 비용{' '}
        </span>

        <span className="text-center text-[24px] font-semibold text-gray-900 md:text-[28px] md:font-bold lg:text-[42px]">
          30만 원짜리 멘토링,
          <br />
          <span className="text-primary-500">80%</span> 비용 절감
        </span>

        <span className="ds-text text-center font-medium text-gray-900 md:hidden">
          시간당 30만원이던 멘토링을 비대면 구조로
          <br />
          전환해 비용을 합리적으로 개선
        </span>
        <span className="hidden text-center font-medium text-gray-900 md:ds-text md:inline lg:ds-title">
          시간당 30만원이던 멘토링을 비대면 구조로 전환해 비용을 합리적으로
          만들었어요.
        </span>
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 md:mt-10 md:gap-5 lg:mt-[56px] lg:flex-row lg:gap-6">
        <div className="flex w-[300px] flex-col items-center md:w-full lg:w-[468px]">
          <div className="inline-flex w-full items-center justify-center rounded-t-lg bg-gray-300 py-2 md:rounded-t-2xl md:py-3">
            <p className="ds-subtext font-medium text-gray-700 md:text-[18px] lg:text-[20px]">
              시간당 대면 멘토링
            </p>
          </div>

          <div className="flex w-full flex-col gap-[6px] rounded-b-lg bg-gray-200 px-6 py-6 md:gap-0 md:rounded-b-2xl md:px-10 md:py-8 lg:px-[60px] lg:py-[50px]">
            <p className="mb-[6px] text-[28px] font-semibold text-gray-900 md:mb-0 md:text-[36px] lg:text-[48px]">
              300,000원
              <span className="ml-2 text-[14px] font-medium text-gray-900 md:ml-3 md:text-[20px] lg:text-[24px]">
                / 1회
              </span>
            </p>

            <div className="flex flex-row items-center gap-[2px] md:mt-5 md:gap-[6px]">
              <BCheck />
              <p className="ds-text font-medium text-gray-900 md:text-[18px] lg:text-[22px]">
                전문가 대면 멘토링 1회
              </p>
            </div>

            <div className="ds-subtext flex w-full flex-col pl-[21px] font-medium text-gray-700 md:ds-subtext md:mt-3 md:gap-[6px] lg:ds-subtitle">
              <li>멘토의 사전 문서 검토 부족</li>
              <li>멘토링 시간 대비 핵심 피드백 시간 부족</li>
              <li>높은 비용 대비 얻는 피드백의 낮은 퀄리티</li>
            </div>
          </div>
        </div>

        <div className="rotate-0 md:hidden">
          <PolygonSmall />
        </div>
        <div className="hidden md:block lg:rotate-0">
          <Polygon />
        </div>

        <div className="flex w-[300px] flex-col items-center md:w-full lg:w-[586px]">
          <div className="bg-primary-500 inline-flex w-full items-center justify-center rounded-t-lg py-2 md:rounded-t-2xl md:py-3">
            <p className="ds-subtext font-medium text-white md:ds-text lg:ds-title">
              스타라이트의 비대면 멘토링
            </p>
          </div>

          <div className="flex w-full flex-col gap-[6px] rounded-b-lg bg-gray-900 px-6 py-6 md:gap-0 md:rounded-b-2xl md:px-10 md:py-8 lg:px-[60px] lg:py-[50px]">
            <p className="mb-[6px] text-[28px] font-semibold text-white md:mb-0 md:text-[36px] lg:text-[48px]">
              0원
              <span className="ml-2 text-[14px] font-medium text-white md:ml-3 md:text-[20px] md:text-gray-300 lg:text-[24px]">
                / 1회{' '}
                <span className="line-through">49,000원</span>
              </span>
            </p>

            <div className="flex flex-row items-center gap-[2px] md:mt-5 md:gap-[6px]">
              <Check />
              <p className="ds-text font-medium text-white md:text-[18px] lg:text-[22px]">
                전문가 대면 멘토링 1회
              </p>
            </div>

            <div className="ds-subtext flex w-full flex-col pl-[21px] font-medium text-gray-300 md:ds-subtext md:mt-3 md:gap-[6px] lg:ds-subtitle">
              <li>사업계획서 PDF/텍스트 기반 심층 검토</li>
              <li>강·약점 구체 코멘트</li>
              <li>AI 리포트 무제한 포함</li>
            </div>
          </div>
        </div>
      </div>

      <button
        className="bg-primary-500 hover:bg-primary-700 mt-[30px] flex h-[44.4px] w-full cursor-pointer items-center justify-center gap-[2px] rounded px-6 md:mt-10 md:gap-1 md:h-[56px] md:rounded-lg lg:mt-12 lg:h-[64px] lg:w-[516px] lg:px-8"
        onClick={() => {
          if (isAuthenticated) {
            router.push('/business');
          } else {
            setIsLoginModalOpen(true);
          }
        }}
      >
        <p className="ds-subtext font-semibold text-white md:ds-text lg:ds-title">
          0원으로 시작하기
        </p>
        <ArrowWhiteSmall className="md:hidden" />
        <RightIcon className="hidden md:block" />
      </button>

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <div className="mt-[30px] flex flex-col px-2 md:mt-10 lg:mt-12 lg:px-0">
        <p className="ds-caption text-center font-normal text-gray-600 md:ds-subtext lg:ds-text">
          *전문가 대면 멘토링 평균 약 30만 원 수준에서 구조 개선을 통해 최대 약
          4.9만 원대까지 절감했습니다.
        </p>
        <p className="ds-caption text-center font-normal text-gray-600 md:ds-subtext lg:ds-text">
          *전문가 대면 멘토링 평균 비용은 1시간 기준 일반적인 시장 시세를
          참고하였습니다.
        </p>
      </div>
    </div>
  );
};

export default LandingPaySection;
