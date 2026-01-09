'use client';
import Check from '@/assets/icons/big_check.svg';
import BCheck from '@/assets/icons/black_check.svg';
import RightIcon from '@/assets/icons/white_right.svg';
import Polygon from '@/assets/icons/polygon.svg';
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
    <div className="flex h-[1047px] w-full flex-col items-center justify-center bg-white py-[120px]">
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-primary-500 ds-heading font-semibold">
          멘토링 비용{' '}
        </span>

        <span className="text-[42px] font-bold text-gray-900">
          30만 원짜리 멘토링, <span className="text-primary-500">80%</span> 비용
          절감
        </span>

        <span className="ds-title font-medium text-gray-900">
          시간당 30만원이던 멘토링을 비대면 구조로 전환해 비용을 합리적으로
          만들었어요.
        </span>
      </div>

      <div className="mt-[56px] flex flex-row items-center justify-center gap-6">
        <div className="flex w-[456px] flex-col items-center">
          <div className="inline-flex w-full items-center justify-center rounded-t-2xl bg-gray-300 py-3">
            <p className="text-[20px] font-medium text-gray-700">
              시간당 대면 멘토링
            </p>
          </div>

          <div className="flex w-full flex-col rounded-b-2xl bg-gray-200 px-[60px] py-[50px]">
            <p className="text-[48px] font-semibold text-gray-900">
              300,000원
              <span className="ml-3 text-[24px] font-medium text-gray-900">
                / 1회
              </span>
            </p>

            <div className="mt-5 flex flex-row items-center gap-[6px]">
              <BCheck />
              <p className="text-[22px] font-medium text-gray-900">
                전문가 비대면 멘토링 1회
              </p>
            </div>

            <div className="ds-subtitle mt-3 flex w-full flex-col gap-[6px] px-6 font-medium text-gray-900">
              <li>사업계획서 PDF/텍스트 기반 심층 검토</li>
              <li>강·약점 구체 코멘트</li>
              <li>AI 리포트 무제한 포함</li>
            </div>
          </div>
        </div>
        <Polygon />

        <div className="flex w-[586px] flex-col items-center">
          <div className="bg-primary-500 inline-flex w-full items-center justify-center rounded-t-2xl py-3">
            <p className="ds-title font-medium text-white">
              스타라이트의 비대면 멘토링
            </p>
          </div>

          <div className="flex w-full flex-col rounded-b-2xl bg-gray-900 px-[60px] py-[50px]">
            <p className="text-[48px] font-semibold text-white">
              0원
              <span className="ml-3 text-[24px] font-medium text-gray-300">
                / 1회 <span className="line-through">49,000원</span>
              </span>
            </p>

            <div className="mt-5 flex flex-row items-center gap-[6px]">
              <Check />
              <p className="text-[22px] text-white">전문가 비대면 멘토링 1회</p>
            </div>

            <div className="ds-subtitle mt-3 flex w-full flex-col gap-[6px] px-6 font-medium text-gray-300">
              <li>사업계획서 PDF/텍스트 기반 심층 검토</li>
              <li>강·약점 구체 코멘트</li>
              <li>AI 리포트 무제한 포함</li>
            </div>
          </div>
        </div>
      </div>

      <button
        className="bg-primary-500 hover:bg-primary-700 mt-12 flex h-[64px] w-[516px] cursor-pointer items-center justify-center gap-1 rounded-lg px-8"
        onClick={() => {
          if (isAuthenticated) {
            router.push('/business');
          } else {
            setIsLoginModalOpen(true);
          }
        }}
      >
        <p className="ds-title font-semibold text-white">0원으로 시작하기</p>
        <RightIcon />
      </button>

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <div className="mt-12 flex flex-col">
        <p className="ds-text font-normal text-gray-600">
          *전문가 대면 멘토링 평균 약 30만 원 수준에서 구조 개선을 통해 최대 약
          4.9만 원대까지 절감했습니다.
        </p>
        <p className="ds-text text-center font-normal text-gray-600">
          *전문가 대면 멘토링 평균 비용은 1시간 기준 일반적인 시장 시세를
          참고하였습니다.
        </p>
      </div>
    </div>
  );
};

export default LandingPaySection;
