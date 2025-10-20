import React from 'react';
import ExpertCard from './components/ExpertCard';

const page = () => {
  return (
    <div className="mt-[30px] flex flex-col items-start px-[132px]">
      <div className="ds-title font-semibold text-gray-900">전문가 리스트</div>

      <ExpertCard />
    </div>
  );
};

export default page;
