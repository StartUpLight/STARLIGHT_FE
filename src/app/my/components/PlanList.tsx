"use client";
import React, { useState } from 'react';
import PlanCard from './PlanCard';
import Pagination from './Pagination';

interface PlanItem {
    id: string;
    title: string;
    lastSavedAt: string;
    currentStageIndex: number; // 0-based
    aiReportTitle?: string;
    expertReportTitle?: string;
}

const mockItems: PlanItem[] = [
    { id: '1', title: '스트라이트의 사업계획서', lastSavedAt: '25.10.04 23:50', currentStageIndex: 2, aiReportTitle: '[파일명]_AI 리포트', expertReportTitle: '홍길동 전문가의 [파일명] 사업계획서 전문가 리포트' },
    { id: '2', title: '스트라이트의 사업계획서', lastSavedAt: '25.10.04 23:50', currentStageIndex: 2, aiReportTitle: '[파일명]_AI 리포트', expertReportTitle: '홍길동 전문가의 [파일명] 사업계획서 전문가 리포트' },
    { id: '3', title: '스트라이트의 사업계획서', lastSavedAt: '25.10.04 23:50', currentStageIndex: 2, aiReportTitle: '[파일명]_AI 리포트', expertReportTitle: '홍길동 전문가의 [파일명] 사업계획서 전문가 리포트' },
];

export default function PlanList() {
    const [page, setPage] = useState(1);

    return (
        <div className="p-6 bg-gray-80 rounded-[12px] space-y-6">
            <div className="flex items-center gap-2">
                <h2 className="ds-subtitle font-medium text-black">사업계획서 목록</h2>
                <span className="ds-subtitle text-primary-500 font-medium">{mockItems.length}</span>
            </div>
            {mockItems.map((item) => (
                <PlanCard
                    key={item.id}
                    title={item.title}
                    currentStageIndex={item.currentStageIndex}
                    lastSavedAt={item.lastSavedAt}
                    aiReportTitle={item.aiReportTitle || ''}
                    expertReportTitle={item.expertReportTitle || ''}
                />
            ))}
            <Pagination current={page} total={6} onChange={setPage} />
        </div>
    );
}


