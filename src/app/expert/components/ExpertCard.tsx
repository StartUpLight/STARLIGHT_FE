'use client';
import React, { useMemo, useState } from 'react';
import ExpertTab from './ExpertTab';
import { useGetExpert, useGetFeedBackExpert } from '@/hooks/queries/useExpert';
import { getExpertResponse } from '@/types/expert/expert.type';
import { MentorProps } from '@/types/expert/expert.props';
import MentorCard from './MentorCard';

const TAB_LABELS = [
  '지표/데이터',
  '시장성/BM',
  '팀 역량',
  '문제 정의',
  '성장 전략',
] as const;

type TabLabel = (typeof TAB_LABELS)[number];

const CODE_TO_KO: Record<string, TabLabel> = {
  MARKET_BM: '시장성/BM',
  TEAM_CAPABILITY: '팀 역량',
  PROBLEM_DEFINITION: '문제 정의',
  GROWTH_STRATEGY: '성장 전략',
  METRIC_DATA: '지표/데이터',
};
const mappingKorea = (code: string): TabLabel | undefined => CODE_TO_KO[code];

const adaptMentor = (e: getExpertResponse) => ({
  id: e.id,
  image: e.profileImageUrl,
  name: e.name,
  careers: e.careers ?? [],
  tags: e.tags ?? [],
  categories: (e.categories ?? [])
    .map(mappingKorea)
    .filter(Boolean) as TabLabel[],
  workingperiod: e.workedPeriod,
});

const businessPlanId = 1;

const ExpertCard = () => {
  const { data: experts = [], isLoading: expertsLoading } = useGetExpert();
  const { data: feedback, isLoading: feedbackLoading } =
    useGetFeedBackExpert(businessPlanId);

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

  const tabs = ['전체', ...TAB_LABELS];
  const [activeTab, setActiveTab] = useState<string>('전체');

  const filtered =
    activeTab === '전체'
      ? list
      : list.filter((m) => m.categories.includes(activeTab as TabLabel));

  if (expertsLoading || feedbackLoading) {
    return (
      <div className="ds-subtext text-center text-gray-600">불러오는 중…</div>
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
          <div className="ds-subtext text-center text-gray-600">
            등록된 멘토가 없습니다.
          </div>
        ) : (
          filtered.map(({ categories, ...card }) => (
            <MentorCard key={card.id} {...card} />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpertCard;
