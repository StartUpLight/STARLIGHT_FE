'use client';
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import ExpertTab from './ExpertTab';
import Check from '@/assets/icons/gray_check.svg';
import Plus from '@/assets/icons/white_plus.svg';

interface MentorProps {
  id: number;
  name: string;
  careers: string[];
  button: string;
  status: 'active' | 'done';
  tags: string[];
  categories: string[];
}

const mentors: MentorProps[] = [
  {
    id: 1,
    name: '현명화',
    careers: ['첫 번째 경력', '두 번째 경력', '세 번째 경력'],
    button: '비대면 평가',
    status: 'active',
    tags: ['빅테크', '실력검증', '컨퍼런스 발표', '태그', '발표잘함'],
    categories: ['팀 역량'],
  },
  {
    id: 2,
    name: '손화영',
    careers: ['첫 번째 경력', '두 번째 경력', '세 번째 경력'],
    button: '신청 완료',
    status: 'done',
    tags: ['B2B', '그로스', '데이터'],
    categories: ['성장 전략', '지표 데이터'],
  },
  {
    id: 3,
    name: '백준',
    careers: ['첫 번째 경력', '두 번째 경력', '세 번째 경력'],
    button: '비대면 평가',
    status: 'active',
    tags: ['커머스', '광고집행', 'ROI'],
    categories: ['시장성/BM'],
  },
  {
    id: 4,
    name: '방산들',
    careers: ['첫 번째 경력', '두 번째 경력', '세 번째 경력'],
    button: '비대면 평가',
    status: 'active',
    tags: ['프로덕트', 'PMF', '리서치'],
    categories: ['문제 정의', '팀 역량'],
  },
  {
    id: 5,
    name: '홍길동',
    careers: ['첫 번째 경력', '두 번째 경력', '세 번째 경력'],
    button: '비대면 평가',
    status: 'active',
    tags: ['파트너십', '해외진출'],
    categories: ['성장 전략'],
  },
  {
    id: 6,
    name: '홍길동',
    careers: ['첫 번째 경력', '두 번째 경력', '세 번째 경력'],
    button: '신청 완료',
    status: 'done',
    tags: ['데이터', '퍼널', 'A/B'],
    categories: ['지표 데이터'],
  },
];

const MentorCard = ({ name, careers, status, tags }: MentorProps) => {
  const isDone = status === 'done';
  return (
    <div className="bg-gray-80 flex w-full flex-row items-start justify-between gap-6 rounded-[12px] p-9">
      <div className="flex flex-row gap-6">
        <Image
          src="/images/sampleImage.png"
          alt={name}
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <div className="ds-subtitle font-semibold text-gray-900">
            {name}
            <span className="ds-subtitle ml-1 font-semibold text-gray-700">
              멘토
            </span>
          </div>
          <div className="ds-subtext my-3 font-medium text-gray-600">
            {careers.join(', ')}
          </div>
          <div className="flex w-full flex-wrap gap-[6px]">
            {tags.map((tag, i) => (
              <div
                key={`${name}-tag-${i}`}
                className="bg-primary-50 items-center rounded-[4px] px-2 py-[2px]"
              >
                <div className="ds-caption text-primary-500 font-medium">
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        disabled={isDone}
        className={[
          'ds-text flex w-[156px] items-center justify-center gap-1 rounded-[8px] px-3 py-2 font-medium',
          isDone
            ? 'bg-gray-200 text-gray-500'
            : 'bg-primary-500 hover:bg-primary-700 cursor-pointer text-white',
        ].join(' ')}
      >
        {isDone ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        {isDone ? '신청 완료' : '비대면 평가'}
      </button>
    </div>
  );
};

const ExpertCard = () => {
  const categories = [
    '지표 데이터',
    '시장성/BM',
    '팀 역량',
    '문제 정의',
    '성장 전략',
  ];

  const [activeTab, setActiveTab] = useState<string>(categories[0]);

  const filtered = useMemo(
    () => mentors.filter((m) => m.categories?.includes(activeTab)),
    [activeTab]
  );

  return (
    <div className="flex w-full flex-col items-start">
      <ExpertTab
        tabs={categories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      <div className="flex w-full flex-col gap-6 pb-6">
        {filtered.length === 0 ? (
          <div className="ds-subtext text-gray-600">
            해당 카테고리에 등록된 멘토가 없습니다.
          </div>
        ) : (
          filtered.map((m) => <MentorCard key={m.id} {...m} />)
        )}
      </div>
    </div>
  );
};

export default ExpertCard;
