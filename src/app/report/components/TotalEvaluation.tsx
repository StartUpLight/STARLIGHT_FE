'use client';
import Button from '@/app/_components/common/Button';
import React, { useState } from 'react';
import EvaluationCard from './EvaluationCard';

const OPTIONS = ['강점', '약점'];
type Option = (typeof OPTIONS)[number];

const strengths = [
  {
    index: 1,
    title: '강한 문제 인식',
    description:
      '현장에서 소비자들의 니즈를 직접 탐색하고, 문제 인식을 명확히 파악하였습니다.',
  },
  {
    index: 2,
    title: '강한 문제 인식',
    description:
      '현장에서 소비자들의 니즈를 직접 탐색하고, 문제 인식을 명확히 파악하였습니다.',
  },
  {
    index: 3,
    title: '강한 문제 인식',
    description:
      '현장에서 소비자들의 니즈를 직접 탐색하고, 문제 인식을 명확히 파악하였습니다.',
  },
];

const weaknesses = [
  {
    index: 1,
    title: '강한 문제 인식',
    description:
      '현장에서 소비자들의 니즈를 직접 탐색하고, 문제 인식을 명확히 파악하였습니다.',
  },
  {
    index: 2,
    title: '강한 문제 인식',
    description:
      '현장에서 소비자들의 니즈를 직접 탐색하고, 문제 인식을 명확히 파악하였습니다.',
  },
];

const TotalEvaluation = () => {
  const [selected, setSelected] = useState<Option>('강점');
  const cards = selected === '강점' ? strengths : weaknesses;

  return (
    <div className="mt-6 flex w-full flex-col items-start gap-4 rounded-[12px] border border-gray-300 p-6">
      <div className="ds-subtitle font-semibold text-gray-900">총평</div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center rounded-full bg-gray-100 p-1">
          {OPTIONS.map((label) => {
            const isActive = selected === label;
            return (
              <button
                key={label}
                onClick={() => setSelected(label)}
                className={`ds-text cursor-pointer rounded-full px-5 py-1 font-medium transition-all ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div>
          <Button text="전문가 연결" size="L" className="rounded-[8px] px-8" />
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-4">
        {cards.map((item) => (
          <EvaluationCard key={item.index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default TotalEvaluation;
