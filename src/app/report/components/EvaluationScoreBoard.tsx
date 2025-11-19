'use client';
import React, { useEffect, useState } from 'react';
import { useBusinessStore } from '@/store/business.store';
import { useEvaluationStore } from '@/store/report.store';
import { useGetGrade } from '@/hooks/queries/useBusiness';
import {
  AiGradeResponse,
  GradingListScoreProps,
} from '@/types/business/business.type';

interface Category {
  title: string;
  score: number;
  total: number;
}

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
  const businessPlanId = useBusinessStore((s) => s.planId);
  const setTotalScoreToStore = useEvaluationStore((s) => s.setTotalScore);

  const [totalScore, setTotalScore] = useState(0);
  const [categories, setCategories] = useState<Category[]>([
    { title: '문제 정의', score: 0, total: 20 },
    { title: '실현 가능성', score: 0, total: 30 },
    { title: '성장 전략', score: 0, total: 30 },
    { title: '팀 역량', score: 0, total: 20 },
  ]);
  const [selectedId, setSelectedId] = useState(0);
  const selected = categories[selectedId];

  const {
    data: evaluateScore,
    isLoading,
    isError,
  } = useGetGrade((businessPlanId ?? 0) as number);

  useEffect(() => {
    if (!evaluateScore) return;
    const s = evaluateScore.data;

    setTotalScore(s.totalScore ?? 0);
    setTotalScoreToStore(s.totalScore ?? 0);

    setCategories([
      { title: '문제 정의', score: s.problemRecognitionScore ?? 0, total: 20 },
      { title: '실현 가능성', score: s.feasibilityScore ?? 0, total: 30 },
      { title: '성장 전략', score: s.growthStrategyScore ?? 0, total: 30 },
      { title: '팀 역량', score: s.teamCompetenceScore ?? 0, total: 20 },
    ]);
  }, [evaluateScore, setTotalScoreToStore]);

  const sectionTypeMap = {
    '문제 정의': 'PROBLEM_RECOGNITION',
    '실현 가능성': 'FEASIBILITY',
    '성장 전략': 'GROWTH_STRATEGY',
    '팀 역량': 'TEAM_COMPETENCE',
  } as const;

  const selectedType =
    sectionTypeMap[selected.title as keyof typeof sectionTypeMap];

  const checklist: GradingListScoreProps[] =
    (
      evaluateScore?.data?.sectionScores ??
      ([] as AiGradeResponse['data']['sectionScores'])
    ).find((s) => s.sectionType === selectedType)?.gradingListScores ?? [];

  return (
    <div className="flex h-[359px] min-w-[812px] items-start justify-between rounded-[12px] border border-gray-300 bg-white p-6">
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
              isActive={i === selectedId}
              onClick={() => setSelectedId(i)}
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
          {isLoading && (
            <div className="ds-text py-4 text-gray-700">
              체크리스트를 불러오는 중입니다.
            </div>
          )}
          {isError && (
            <div className="ds-text py-4 text-red-600">
              체크리스트를 불러올 수 없습니다.
            </div>
          )}
          {!isLoading && !isError && checklist.length === 0 && (
            <div className="ds-text py-4 text-gray-600">
              체크리스트가 없습니다.
            </div>
          )}
          {!isLoading &&
            !isError &&
            checklist.map((data: GradingListScoreProps, id: number) => (
              <div
                key={id}
                className="flex w-full items-center justify-between gap-3 overflow-hidden py-4"
              >
                <p className="ds-text font-medium overflow-ellipsis text-gray-900">
                  {data.item}
                </p>
                <span className="ds-text font-medium text-gray-700">
                  {data.score}점 / {data.maxScore}점
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationScoreBoard;
