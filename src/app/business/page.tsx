'use client';
import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WriteForm from './components/WriteForm';
import Preview from './components/Preview';
import { useBusinessStore } from '@/store/business.store';
import CreateModal from './components/CreateModal';

const WRITE_MODAL_KEY = 'writeModalShown';

const BusinessPageContent = () => {
  const searchParams = useSearchParams();
  const selectedItem = useBusinessStore((state) => state.selectedItem);
  const { initializePlan, loadContentsFromAPI, resetDraft, isPreview, setPreview, planId, setPlanId, setSelectedItem } = useBusinessStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const hasInitializedPlanRef = useRef(false);

  useEffect(() => {
    setSelectedItem({
      number: '0',
      title: '개요',
      subtitle:
        '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
    });
  }, [setSelectedItem]);

  // 초기 설정: 로그인 상태 및 모달 표시 여부 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    const seen = localStorage.getItem(WRITE_MODAL_KEY) === 'true';
    setIsMember(Boolean(token));
    setHasSeenModal(seen);
    setModalReady(true);
  }, []);

  // 페이지 이탈 감지: 다음 진입 시 초기화 플래그 설정
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('shouldResetBusinessDraft', 'true');
      }
    };
  }, []);

  // 첫 진입 시에도 초기화 플래그를 기본적으로 활성화
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sessionStorage.getItem('shouldResetBusinessDraft')) {
      sessionStorage.setItem('shouldResetBusinessDraft', 'true');
    }
  }, []);

  // 새로고침 감지: 새로고침 시 상태 유지
  useEffect(() => {
    const currentUrl = window.location.href;
    const handleBeforeUnload = () => {
      sessionStorage.setItem('isRefreshing', 'true');
      sessionStorage.setItem('previousUrl', currentUrl);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const markModalSeen = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WRITE_MODAL_KEY, 'true');
    }
    setHasSeenModal(true);
  }, []);

  // 페이지 진입 시 데이터 로딩 및 초기화
  useEffect(() => {
    if (typeof window === 'undefined' || !modalReady) return;

    const planIdParam = searchParams.get('planId');
    const parsedPlanId = planIdParam ? parseInt(planIdParam, 10) : null;
    const isRefreshing = sessionStorage.getItem('isRefreshing') === 'true';
    const previousUrl = sessionStorage.getItem('previousUrl');
    const isRefresh = isRefreshing && previousUrl === window.location.href;
    const shouldResetDraft = sessionStorage.getItem('shouldResetBusinessDraft') === 'true';

    const clearRefreshFlags = () => {
      sessionStorage.removeItem('isRefreshing');
      sessionStorage.removeItem('previousUrl');
    };

    const resetDraftState = () => {
      resetDraft();
    };

    const loadPlan = async (id: number) => {
      setPlanId(id);
      setIsModalOpen(false);
      try {
        await loadContentsFromAPI(id);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    // URL에 planId가 있으면 해당 planId로 로드
    if (parsedPlanId) {
      loadPlan(parsedPlanId);
      return;
    }

    // 새로고침인 경우 기존 planId로 로드
    if (isRefresh) {
      clearRefreshFlags();
      setIsModalOpen(false);
      if (planId) loadPlan(planId);
      return;
    }

    // 초기 상태 설정 (새 사업계획서 작성 모드)
    clearRefreshFlags();
    if (shouldResetDraft) {
      sessionStorage.removeItem('shouldResetBusinessDraft');
      resetDraftState();
    }

    setIsModalOpen(isMember ? !hasSeenModal : true);
    if (isMember && !hasInitializedPlanRef.current) {
      hasInitializedPlanRef.current = true;
      initializePlan().catch((error) => console.error('사업계획서 생성 실패:', error));
    }
  }, [
    searchParams,
    setPlanId,
    planId,
    loadContentsFromAPI,
    resetDraft,
    modalReady,
    isMember,
    hasSeenModal,
    initializePlan,
  ]);

  // 이벤트 핸들러
  const handleCloseModal = () => {
    if (isMember && !hasSeenModal) markModalSeen();
    setIsModalOpen(false);
  };

  const handleCreatePlan = async () => {
    try {
      if (isMember) {
        await initializePlan();
        if (!hasSeenModal) markModalSeen();
      }
    } catch (error) {
      console.error('사업계획서 생성 실패:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleTogglePreview = useCallback(() => {
    setPreview(!isPreview);
  }, [isPreview, setPreview]);

  // 전역 미리보기 토글 함수 등록 (BusinessHeader에서 사용)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as Window & { togglePreview?: () => void };
    win.togglePreview = handleTogglePreview;
    return () => {
      delete win.togglePreview;
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

const Page = () => {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-60px)] w-full bg-gray-100" />}>
      <BusinessPageContent />
    </Suspense>
  );
};

export default Page;
