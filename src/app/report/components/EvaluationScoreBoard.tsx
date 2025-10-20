import React from 'react';

interface Category {
  title: string;
  score: number;
  total: number;
}

const categories: Category[] = [
  { title: '문제 정의', score: 10, total: 30 },
  { title: '실현 가능성', score: 10, total: 30 },
  { title: '성장 전략', score: 10, total: 30 },
  { title: '팀 역량', score: 10, total: 30 },
];

const ScoreCard = ({ title, score, total }: Category) => (
  <div className="active:bg-primary-500 bg-gray-80 hover:bg-primary-50 flex h-24 cursor-pointer flex-col justify-between rounded-[8px] border border-gray-200 p-3 text-gray-900 active:text-white">
    <div className="ds-subtext font-medium">{title}</div>
    <div className="ds-subtext font-medium">
      {score}/{total}
      <span className="text-[10px] font-medium">점</span>
    </div>
  </div>
);

const EvaluationScoreBoard = () => {
  const totalScore = 74;

  return (
    <div className="flex h-[359px] min-w-[812px] items-start justify-between rounded-[12px] border border-gray-300 p-6">
      <div className="flex w-[280px] flex-col">
        <div className="bg-gray-80 flex flex-col rounded-[12px] p-4">
          <div className="ds-subtitle font-semibold text-gray-900">총점</div>
          <div className="text-primary-500 ds-title mt-[6px] text-end font-semibold">
            {totalScore}점
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <ScoreCard key={c.title} {...c} />
          ))}
        </div>
      </div>

      <div className="ml-4 flex-1">
        <div className="flex items-baseline gap-[6px]">
          <div className="ds-subtitle font-semibold text-gray-900">
            문제정의
          </div>
          <div className="ds-caption font-medium text-gray-700">10/20점</div>
        </div>

        <div className="mt-2 divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex w-full items-center justify-between gap-3 overflow-hidden py-4"
            >
              <p className="ds-text font-medium overflow-ellipsis text-gray-900">
                체크리스트입니다. 체크리스트입니다. 체크리스트입니다.
              </p>
              <span className="ds-text font-medium text-gray-700">
                3점 / 4점
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationScoreBoard;
