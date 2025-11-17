import Button from '@/app/_components/common/Button';
import React from 'react';
import Check from '@/assets/icons/puple_check.svg';

const PricingCard = () => {
  return (
    <div className="mt-12 flex w-full flex-row gap-6">
      <div className="flex w-[376px] flex-col items-start gap-6 rounded-[12px] border border-gray-300 bg-white px-6 pt-6 pb-8">
        <div className="flex flex-col items-start text-gray-900">
          <div className="ds-heading font-semibold">Lite</div>
          <span className="ds-subtext mt-1 font-medium whitespace-nowrap">
            지금 당장 제출 직전, 한 번만 빠르게 퀄리티 올리고 싶은 분
          </span>

          <div className="ds-title mt-4 font-semibold">
            49,000원
            <span className="ds-subtext font-medium text-gray-500"> / 1회</span>
          </div>
        </div>

        <Button
          text="가입하기"
          size="L"
          color="primary"
          className="ds-text h-11 w-full rounded-[8px] px-8 py-[10px]"
        />

        <div className="flex w-full flex-col items-start gap-2">
          <div className="text-primary-500 ds-subtext font-semibold">
            Lite의 모든 기능
          </div>
          <div className="flex flex-row items-center gap-2">
            <Check />
            <div className="ds-subtext font-medium text-gray-800">
              {' '}
              전문가 비대면 멘토링 1회
            </div>
          </div>

          <div className="ds-caption flex w-full flex-col gap-1 px-6 font-medium text-gray-600">
            <li> 전문가 비대면 1:1 멘토링 1회</li>
            <li> 사업계획서 PDF/텍스트 기반 심층 검토</li>
            <li> 강·약점 구체 코멘트</li>
            <li> AI 리포트 무제한 포함</li>
          </div>
        </div>
      </div>

      <div className="flex w-[376px] flex-col items-start gap-6 rounded-[12px] border border-gray-300 bg-white px-6 pt-6 pb-8">
        <div className="flex flex-col items-start text-gray-900">
          <div className="ds-heading font-semibold">Standard</div>
          <span className="ds-subtext mt-1 font-medium whitespace-nowrap">
            여러 전문가 피드백으로 제출용 완성도를 높이고 싶은 분{' '}
          </span>

          <div className="ds-title mt-4 font-semibold">
            99,000원
            <span className="ds-subtext font-medium text-gray-500"> / 2회</span>
          </div>
        </div>

        <Button
          text="가입하기"
          size="L"
          color="primary"
          className="ds-text h-11 w-full rounded-[8px] px-8 py-[10px]"
        />

        <div className="flex w-full flex-col items-start gap-2">
          <div className="text-primary-500 ds-subtext font-semibold">
            Standard의 모든 기능
          </div>
          <div className="flex flex-row items-center gap-2">
            <Check />
            <div className="ds-subtext font-medium text-gray-800">
              {' '}
              전문가 비대면 멘토링 2회
            </div>
          </div>

          <div className="ds-caption flex w-full flex-col gap-1 px-6 font-medium text-gray-600">
            <li> 전문가 비대면 1:1 멘토링 2회</li>
            <li> 사업계획서 PDF/텍스트 기반 심층 검토</li>
            <li> 강·약점 구체 코멘트</li>
            <li> AI 리포트 무제한 포함</li>
          </div>
        </div>
      </div>

      <div className="flex w-[376px] flex-col items-start gap-6 rounded-[12px] border border-gray-300 bg-[linear-gradient(180deg,#EAE5FF_14.61%,#FFF_100%)] px-6 pt-6 pb-8">
        <div className="flex w-full flex-col items-start text-gray-900">
          <div className="ds-heading font-semibold">Special</div>
          <span className="ds-subtext mt-1 font-medium whitespace-nowrap">
            AI 리포트 70점 미만이라 전문가의 집중 보완이 필요한 분
          </span>

          <div className="ds-title mt-4 font-semibold">
            4,900원
            <span className="ds-subtext font-medium text-gray-500"> / 1회</span>
          </div>
        </div>

        <Button
          text="가입하기"
          size="L"
          color="primary"
          className="ds-text h-11 w-full rounded-[8px] px-8 py-[10px]"
        />

        <div className="flex w-full flex-col items-start gap-2">
          <div className="text-primary-500 ds-subtext font-semibold">
            Special의 모든 기능
          </div>
          <div className="flex flex-row items-center gap-2">
            <Check />
            <div className="ds-subtext font-medium text-gray-800">
              전문가 비대면 멘토링 프리패스권 1회
            </div>
          </div>

          <div className="ds-caption flex w-full flex-col gap-1 px-6 font-medium text-gray-600">
            <li> AI 리포트 무제한 포함</li>
            <li> AI 리포트 총점(70점 기준 충족 여부) 확인 가능</li>
            <li> 항목별 강·약점 및 구체적 개선 코멘트 제공</li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
