'use client';
import React, { useEffect, useMemo, useState } from 'react';
import ExpertTab from './ExpertTab';
import { useGetExpert } from '@/hooks/queries/useExpert';
import { getExpertResponse } from '@/types/expert/expert.type';
import { MentorProps } from '@/types/expert/expert.props';
import MentorCard from './MentorCard';

const Mentor = (e: getExpertResponse): MentorProps => ({
  id: e.id,
  image: e.profileImageUrl,
  name: e.name,
  careers: e.careers ?? [],
  button: '비대면 평가',
  status: 'active',
  tags: e.tags ?? [],
  categories: e.categories ?? [],
  workingperiod: e.workedPeriod,
});

const ExpertCard = () => {
  const tabCategories = [
    '지표 데이터',
    '시장성/BM',
    '팀 역량',
    '문제 정의',
    '성장 전략',
  ];

  const { data: experts = [] } = useGetExpert();

  const list: MentorProps[] = useMemo(
    () => (experts as getExpertResponse[]).map(Mentor),
    [experts]
  );

  const tabs = useMemo(() => ['전체', ...tabCategories], [tabCategories]);
  const [activeTab, setActiveTab] = useState<string>('전체');

  useEffect(() => {
    if (!tabs.includes(activeTab)) setActiveTab('전체');
  }, [tabs, activeTab]);

  const filtered = useMemo(() => {
    if (activeTab === '전체') return list;
    return list.filter((m) => {
      const basis = m.tags?.length ? m.tags : m.categories;
      return basis?.includes(activeTab);
    });
  }, [activeTab, list]);

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
