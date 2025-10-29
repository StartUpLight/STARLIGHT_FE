'use client';
import React, { useEffect } from 'react';
import WriteForm from './components/WriteForm';
import { useBusinessStore } from '@/store/business.store';

const Page = () => {
  const selectedItem = useBusinessStore((state) => state.selectedItem);
  const setSelectedItem = useBusinessStore((state) => state.setSelectedItem);

  // 페이지 마운트 시 0번으로 초기화
  useEffect(() => {
    setSelectedItem({
      number: '0',
      title: '개요',
      subtitle: '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
    });
  }, [setSelectedItem]);

  return (
    <div className="min-h-[calc(100vh-60px)] w-full bg-gray-100">
      {/* width는 임의로 고정해두었는데 고정 값 빼면 너비 반응형 동작합니다. */}
      <main className="mx-auto w-full px-6">
        <WriteForm
          key={selectedItem.number}
          number={selectedItem.number}
          title={selectedItem.title}
          subtitle={selectedItem.subtitle}
        />
      </main>
    </div>
  );
};

export default Page;
