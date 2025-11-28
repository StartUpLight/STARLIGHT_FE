import Image from 'next/image';
import React from 'react';

const LandingBlackSection = () => {
  return (
    <div className="w-full bg-black">
      <div className="flex flex-col items-center justify-center pt-[120px] pb-[240px]">
        <div className="ds-heading gradation inline-block font-semibold">
          항목별 체크리스트{' '}
        </div>
        <div className="mt-3 text-[42px] leading-[150%] font-bold tracking-[-0.84px] text-white">
          심사위원의 관점에서 구성된 항목별 체크리스트
        </div>

        <div className="ds-title mt-3 font-medium text-white">
          정량·정성 평가 요소를 기반으로 한 실전형 진단 가이드
        </div>

        <Image
          src="/images/landing/landing_checklist_4.png"
          alt="홈화면 이미지"
          width={912}
          height={593}
          className="mt-[60px] h-auto w-full max-w-[912px]"
          priority
          unoptimized={true}
        />
      </div>

      <div className="flex flex-col items-start px-[132px] pb-60">
        <div className="ds-heading gradation inline-block font-semibold">
          맞춤형 피드백{' '}
        </div>

        <div className="mt-3 text-[42px] leading-[150%] font-bold tracking-[-0.84px] text-white">
          내 사업계획서에 딱 맞춘 피드백 제공
        </div>

        <div className="ds-title font-medium text-white">
          AI 진단 기반으로 내 사업계획서의 강·약점을 정확하게 분석
        </div>

        <Image
          src="/images/landing/landing_feedback.png"
          alt="피드백 이미지"
          width={1124}
          height={651}
          className="mt-[60px] h-auto w-full"
          priority
          quality={100}
          unoptimized={true}
        />
      </div>

      <div className="flex flex-col items-center justify-center pb-[120px]">
        <div className="ds-heading gradation inline-block font-semibold">
          전문가 연결{' '}
        </div>
        <div className="mt-3 text-[42px] leading-[150%] font-bold tracking-[-0.84px] text-white">
          현 심사위원들의 시선을 반영해 실전에서 통하는 리포트 완성
        </div>

        <div className="ds-title font-medium text-white">
          검증된 전문가에게 직접 피드백을 받아 개선 방향을 명확히 제시
        </div>

        <div className="mt-[60px] flex flex-col items-center justify-center gap-6">
          <Image
            src="/images/landing/landing_expert1.png"
            alt="랜딩 전문가 이미지"
            width={1176}
            height={200}
            className="h-auto max-w-[1176px] object-contain"
            style={{ height: 'auto' }}
            priority
            unoptimized={true}
          />
          <Image
            src="/images/landing/landing_expert2.png"
            alt="랜딩 전문가 이미지"
            width={1176}
            height={200}
            className="h-auto max-w-[1176px]"
            style={{ height: 'auto' }}
            priority
            unoptimized={true}
          />
          <Image
            src="/images/landing/landing_expert3.png"
            alt="랜딩 전문가 이미지"
            width={1176}
            height={200}
            className="h-auto max-w-[1176px]"
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
