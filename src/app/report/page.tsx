import React from 'react';
import EvaluationScoreBoard from './components/EvaluationScoreBoard';
import ChartCard from './components/ChartCard';
import TotalEvaluation from './components/TotalEvaluation';

const page = () => {
  return (
    <div className="mt-[30px] flex w-full flex-col px-8">
      <div className="ds-title font-semibold text-gray-900">
        사업계획서 AI 리포트
      </div>

      <div className="mt-6 flex w-full flex-row gap-6">
        <div className="flex-1">
          <EvaluationScoreBoard />
        </div>

        <div className="flex-shrink-0">
          <ChartCard />
        </div>
      </div>

      <TotalEvaluation />
    </div>
  );
};

export default page;
