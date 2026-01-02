import Image from 'next/image';
import React from 'react';

const LandingChecklist = () => {
  return (
    <div className="h-[897px] bg-white px-[132px] py-[120px]">
      <div className="ds-heading gradation inline-block font-semibold">
        항목별 체크리스트{' '}
      </div>
      <div className="mt-3 text-[42px] leading-[150%] font-bold tracking-[-0.84px] text-black">
        스타라이트는 이런 분들께 추천드려요.
      </div>

      <div className="mt-[60px] flex w-full flex-row items-start justify-center gap-9">
        <Image
          src="/images/landing/landing_checklist_1.png"
          alt="랜딩 체크리스트1"
          width={368}
          height={480}
          className="h-[480px] w-[368px]"
          priority
          unoptimized={true}
        />

        <Image
          src="/images/landing/landing_checklist_2.png"
          alt="랜딩 체크리스트2"
          width={368}
          height={480}
          className="h-[480px] w-[368px]"
          priority
          unoptimized={true}
        />

        <Image
          src="/images/landing/landing_checklist_3.png"
          alt="랜딩 체크리스트3"
          width={368}
          height={480}
          className="h-[480px] w-[368px]"
          priority
          unoptimized={true}
        />
      </div>
    </div>
  );
};

export default LandingChecklist;
