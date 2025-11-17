import React from 'react';
import PricingCard from './components/PricingCard';
import ExampleReport from './components/ExampleReport';
import ExampleExpert from './components/ExampleExpert';

const page = () => {
  return (
    <div className="flex w-full flex-col items-start justify-center px-[132px] pt-14 pb-[169px]">
      <div className="text-[36px] leading-1.5 font-bold text-gray-900">
        스타라이트 <span className="gradation2">3가지</span> 요금제
      </div>

      <PricingCard />
      <ExampleReport />
      <ExampleExpert />
    </div>
  );
};

export default page;
