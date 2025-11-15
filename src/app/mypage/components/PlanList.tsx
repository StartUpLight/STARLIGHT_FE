"use client";
import React, { useState } from 'react';
import PlanCard from './PlanCard';
import Pagination from '../../_components/common/Pagination';
import { useGetMyBusinessPlans } from '@/hooks/queries/useMy';
import { BusinessPlanItem } from '@/types/mypage/mypage.type';

const getStageIndexFromStatus = (planStatus: string): number => {
    switch (planStatus) {
        case 'STARTED':
            return 0;
        case 'WRITTEN_COMPLETED':
            return 1;
        case 'AI_REVIEWED':
            return 2;
        case 'EXPERT_MATCHED':
            return 3;
        case 'FINALIZED':
            return 4;
        default:
            return 0;
    }
};

export default function PlanList() {
    const { data: myBusinessPlans, isLoading } = useGetMyBusinessPlans();
    const [page, setPage] = useState(1);
    const items: BusinessPlanItem[] = myBusinessPlans?.data || [];

    if (isLoading) {
        return (
            <div className="mt-6 w-full p-6 bg-gray-80 rounded-[12px]">
                <div className="ds-text text-gray-500">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="mt-6 w-full p-6 bg-gray-80 rounded-[12px] space-y-6">
            <div className="flex items-center gap-2">
                <h2 className="ds-subtitle font-medium text-black">사업계획서 목록</h2>
                <span className="ds-subtitle text-primary-500 font-medium">{items.length}</span>
            </div>
            {items.map((item) => (
                <PlanCard
                    key={item.businessPlanId}
                    title={item.title || '제목을 입력하세요'}
                    currentStageIndex={getStageIndexFromStatus(item.planStatus)}
                    lastSavedAt={item.lastSavedAt}
                    businessPlanId={item.businessPlanId}
                />
            ))}
            <Pagination current={page} total={6} onChange={setPage} />
        </div>
    );
}


