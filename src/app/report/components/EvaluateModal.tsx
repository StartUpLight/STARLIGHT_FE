'use client';
import React from 'react';
import CloseIcon from '@/assets/icons/close.svg';

interface EvaluateModalProps {
  onClose?: () => void;
}

const EvaluateModal = ({ onClose }: EvaluateModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="flex w-[496px] flex-col items-center gap-6 rounded-[12px] bg-white p-6">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="ds-title font-semibold text-gray-900">
            내 사업계획서는 어떻게 평가될까요?
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="bg-gray-80 flex w-full flex-col items-start justify-center gap-5 rounded-[12px] border border-dashed border-gray-300 p-6">
          <div className="ds-caption font-medium text-black">
            스타라이트의 AI 사업계획서 평가는 <br />
            문제 인식(20점) · 성장전략(30점) · 실현가능성(30점) · 팀역량(20점)
            총 4개 항목, 100점 만점 구조로 이루어져 있습니다. <br />
            <br />이 기준은 임의로 정한 것이 아니라, <br />
            <span className="ds-caption font-bold text-black">
              학생유망팀 300+, 국방창업경진대회, 대학창업경진대회,
              예비창업패키지
            </span>{' '}
            등 <br />
            다양한 공공 창업지원사업의 실제 평가 항목과 배점을 기반으로
            설계되었습니다.
          </div>

          <div className="flex flex-col gap-1">
            {' '}
            <div className="ds-subtext font-bold text-black">
              문제정의 (20점)
            </div>
            <div className="ds-caption font-medium text-black">
              사업이 해결하려는 핵심 문제를 얼마나 정확히 파악하고 설명했는지
              평가합니다. <br /> 명확한 문제 정의는 솔루션·BM의 기반이 되기
              때문에 30점이 부여됩니다.
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {' '}
            <div className="ds-subtext font-bold text-black">
              성장전략 (30점)
            </div>
            <div className="ds-caption font-medium text-black">
              사업이 시장에서 어떻게 성장·확장할 수 있는지를 판단합니다. <br />
              시장 분석, 타깃 설정, 수익 모델의 타당성이 가능성과 직결되어
              30점을 차지합니다.
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {' '}
            <div className="ds-subtext font-bold text-black">
              실현가능성 (30점)
            </div>
            <div className="ds-caption font-medium text-black">
              아이디어가 실제로 구현 가능한 구조와 계획을 갖추었는지 평가합니다.{' '}
              <br /> 개발 일정·예산·실행 전략의 현실성이 중요하기 때문에 20점이
              반영됩니다.
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {' '}
            <div className="ds-subtext font-bold text-black">
              팀 역량 (20점)
            </div>
            <div className="ds-caption font-medium text-black">
              팀의 전문성·경험·역할 분담이 사업 목표 달성에 적합한지 확인합니다.{' '}
              <br />
              결국 “이 팀이 실행할 수 있는가?”가 핵심이므로 20점이 부여됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluateModal;
