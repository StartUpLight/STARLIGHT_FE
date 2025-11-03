'use client';
import React, { useState } from 'react';

import Button from '@/app/_components/common/Button';
import EvaluationCard from './EvaluationCard';
import Bubble from '@/assets/icons/long_bubble.svg';
import Close from '@/assets/icons/white_close.svg';
import { useEvaluationStore } from '@/store/report.store';

const OPTIONS = ['강점', '약점'] as const;
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
  {
    index: 3,
    title: '강한 문제 인식',
    description:
      '현장에서 소비자들의 니즈를 직접 탐색하고, 문제 인식을 명확히 파악하였습니다.',
  },
];

const TotalEvaluation = () => {
  const totalScore = useEvaluationStore((s) => s.totalScore);
  const canUseExpert = totalScore >= 70;

  const [selected, setSelected] = useState<Option>('강점');
  const [dismissed, setDismissed] = useState(false);

  const cards = selected === '강점' ? strengths : weaknesses;
  const variant = selected === '강점' ? 'strength' : 'weakness';

  return (
    <div className="mt-6 mb-4 flex w-full flex-col items-start gap-4 rounded-[12px] border border-gray-300 p-6">
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
          <div className="group relative">
            <Button
              text="전문가 연결"
              size="L"
              disabled={!canUseExpert}
              className="rounded-[8px] px-8"
              onClick={() => {
                if (!canUseExpert) return;
              }}
            />

            <div
              className={`absolute -top-20 left-1/4 -translate-x-1/2 ${
                !dismissed
                  ? 'pointer-events-none hidden group-hover:block'
                  : 'hidden'
              }`}
            >
              <div className="relative select-none">
                <Bubble />

                <div className="absolute inset-0 z-10">
                  <p className="ds-subtext absolute top-3 right-7 left-3 font-medium whitespace-pre-line text-white">
                    {canUseExpert
                      ? '전문가 연결을 통해 전문가에게 피드백을 \n요청할 수 있어요!'
                      : '전문가 연결은 점수가 70점 이상이거나 \n스페셜 회원권 보유 시 이용할 수 있어요!'}
                  </p>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDismissed(true);
                    }}
                    className="pointer-events-auto absolute top-3 right-3 h-5 w-5"
                  >
                    <Close />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-4">
        {cards.map((item) => (
          <EvaluationCard key={item.index} {...item} type={variant} />
        ))}
      </div>
    </div>
  );
};

export default TotalEvaluation;
