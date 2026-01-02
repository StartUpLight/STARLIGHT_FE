'use client';
import React, { useMemo, useState } from 'react';
import ExpertTab from './ExpertTab';
import { useGetExpert, useGetFeedBackExpert } from '@/hooks/queries/useExpert';
import { adaptMentor, MentorProps } from '@/types/expert/expert.props';
import MentorCard from './MentorCard';
import { useBusinessStore } from '@/store/business.store';
import { TAB_LABELS, TabLabel } from '@/types/expert/label';

const ExpertCard = () => {
  const tabs = ['전체', ...TAB_LABELS];
  const [activeTab, setActiveTab] = useState('전체');

  const businessPlanId = useBusinessStore((s) => s.planId);
  const id = businessPlanId ?? undefined;

  const { data: experts = [], isLoading: expertsLoading } = useGetExpert();
  const { data: feedback, isLoading: feedbackLoading } = useGetFeedBackExpert(
    id,
    { enabled: id !== undefined }
  );

  const expertsApply = useMemo(
    () => new Set<number>((feedback?.data ?? []).map(Number)),
    [feedback]
  );

  const list = useMemo(() => {
    return experts.map((e) => {
      const mentor = adaptMentor(e);
      const status: MentorProps['status'] = expertsApply.has(Number(e.id))
        ? 'done'
        : 'active';
      return { ...mentor, status };
    });
  }, [experts, expertsApply]);

  const filtered =
    activeTab === '전체'
      ? list
      : list.filter((m) => m.categories.includes(activeTab as TabLabel));

  if (expertsLoading || feedbackLoading) {
    return (
      <div className="ds-subtext mt-10 text-center text-gray-600">로딩 중</div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start">
      <ExpertTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />
      <div className="flex w-full flex-col gap-6 pb-6">
        {filtered.length === 0 ? (
          <div className="ds-subtext mt-10 text-center text-gray-600">
            등록된 전문가가 없습니다.
          </div>
        ) : (
          filtered.map((card) => <MentorCard key={card.id} {...card} />)
        )}
      </div>
    </div>
  );
};

export default ExpertCard;
