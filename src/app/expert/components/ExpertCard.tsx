'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/app/_components/common/Button';
import ExpertTab from './ExpertTab';

interface MentorProps {
  id: number;
  name: string;
  experience: string[];
  button: string;
  status: string;
}

const mentors = [
  {
    id: 1,
    name: '홍길동',
    experience: ['KAKAO', '후랄랄라 경험', '후랄라라라 경험'],
    button: '비대면 평가',
    status: 'active',
  },
  {
    id: 2,
    name: '홍길동',
    experience: ['KAKAO', '후랄랄라 경험', '후랄라라라 경험'],
    button: '신청 완료',
    status: 'done',
  },
  {
    id: 3,
    name: '홍길동',
    experience: ['KAKAO', '후랄랄라 경험', '후랄라라라 경험'],
    button: '비대면 평가',
    status: 'active',
  },
  {
    id: 4,
    name: '홍길동',
    experience: ['KAKAO', '후랄랄라 경험', '후랄라라라 경험'],
    button: '비대면 평가',
    status: 'active',
  },
  {
    id: 5,
    name: '홍길동',
    experience: ['KAKAO', '후랄랄라 경험', '후랄라라라 경험'],
    button: '비대면 평가',
    status: 'active',
  },
  {
    id: 6,
    name: '홍길동',
    experience: ['KAKAO', '후랄랄라 경험', '후랄라라라 경험'],
    button: '비대면 평가',
    status: 'done',
  },
];

const MentorCard = ({ name, experience, button, status }: MentorProps) => {
  const tags = ['안녕', '얘드라', '나야'];
  return (
    <div className="bg-gray-80 flex w-full flex-col overflow-hidden rounded-[12px]">
      <div className="relative h-[180px] w-full">
        <Image
          src="/images/sampleImage.png"
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-start gap-3 p-6">
        <div className="ds-subtitle font-semibold text-gray-900">
          {name}{' '}
          <span className="ds-subtitle font-semibold text-gray-700">멘토</span>
        </div>

        <div className="w-full border border-gray-300" />

        <ul className="ds-subtext list-inside list-disc font-medium text-gray-600">
          {experience.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <div className="flex w-full flex-wrap gap-1">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="rounded-full border border-gray-300 bg-white px-3 py-1"
            >
              <div className="ds-caption font-medium text-gray-900">#{tag}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 w-full">
          <Button
            text={button}
            color={status === 'done' ? 'bg-gray-200' : 'primary'}
            size="M"
            className={status === 'done' ? 'cursor-default text-gray-500' : ''}
          />
        </div>
      </div>
    </div>
  );
};

const ExpertCard = () => {
  const tabs = [
    '시장분석/BM',
    '팀 역량',
    '문제 정의',
    '성장 전략',
    '지표 데이터',
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="flex w-full flex-col items-start">
      <ExpertTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      <div className="grid w-full grid-cols-1 gap-6 pb-10 md:grid-cols-3">
        {mentors.map((m) => (
          <MentorCard key={m.id} {...m} />
        ))}
      </div>
    </div>
  );
};

export default ExpertCard;
