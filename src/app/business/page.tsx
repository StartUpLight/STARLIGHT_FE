'use client';
import React, { useEffect, useState } from 'react';
import WriteForm from './components/WriteForm';
import { useBusinessStore } from '@/store/business.store';
import CreateModal from './components/CreateModal';

const MODAL_CLOSED_KEY = 'businessPlanModalClosed';

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedItem = useBusinessStore((state) => state.selectedItem);
  const setSelectedItem = useBusinessStore((state) => state.setSelectedItem);
  const { initializePlan, restoreContentsFromStorage } = useBusinessStore();

  // 페이지 진입 시 모달 표시 여부 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // localStorage에서 작성 중인 내용 복원
    restoreContentsFromStorage();

    // 모달이 닫혔는지 확인
    const modalClosed = localStorage.getItem(MODAL_CLOSED_KEY) === 'true';

    // 모달이 닫히지 않았으면 모달 표시
    if (!modalClosed) {
      setIsModalOpen(true);
    }
  }, [restoreContentsFromStorage]);

  // 모달 닫기 시 plan 생성 및 localStorage 저장
  const handleCloseModal = async () => {
    try {
      // 사업계획서 생성
      await initializePlan();
      // 모달 닫음 플래그 저장
      localStorage.setItem(MODAL_CLOSED_KEY, 'true');
      setIsModalOpen(false);
    } catch (error) {
      console.error('사업계획서 생성 실패:', error);
      setIsModalOpen(false);
    }
  };

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

      {isModalOpen && (
        <CreateModal
          title="사업계획서 쉽게 생성하기"
          subtitle={`사업계획서 초안을 체크리스트로 쉽게 작성해 보세요.
앞으로 사업계획서의 작성 효율과 퀄리티를 높여주는 자료가 될 거예요.`}
          onClose={handleCloseModal}
          onClick={handleCloseModal}
          buttonText="생성하기"
        />
      )}
    </div>
  );
};

export default Page;
