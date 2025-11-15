import React from 'react';
import DoneIcon from '@/assets/icons/done.svg';
import DoiningIcon from '@/assets/icons/doing.svg';
import TodoIcon from '@/assets/icons/todo.svg';

type Stage = {
    key: string;
    label: string;
};

interface PlanCardProps {
    title: string;
    stages?: Stage[];
    currentStageIndex: number; // 0-based
    lastSavedAt?: string;
    aiReportTitle?: string;
    expertReportTitle?: string;
}

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
    aiReportTitle = '',
    expertReportTitle = '',
}: PlanCardProps) {
    const progressPercent =
        stages.length > 1
            ? (Math.min(currentStageIndex, stages.length - 1) / (stages.length - 1)) * 100
            : 0;

    return (
        <div className="w-full rounded-[12px] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="ds-text font-medium text-gray-900 hover:text-primary-500 cursor-pointer">{title}</div>
                {lastSavedAt && (
                    <div className="ds-caption font-medium text-gray-500 ">최종 저장 날짜: {lastSavedAt}</div>
                )}
            </div>
            <div className="px-6 py-4 bg-gray-80 rounded-[12px] space-y-4">
                <p className="ds-subtext font-medium text-gray-900">현황</p>
                <div className="relative w-full">
                    <div className="mx-3">
                        <div className="h-[4px] w-full bg-gray-300 rounded-full overflow-hidden">
                            <div
                                className="h-[4px] bg-primary-500 rounded-full"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                    {/* 마커(아이콘) */}
                    <div className="relative z-[1] flex items-center justify-between -mt-[12px]">
                        {stages.map((stage, idx) => {
                            const done = idx < currentStageIndex;
                            const doing = idx === currentStageIndex;
                            return (
                                <div key={stage.key} className="flex flex-col items-center gap-2">
                                    {done ? <DoneIcon />
                                        : doing ? <DoiningIcon />
                                            : <TodoIcon />}
                                    <span className={`ds-caption font-semibold ${done || doing ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {stage.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center w-full bg-gray-80 rounded-[8px] px-6 py-3 justify-between">
                    <div className="flex items-center gap-4">
                        <span className="ds-subtext font-semibold text-gray-900">AI 리포트</span>
                        <button type="button" className="cursor-pointer ds-caption font-medium text-gray-600 underline underline-offset-2">
                            {aiReportTitle}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="ds-caption text-gray-500 font-medium">남은 채점 수: 5</span>
                        <button
                            type="button"
                            className="h-[28px] cursor-pointer whitespace-nowrap flex items-center justify-center rounded-[4px] bg-primary-500 text-white hover:bg-primary-600 transition ds-caption font-medium p-2"
                        >
                            재채점하기
                        </button>
                    </div>
                </div>
                <div className="flex items-center w-full bg-gray-80 rounded-[8px] px-6 py-4 gap-4">
                    <span className="ds-subtext font-semibold text-gray-900">전문가 리포트</span>
                    <button type="button" className="flex-1 cursor-pointer ds-caption font-medium text-gray-600 underline underline-offset-2 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                        {expertReportTitle}
                    </button>
                </div>
            </div>
        </div >
    );
}


