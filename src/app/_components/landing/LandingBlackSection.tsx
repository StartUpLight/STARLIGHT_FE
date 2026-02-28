import Image from 'next/image';
import React from 'react';

const LandingBlackSection = () => {
  return (
    <div className="w-full bg-black">
      {/* 항목별 체크리스트 */}
      <div className="flex flex-col items-center justify-center px-5 pt-20 pb-24 md:px-10 md:pt-20 md:pb-32 lg:px-0 lg:pt-[120px] lg:pb-[240px]">
        <div className="ds-subtitle gradation inline-block font-semibold md:ds-title lg:ds-heading">
          항목별 체크리스트{' '}
        </div>
        <div className="mt-4 text-center text-[24px] leading-[150%] font-semibold tracking-[-0.4px] text-white md:mt-3 md:text-[28px] md:font-bold md:tracking-[-0.56px] lg:text-[42px] lg:tracking-[-0.84px]">
          심사위원<span className="hidden md:inline">의</span> 관점에서 구성된 <br className="md:hidden" /> 항목별 체크리스트
        </div>

        <div className="ds-text mt-4 font-medium text-white md:ds-text md:mt-3 lg:ds-title">
          정량·정성 평가 요소를 기반으로 한{' '}
          <span className="hidden md:inline">실전형 진단 </span>가이드
        </div>

        <Image
          src="/images/landing/landing_checklist_4.png"
          alt="홈화면 이미지"
          width={912}
          height={593}
          className="mt-8 h-auto w-full max-w-[912px] md:mt-10 lg:mt-[60px]"
          priority
          unoptimized={true}
        />
      </div>

      {/* 맞춤형 피드백 */}
      <div className="flex flex-col items-center px-5 pb-24 md:items-start md:px-10 md:pb-40 lg:px-[132px] lg:pb-60">
        <div className="ds-subtitle gradation inline-block font-semibold md:ds-title lg:ds-heading">
          맞춤형 피드백{' '}
        </div>

        <div className="mt-4 text-center text-[24px] leading-[150%] font-semibold tracking-[-0.4px] text-white md:mt-3 md:text-[28px] md:font-bold md:tracking-[-0.56px] lg:text-left lg:text-[42px] lg:tracking-[-0.84px]">
          내 사업계획서에 <br className="md:hidden" /> 딱 맞춘 피드백 제공
        </div>

        <div className="ds-text mt-4 text-center font-medium text-white md:ds-text md:mt-3 lg:ds-title">
          AI 진단 기반으로 내 <span className="hidden md:inline">사업계획서의</span> 강·약점을 정확하게 분석
        </div>

        <Image
          src="/images/landing/landing_feedback.png"
          alt="피드백 이미지"
          width={1124}
          height={651}
          className="mt-8 h-auto w-full md:mt-10 lg:mt-[60px]"
          priority
          quality={100}
          unoptimized={true}
        />
      </div>

      {/* 전문가 연결 */}
      <div className="flex flex-col items-center justify-center px-5 pb-[60.1px] md:px-10 md:pb-20 lg:px-0 lg:pb-[120px]">
        <div className="ds-subtitle gradation inline-block font-semibold md:ds-title lg:ds-heading">
          전문가 연결{' '}
        </div>
        <div className="mt-4 text-center text-[24px] leading-[150%] font-semibold tracking-[-0.4px] text-white md:mt-3 md:text-[28px] md:font-bold md:tracking-[-0.56px] lg:text-[42px] lg:tracking-[-0.84px]">
          현 심사위원들의 시선을 반영해 <br className="md:hidden" /> 실전에서 통하는 리포트 완성
        </div>

        <div className="ds-text mt-4 text-center font-medium text-white md:hidden">
          전문가 피드백을 통한 개선 방향 제시
        </div>
        <div className="mt-3 hidden text-center font-medium text-white md:ds-text md:block lg:ds-title">
          검증된 전문가에게 직접 피드백을 받아 개선 방향을 명확히 제시
        </div>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-[7.3px] md:mt-10 md:gap-5 lg:mt-[60px] lg:gap-6">
          <Image
            src="/images/landing/landing_expert1.png"
            alt="랜딩 전문가 이미지"
            width={1176}
            height={200}
            className="h-auto w-full max-w-[1176px] object-contain"
            style={{ height: 'auto' }}
            priority
            unoptimized={true}
          />
          <Image
            src="/images/landing/landing_expert2.png"
            alt="랜딩 전문가 이미지"
            width={1176}
            height={200}
            className="h-auto w-full max-w-[1176px]"
            style={{ height: 'auto' }}
            priority
            unoptimized={true}
          />
          <Image
            src="/images/landing/landing_expert3.png"
            alt="랜딩 전문가 이미지"
            width={1176}
            height={200}
            className="h-auto w-full max-w-[1176px]"
            style={{ height: 'auto' }}
            priority
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingBlackSection;
