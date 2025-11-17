'use client';
import React, { useEffect, useState, useCallback } from 'react';
import WriteForm from './components/WriteForm';
import Preview from './components/Preview';
import { useBusinessStore } from '@/store/business.store';
import CreateModal from './components/CreateModal';

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedItem = useBusinessStore((state) => state.selectedItem);
  const setSelectedItem = useBusinessStore((state) => state.setSelectedItem);
  const {
    initializePlan,
    loadContentsFromAPI,
    clearStorage,
    resetDraft,
    isPreview,
    setPreview,
    planId,
  } = useBusinessStore();

  // 페이지 진입 시 모달 표시 여부 확인 및 데이터 불러오기
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 새로고침인지 확인
    const isRefreshing = sessionStorage.getItem('isRefreshing') === 'true';
    const previousUrl = sessionStorage.getItem('previousUrl');
    const currentUrl = window.location.href;

    // 같은 URL이고 플래그가 있으면 새로고침
    const isRefresh = isRefreshing && previousUrl === currentUrl;

    if (isRefresh) {
      // 새로고침: 모달 표시 안 함, API에서 데이터 불러오기
      sessionStorage.removeItem('isRefreshing');
      sessionStorage.removeItem('previousUrl');
      setIsModalOpen(false);

      // planId가 있으면 API에서 데이터 불러오기
      if (planId) {
        loadContentsFromAPI(planId).catch((error) => {
          console.error('데이터 불러오기 실패:', error);
        });
      }
    } else {
      // 다른 페이지에서 진입: 모달 표시, 새로운 사업계획서 생성 준비
      sessionStorage.removeItem('isRefreshing');
      sessionStorage.removeItem('previousUrl');
      setIsModalOpen(true);
      // 기존 작성 내용 및 planId 초기화 (새로운 사업계획서이므로)
      clearStorage();
      resetDraft();
    }
  }, []);

  // 새로고침 감지 및 다른 페이지 이동 감지
  useEffect(() => {
    // 현재 URL 저장
    const currentUrl = window.location.href;

    const handleBeforeUnload = () => {
      // 새로고침 플래그 설정 (나중에 같은 URL인지 확인)
      sessionStorage.setItem('isRefreshing', 'true');
      sessionStorage.setItem('previousUrl', currentUrl);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 모달 닫기 (X 버튼 클릭 시)
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 모달 버튼 클릭 시 plan 생성
  const handleCreatePlan = async () => {
    try {
      // 사업계획서 생성 (이미 planId가 있으면 새로 생성하지 않음)
      await initializePlan();
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

  // 미리보기 모드 전환 핸들러
  const handleTogglePreview = useCallback(() => {
    setPreview(!isPreview);
  }, [isPreview, setPreview]);

  // 전역으로 미리보기 토글 함수 등록 (BusinessHeader에서 사용)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as Window & { togglePreview?: () => void };
      win.togglePreview = handleTogglePreview;
    }
    return () => {
      if (typeof window !== 'undefined') {
        const win = window as Window & { togglePreview?: () => void };
        delete win.togglePreview;
      }
    };
  }, [handleTogglePreview]);

  return (
    <>
      {isPreview ? (
        <Preview />
      ) : (
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
              subtitle={`사업계획서 초안을 체크리스트로 쉽게 작성해 보세요.\n앞으로 사업계획서의 작성 효율과 퀄리티를 높여주는 자료가 될 거예요.`}
              imageSrc="/images/bussinessModal_Image.png"
              imageAlt="사업계획서 생성 안내 이미지"
              onClose={handleCloseModal}
              onClick={handleCreatePlan}
              buttonText="생성하기"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Page;
