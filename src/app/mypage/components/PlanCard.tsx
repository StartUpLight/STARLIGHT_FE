import React from 'react';
import { useRouter } from 'next/navigation';
import DoneIcon from '@/assets/icons/done.svg';
import DoiningIcon from '@/assets/icons/doing.svg';
import TodoIcon from '@/assets/icons/todo.svg';
import ArrowRightIcon from '@/assets/icons/arrow_right.svg';
import { formatDate } from '@/util/formatDate';
import { PlanCardProps, Stage } from '@/types/mypage/my.props';

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
}: PlanCardProps) {
    const router = useRouter();
    const aiStageIndex = stages.findIndex(stage => stage.key === 'ai');
    const expertStageIndex = stages.findIndex(stage => stage.key === 'expert');
    const isAiReportEnabled = aiStageIndex >= 0 && currentStageIndex >= aiStageIndex;
    const isExpertReportEnabled = expertStageIndex >= 0 && currentStageIndex >= expertStageIndex;

    const handleTitleClick = () => {
        router.push(`/business?planId=${businessPlanId}`);
    };

    return (
        <div className="w-full rounded-[12px] bg-white px-6 pt-6 pb-4 space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={handleTitleClick}
                    className="ds-text font-medium text-gray-900 hover:text-primary-500 cursor-pointer flex items-center gap-1"
                >
                    {title || '이름 없는 사업계획서'}
                    <ArrowRightIcon />
                </button>
                {lastSavedAt && (
                    <div className="ds-caption font-medium text-gray-500 ">최종 저장 날짜: {formatDate(lastSavedAt)}</div>
                )}
            </div>
            <div className="w-full">
                <div className="flex items-start gap-2">
                    {stages.map((stage, idx) => {
                        const done = idx < currentStageIndex;
                        const doing = idx === currentStageIndex;
                        const lineColor = done ? 'bg-gray-600' : doing ? 'bg-primary-500' : 'bg-gray-200';
                        return (
                            <div key={stage.key} className="flex flex-col flex-1">
                                <div className="flex items-center w-full">
                                    <div className={`flex-1 h-[4px] rounded-full ${lineColor}`} />
                                </div>
                                <div className="flex items-center gap-2 mt-[6px]">
                                    <div className="flex-shrink-0">
                                        {done ? <DoneIcon />
                                            : doing ? <DoiningIcon />
                                                : <TodoIcon />}
                                    </div>
                                    <span className={`ds-caption font-semibold whitespace-nowrap text-gray-900`}>
                                        {stage.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='flex items-center'>
                <button
                    disabled={!isAiReportEnabled}
                    className={`mr-auto ds-subtext font-semibold flex items-center py-2 px-3 gap-4 ${isAiReportEnabled
                        ? 'cursor-pointer text-gray-900'
                        : 'cursor-not-allowed text-gray-400'
                        }`}
                >
                    AI 리포트 보러가기
                    <ArrowRightIcon />
                </button>
                <div className='w-[1px] h-[24px] bg-gray-300 mx-[33px]'></div>
                <div className='flex items-center gap-[167px]'>
                    <button
                        disabled={!isExpertReportEnabled}
                        className={`ds-subtext font-semibold flex items-center py-2 px-3 gap-4 
                            ${isExpertReportEnabled
                                ? 'cursor-pointer text-gray-900 hover:bg-gray-100 rounded-[4px]'
                                : 'cursor-not-allowed text-gray-400'
                            }`}
                    >
                        전문가 리포트 보러가기
                        <ArrowRightIcon />
                    </button>
                    <button
                        type="button"
                        className="h-[28px] border-gray-300 border-[1px] text-gray-900 cursor-pointer whitespace-nowrap flex items-center justify-center rounded-[4px] transition ds-caption font-medium p-2"
                    >
                        새로운 전문가 연결
                    </button>
                </div>
            </div>
        </div >
    );
}


