'use client';
import React, { useMemo, useState } from 'react';
import ExpertTab from './ExpertTab';
import { useGetExpert } from '@/hooks/queries/useExpert';
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

const Mentor = (e: getExpertResponse): MentorProps => ({
  id: e.id,
  image: e.profileImageUrl,
  name: e.name,
  careers: e.careers ?? [],
  button: '비대면 평가',
  status: 'active',
  tags: e.tags ?? [],
  categories: (e.categories ?? [])
    .map(mappingKorea)
    .filter(Boolean) as TabLabel[],
  workingperiod: e.workedPeriod,
});

const ExpertCard = () => {
  const { data: experts = [] } = useGetExpert();
  const list = useMemo(
    () => (experts as getExpertResponse[]).map(Mentor),
    [experts]
  );

  const tabs = ['전체', ...TAB_LABELS];
  const [activeTab, setActiveTab] = useState<string>('전체');

  const filtered =
    activeTab === '전체'
      ? list
      : list.filter((m) => m.categories.includes(activeTab as TabLabel));

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
          filtered.map((m) => <MentorCard key={m.id} {...m} />)
        )}
      </div>
    </div>
  );
};
export default ExpertCard;
