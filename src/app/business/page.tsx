'use client';
import React, { useEffect } from 'react';
import WriteForm from './components/WriteForm';
import { useBusinessStore } from '@/store/business.store';
import CreateModal from './components/CreateModal';
import useEntryBusiness from '@/hooks/useEntryBusiness';

const Page = () => {
  const { open, close, confirm } = useEntryBusiness({
    storageKey: 'businessCreateModal',
    queryKey: 'create',
    pathname: '/business',
    storage: 'local',
  });

  const selectedItem = useBusinessStore((state) => state.selectedItem);
  const setSelectedItem = useBusinessStore((state) => state.setSelectedItem);

  useEffect(() => {
    setSelectedItem({
      number: '0',
      title: '개요',
      subtitle:
        '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
    });
  }, [setSelectedItem]);

  return (
    <div className="min-h-[calc(100vh-60px)] w-full bg-gray-100">
      <main className="mx-auto w-full px-6">
        <WriteForm
          key={selectedItem.number}
          number={selectedItem.number}
          title={selectedItem.title}
          subtitle={selectedItem.subtitle}
        />
      </main>

      {open && (
        <CreateModal
          title="사업계획서 쉽게 생성하기"
          subtitle={`사업계획서 초안을 체크리스트로 쉽게 작성해 보세요.
앞으로 사업계획서의 작성 효율과 퀄리티를 높여주는 자료가 될 거예요.`}
          onClose={close}
          onClick={confirm}
        />
      )}
    </div>
  );
};

export default Page;
