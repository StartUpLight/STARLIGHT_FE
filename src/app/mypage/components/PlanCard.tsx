'use client';
import { useRouter } from 'next/navigation';
import DoneIcon from '@/assets/icons/done.svg';
import DoiningIcon from '@/assets/icons/doing.svg';
import TodoIcon from '@/assets/icons/todo.svg';
import ArrowRightIcon from '@/assets/icons/arrow_right.svg';
import { formatDate } from '@/util/formatDate';
import { PlanCardProps, Stage } from '@/types/mypage/my.props';
import { useState } from 'react';
import UserExpertModal from './UserExpertModal';

const defaultStages: Stage[] = [
  { key: 'start', label: '시작' },
  { key: 'written', label: '작성완료' },
  { key: 'ai', label: 'AI채점' },
  { key: 'expert', label: '전문가 연결' },
  { key: 'done', label: '완료' },
];

const PlanCard = ({
  title,
  stages = defaultStages,
  currentStageIndex,
  lastSavedAt,
  businessPlanId,
}: PlanCardProps) => {
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const aiStageIndex = stages.findIndex((stage) => stage.key === 'ai');
  const expertStageIndex = stages.findIndex((stage) => stage.key === 'expert');
  const isAiReportEnabled =
    aiStageIndex >= 0 && currentStageIndex >= aiStageIndex;
  const isExpertReportEnabled =
    expertStageIndex >= 0 && currentStageIndex >= expertStageIndex;

  const handleTitleClick = () => {
    router.push(`/business?planId=${businessPlanId}`);
  };

  return (
    <div className="w-full space-y-6 rounded-xl bg-white px-6 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handleTitleClick}
          className="ds-text hover:text-primary-500 flex cursor-pointer items-center gap-1 font-medium text-gray-900"
        >
          {title || '이름 없는 사업계획서'}
          <ArrowRightIcon />
        </button>
        {lastSavedAt && (
          <div className="ds-caption font-medium text-gray-500">
            최종 저장 날짜: {formatDate(lastSavedAt)}
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="flex items-start gap-2">
          {stages.map((stage, idx) => {
            const done = idx < currentStageIndex;
            const doing = idx === currentStageIndex;
            const lineColor = done
              ? 'bg-gray-600'
              : doing
                ? 'bg-primary-500'
                : 'bg-gray-200';
            return (
              <div key={stage.key} className="flex flex-1 flex-col">
                <div className="flex w-full items-center">
                  <div className={`h-1 flex-1 rounded-full ${lineColor}`} />
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="shrink-0">
                    {done ? (
                      <DoneIcon />
                    ) : doing ? (
                      <DoiningIcon />
                    ) : (
                      <TodoIcon />
                    )}
                  </div>
                  <span
                    className={`ds-caption font-semibold whitespace-nowrap text-gray-900`}
                  >
                    {stage.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center">
        <button
          disabled={!isAiReportEnabled}
          className={`ds-subtext mr-auto flex items-center gap-4 px-3 py-2 font-semibold ${
            isAiReportEnabled
              ? 'cursor-pointer text-gray-900'
              : 'cursor-not-allowed text-gray-400'
          }`}
        >
          AI 리포트 보러가기
          <ArrowRightIcon />
        </button>
        <div className="mx-[33px] h-6 w-px bg-gray-300"></div>
        <div className="flex items-center gap-[167px]">
          <button
            disabled={!isExpertReportEnabled}
            className={`ds-subtext flex items-center gap-4 px-3 py-2 font-semibold ${
              isExpertReportEnabled
                ? 'cursor-pointer rounded-sm text-gray-900 hover:bg-gray-100'
                : 'cursor-not-allowed text-gray-400'
            }`}
            onClick={() => setIsModal(true)}
          >
            전문가 리포트 보러가기
            <ArrowRightIcon />
          </button>
          <button
            type="button"
            className="ds-caption flex h-7 cursor-pointer items-center justify-center rounded-sm border border-gray-300 p-2 font-medium whitespace-nowrap text-gray-900 transition"
          >
            새로운 전문가 연결
          </button>
        </div>
      </div>
      {isModal && <UserExpertModal onClose={() => setIsModal(false)} />}
    </div>
  );
};

export default PlanCard;
