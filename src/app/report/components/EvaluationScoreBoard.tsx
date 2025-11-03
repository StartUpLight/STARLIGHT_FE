'use client';
import { useEvaluationStore } from '@/store/report.store';
import React, { useEffect, useState } from 'react';

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

type ScoreCardProps = {
  category: Category;
  isActive: boolean;
  onClick: () => void;
};

const ScoreCard = ({ category, isActive, onClick }: ScoreCardProps) => {
  const { title, score, total } = category;

  const base =
    'flex h-24 cursor-pointer flex-col items-start justify-between rounded-[8px] border p-3';
  const active = 'bg-primary-500 text-white cursor-pointer';
  const noactive =
    'bg-gray-80 border-gray-200 text-gray-900 hover:bg-primary-50 cursor-pointer';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${isActive ? active : noactive}`}
    >
      <div
        className={`ds-subtext font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}
      >
        {title}
      </div>
      <div
        className={`ds-subtext font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}
      >
        {score}점
        <span
          className={`text-[10px] font-semibold ${isActive ? 'text-primary-200' : 'text-gray-500'}`}
        >
          {' '}
          / {total}점
        </span>
      </div>
    </button>
  );
};

const EvaluationScoreBoard = () => {
  const totalScore = 50;
  const setTotalScore = useEvaluationStore((s) => s.setTotalScore);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = categories[selectedIdx];

  useEffect(() => {
    setTotalScore(totalScore);
  }, [totalScore, setTotalScore]);

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
          {categories.map((c, i) => (
            <ScoreCard
              key={c.title}
              category={c}
              isActive={i === selectedIdx}
              onClick={() => setSelectedIdx(i)}
            />
          ))}
        </div>
      </div>

      <div className="ml-4 flex-1">
        <div className="flex items-baseline gap-[6px]">
          <div className="ds-subtitle font-semibold text-gray-900">
            {selected.title}
          </div>
          <div className="ds-caption font-medium text-gray-700">
            {selected.score}/{selected.total}점
          </div>
        </div>

        <div className="mt-2 divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex w-full items-center justify-between gap-3 overflow-hidden py-4"
            >
              <p className="ds-text font-medium overflow-ellipsis text-gray-900">
                {selected.title} 체크리스트
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
