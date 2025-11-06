import Image from 'next/image';
import React from 'react';

const LandingRelation = () => {
  return (
    <div>
      <Image
        src="/images/landing/landing_final.png"
        alt="랜딩 관련기관"
        width={1440}
        height={420}
        className="w-full"
        priority
      />

      <div className="mt-[119px] flex flex-col px-[132px] pb-[235px]">
        <div className="text-[42px] leading-[150%] font-bold tracking-[-0.84px] text-gray-900">
          관련 기관
        </div>

        <Image
          src="/images/landing/landing_relation.png"
          alt="랜딩 관련기관"
          width={1176}
          height={440}
          className="mt-[60px] w-full"
          priority
        />
      </div>
    </div>
  );
};

export default LandingRelation;
