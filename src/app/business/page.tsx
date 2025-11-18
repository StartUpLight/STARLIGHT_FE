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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const selectedItem = useBusinessStore((state) => state.selectedItem);
  const setSelectedItem = useBusinessStore((state) => state.setSelectedItem);
  const { initializePlan, loadContentsFromAPI, clearStorage, resetDraft, isPreview, setPreview, planId, setPlanId } = useBusinessStore();
  const hasInitializedPlanRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    const seen = localStorage.getItem(WRITE_MODAL_KEY) === 'true';
    setIsMember(Boolean(token));
    setHasSeenModal(seen);
    setModalReady(true);
  }, []);

  const markModalSeen = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(WRITE_MODAL_KEY, 'true');
    }
    setHasSeenModal(true);
  }, []);

  // 페이지 진입 시 모달 표시 여부 확인 및 데이터 불러오기
  useEffect(() => {
    if (typeof window === 'undefined' || !modalReady) return;

    const planIdParam = searchParams.get('planId');
    const isRefreshing = sessionStorage.getItem('isRefreshing') === 'true';
    const previousUrl = sessionStorage.getItem('previousUrl');
    const currentUrl = window.location.href;
    const isRefresh = isRefreshing && previousUrl === currentUrl;
    const shouldResetDraft = sessionStorage.getItem('shouldResetBusinessDraft') === 'true';

    const clearRefreshFlags = () => {
      sessionStorage.removeItem('isRefreshing');
      sessionStorage.removeItem('previousUrl');
    };

    const resetDraftState = () => {
      clearStorage();
      resetDraft();
    };

    const loadPlan = (id: number) => {
      setPlanId(id);
      setIsModalOpen(false);
      loadContentsFromAPI(id).catch((error) => {
        console.error('데이터 불러오기 실패:', error);
      });
    };

    if (!isRefresh && shouldResetDraft) {
      sessionStorage.removeItem('shouldResetBusinessDraft');
      resetDraftState();
    }

    const parsedPlanId = planIdParam ? parseInt(planIdParam, 10) : NaN;
    if (!isNaN(parsedPlanId)) {
      loadPlan(parsedPlanId);
      return;
    }

    if (isRefresh) {
      clearRefreshFlags();
      setIsModalOpen(false);
      if (planId) {
        loadPlan(planId);
      }
      return;
    }

    if (planId) {
      return;
    }

    clearRefreshFlags();
    setIsModalOpen(isMember ? !hasSeenModal : true);
    resetDraftState();

    if (isMember && !hasInitializedPlanRef.current) {
      hasInitializedPlanRef.current = true;
      initializePlan().catch((error) => {
        console.error('사업계획서 생성 실패:', error);
      });
    }
  }, [
    searchParams,
    setPlanId,
    planId,
    loadContentsFromAPI,
    clearStorage,
    resetDraft,
    modalReady,
    isMember,
    hasSeenModal,
    initializePlan,
  ]);

  // 페이지를 떠났음을 표시 (실제 초기화는 다음 진입 시점에 수행)
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('shouldResetBusinessDraft', 'true');
      }
    };
  }, []);

  // 새로고침 감지 및 다른 페이지 이동 감지
  useEffect(() => {
    const currentUrl = window.location.href;
    const handleBeforeUnload = () => {
      sessionStorage.setItem('isRefreshing', 'true');
      sessionStorage.setItem('previousUrl', currentUrl);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleCloseModal = () => {
    if (isMember && !hasSeenModal) {
      markModalSeen();
    }
    setIsModalOpen(false);
  };

  const handleCreatePlan = async () => {
    try {
      if (isMember) {
        await initializePlan();
        if (!hasSeenModal) {
          markModalSeen();
        }
      }
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

const Page = () => {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-60px)] w-full bg-gray-100" />}>
      <BusinessPageContent />
    </Suspense>
  );
};

export default Page;
