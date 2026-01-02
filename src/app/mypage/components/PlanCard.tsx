import React from 'react';
import { useRouter } from 'next/navigation';
import DoneIcon from '@/assets/icons/done.svg';
import DoiningIcon from '@/assets/icons/doing.svg';
import TodoIcon from '@/assets/icons/todo.svg';
import ArrowRightIcon from '@/assets/icons/arrow_right.svg';
import { formatDate } from '@/util/formatDate';
import { PlanCardProps, Stage } from '@/types/mypage/my.props';
import { useBusinessStore } from '@/store/business.store';
import { useState } from 'react';
import PdfIcon from '@/assets/icons/my_pdf.svg';
import UserExpertModal from './UserExpertModal';

const defaultStages: Stage[] = [
  { key: 'start', label: '시작' },
  { key: 'written', label: '작성완료' },
  { key: 'ai', label: 'AI채점' },
  { key: 'expert', label: '전문가 연결' },
  { key: 'done', label: '완료' },
];

export default function PlanCard({
  title,
  stages = defaultStages,
  currentStageIndex,
  lastSavedAt,
  businessPlanId,
  pdfUrl,
}: PlanCardProps) {
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();
  const aiStageIndex = stages.findIndex((stage) => stage.key === 'ai');
  const expertStageIndex = stages.findIndex((stage) => stage.key === 'expert');
  const isAiReportEnabled =
    aiStageIndex >= 0 && currentStageIndex >= aiStageIndex;
  const isExpertReportEnabled =
    expertStageIndex >= 0 && currentStageIndex >= expertStageIndex;
  const setPlanId = useBusinessStore((s) => s.setPlanId);

  const handleTitleClick = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      return;
    }
    router.push(`/business?planId=${businessPlanId}`);
  };
  const handleAiReportClick = () => {
    setPlanId(businessPlanId);
    router.push(`/report`);
  };
  const handleNewExpertClick = () => {
    setPlanId(businessPlanId);
    router.push(`/expert`);
  };

  const handleExpertReportModalOpen = () => {
    setPlanId(businessPlanId);
    setIsModal(true);
  };

  return (
    <div className="w-full space-y-6 rounded-xl bg-white px-6 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handleTitleClick}
          className="ds-text hover:text-primary-500 flex cursor-pointer items-center gap-1 font-medium text-gray-900"
        >
          {pdfUrl && <PdfIcon />}
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
          onClick={handleAiReportClick}
          disabled={!isAiReportEnabled}
          className={`ds-subtext mr-auto flex items-center gap-4 px-3 py-2 font-semibold ${isAiReportEnabled
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
            className={`ds-subtext flex items-center gap-4 px-3 py-2 font-semibold ${isExpertReportEnabled
              ? 'cursor-pointer rounded-sm text-gray-900 hover:bg-gray-100'
              : 'cursor-not-allowed text-gray-400'
              }`}
            onClick={handleExpertReportModalOpen}
          >
            전문가 리포트 보러가기
            <ArrowRightIcon />
          </button>
          <button
            disabled={!isExpertReportEnabled}
            onClick={handleNewExpertClick}
            type="button"
            className={`ds-caption flex items-center justify-center rounded-lg px-3 py-2 font-medium whitespace-nowrap transition ${isExpertReportEnabled
              ? 'cursor-pointer border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200'
              : 'cursor-not-allowed border border-gray-200 bg-gray-200 text-gray-500 opacity-50'
              }`}
          >
            새로운 전문가 연결
          </button>
        </div>
      </div>
      {isModal && (
        <UserExpertModal
          onClose={() => setIsModal(false)}
          fileName={title || '이름 없는 사업계획서'}
        />
      )}
    </div>
  );
}
