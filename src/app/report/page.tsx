import React from 'react';
import EvaluationScoreBoard from './components/EvaluationScoreBoard';
import ChartCard from './components/ChartCard';
import TotalEvaluation from './components/TotalEvaluation';
import ReportHeader from './components/ReportHeader';

const page = () => {
  return (
    <div className="mt-[30px] flex w-full flex-col bg-white px-8">
      <ReportHeader />

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
