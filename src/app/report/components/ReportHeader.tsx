'use client';
import React, { useState } from 'react';
import Info from '@/assets/icons/info.svg';
import Bubble from '@/assets/icons/long_bubble.svg';
import Close from '@/assets/icons/white_close.svg';
import Button from '@/app/_components/common/Button';
import { useRouter } from 'next/navigation';
import { useEvaluationStore } from '@/store/report.store';
import EvaluateModal from './EvaluateModal';

const ReportHeader = () => {
  const router = useRouter();
  const totalScore = useEvaluationStore((s) => s.totalScore);
  const canUseExpert = totalScore >= 70;
  const [dismissed, setDismissed] = useState(false);
  const [isModal, setIsModal] = useState(false);

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="ds-title font-semibold text-gray-900">
          사업계획서 AI 리포트
        </div>
        <div className="cursor-pointer" onClick={() => setIsModal(true)}>
          <Info />
        </div>
      </div>

      <div className="group relative">
        <Button
          text="전문가 연결"
          size="L"
          disabled={!canUseExpert}
          className="rounded-[8px] px-8"
          onClick={() => {
            if (!canUseExpert) return;
            router.push('/expert');
          }}
        />
        <div
          className={`absolute top-13 -left-[14px] -translate-x-1/2 ${
            !dismissed
              ? 'pointer-events-none hidden group-hover:block'
              : 'hidden'
          }`}
        >
          <div className="relative select-none">
            <Bubble />

            <div className="absolute inset-0 z-10">
              <p className="ds-subtext absolute top-6 right-9 left-4 font-medium whitespace-pre-line text-white">
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
                className="pointer-events-auto absolute top-6 right-3 h-5 w-5"
              >
                <Close />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModal && <EvaluateModal onClose={() => setIsModal(false)} />}
    </div>
  );
};

export default ReportHeader;
