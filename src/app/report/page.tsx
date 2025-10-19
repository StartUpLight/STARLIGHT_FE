import React from 'react';
import EvaluationScoreBoard from './components/EvaluationScoreBoard';
import ChartCard from './components/ChartCard';

const page = () => {
  return (
    <div className="mt-[30px] flex flex-col px-8">
      <div className="ds-title font-semibold text-gray-900">
        사업계획서 AI 리포트
      </div>

      <div className="mt-6 flex w-full flex-row gap-6">
        <EvaluationScoreBoard />
        <ChartCard />
      </div>
    </div>
  );
};

export default page;
