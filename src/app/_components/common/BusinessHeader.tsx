'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Back from '@/assets/icons/back_icon.svg';
import Eye from '@/assets/icons/eye.svg';
import Button from './Button';
import CreateModal from '@/app/business/components/CreateModal';
import LoginModal from './LoginModal';
import Image from 'next/image';
import Download from '@/assets/icons/download.svg';
import { useBusinessStore } from '@/store/business.store';
import { downloadPDF } from '@/lib/pdfDownload';
import { patchBusinessPlanTitle } from '@/api/business';
import { useAuthStore } from '@/store/auth.store';
import {
  GUEST_DRAFT_KEY,
  GUEST_PENDING_ACTION_KEY,
  LOGIN_REDIRECT_KEY,
} from '@/lib/business/authKeys';
import sections from '@/data/sidebar.json';
import { isSectionCompleted } from '@/util/checkcontent';
import ToastMessage from './ToastMessage';

type PendingAction = 'save' | 'grade';

const BusinessHeaderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    saveAllItems,
    initializePlan,
    planId,
    isPreview,
    setPreview,
    setIsSaving,
    title,
    setTitle,
    loadTitleFromAPI,
    getItemContent,
    contents,
  } = useBusinessStore();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // URL의 planId 또는 store의 planId로 제목 조회
  useEffect(() => {
    const planIdParam = searchParams.get('planId');
    const targetPlanId = planIdParam ? parseInt(planIdParam, 10) : planId;

    if (!targetPlanId || isNaN(targetPlanId)) {
      setTitle('');
      return;
    }

    // planId가 변경되었을 때만 제목 로드 (중복 요청 방지)
    let isCancelled = false;
    loadTitleFromAPI(targetPlanId)
      .then((loadedTitle) => {
        if (!isCancelled && loadedTitle) {
          const currentPlanId = planIdParam
            ? parseInt(planIdParam, 10)
            : planId;
          if (currentPlanId === targetPlanId) {
            setTitle(loadedTitle);
          }
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error('제목 불러오기 실패:', error);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [searchParams, planId, loadTitleFromAPI, setTitle]);

  // 제목 변경 시 API 요청 (debounce 적용)
  useEffect(() => {
    const trimmedTitle = title.trim();

    if (!planId || !trimmedTitle) return;
    const timeoutId = setTimeout(() => {
      const updateTitle = async () => {
        try {
          await patchBusinessPlanTitle(planId, trimmedTitle);
        } catch (error) {
          console.error('제목 업데이트 실패:', error);
        }
      };
      updateTitle();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [title, planId]);

  const [focused, setFocused] = useState(false);
  const [inputWidth, setInputWidth] = useState(179);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const isSaving = useBusinessStore((state) => state.isSaving);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [gradingPlanId, setGradingPlanId] = useState<number | null>(null);

  const allSectionItems = useMemo(() => {
    type SidebarItem = { number: string };
    type SidebarSection = { items: SidebarItem[] };
    return (sections as SidebarSection[]).flatMap((sec) => sec.items);
  }, []);

  const allSectionsCompleted = useMemo(() => {
    if (!getItemContent) return false;
    return allSectionItems.every((item) =>
      isSectionCompleted(getItemContent, item.number)
    );
  }, [getItemContent, allSectionItems, contents]);

  const clearToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(null);
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2000);
  }, []);


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDownloadPDF = async () => {
    await downloadPDF(title || '사업계획서');
  };

  const persistGuestDraft = useCallback((action: PendingAction) => {
    if (typeof window === 'undefined') return;
    try {
      const { contents, title: currentTitle } = useBusinessStore.getState();
      localStorage.setItem(
        GUEST_DRAFT_KEY,
        JSON.stringify({ contents, title: currentTitle })
      );
      localStorage.setItem(GUEST_PENDING_ACTION_KEY, action);
      const redirectPath = window.location.pathname + window.location.search;
      sessionStorage.setItem(
        LOGIN_REDIRECT_KEY,
        redirectPath && redirectPath.length > 0 ? redirectPath : '/business'
      );
    } catch (error) {
      console.error('비회원 초안 저장 실패:', error);
    }
  }, []);

  const requireLoginForAction = useCallback(
    (action: PendingAction) => {
      persistGuestDraft(action);
      setOpenLoginModal(true);
    },
    [persistGuestDraft]
  );

  const handleSave = useCallback(async () => {
    if (!isAuthenticated) {
      requireLoginForAction('save');
      return;
    }
    try {
      setIsSaving(true);
      const currentPlanId = planId || (await initializePlan());
      await saveAllItems(currentPlanId);
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, requireLoginForAction, setIsSaving, planId, initializePlan, saveAllItems]);

  const handleGrade = useCallback(async () => {
    if (!allSectionsCompleted) {
      showToast('모든 항목을 입력한 후에 채점이 가능해요.');
      return;
    }
    if (!isAuthenticated) {
      requireLoginForAction('grade');
      return;
    }
    try {
      setIsSaving(true);
      const id = planId ?? (await initializePlan());
      if (id == null) throw new Error('planId 생성에 실패했습니다.');

      await saveAllItems(id);
      setGradingPlanId(id);
      handleOpenModal();
    } catch (error) {
      console.error('채점 준비 중 오류:', error);
    } finally {
      setIsSaving(false);
    }
  }, [
    isAuthenticated,
    requireLoginForAction,
    setIsSaving,
    planId,
    initializePlan,
    saveAllItems,
    handleOpenModal,
    allSectionsCompleted,
    showToast,
  ]);

  const handleCloseLoginModal = useCallback(() => {
    setOpenLoginModal(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 페이지 진입 시 항상 작성 모드로 초기화
  useEffect(() => {
    setPreview(false);
  }, [setPreview]);

  useEffect(() => {
    return () => {
      clearToast();
    };
  }, [clearToast]);

  useEffect(() => {
    if (spanRef.current) {
      const textWidth = spanRef.current.offsetWidth;
      if (title) {
        const natural = Math.min(Math.max(100, textWidth + 24), 320);
        setInputWidth(focused ? Math.max(natural, 320) : natural);
      } else {
        setInputWidth(focused ? 320 : 179);
      }
    }
  }, [title, focused]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (typeof window === 'undefined') return;
    const pendingAction = localStorage.getItem(GUEST_PENDING_ACTION_KEY) as PendingAction | null;
    if (!pendingAction) return;

    localStorage.removeItem(GUEST_PENDING_ACTION_KEY);
    handleSave();
  }, [isAuthenticated, handleSave]);

  return (
    <>
      <header className="fixed top-0 right-0 bottom-0 z-[100] h-[60px] w-full bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.05)]">
        <div className="flex w-full items-center justify-between px-8 pt-3">
          <div
            onClick={() => {
              // 미리보기 모드일 때는 작성 화면으로 전환
              if (isPreview) {
                setPreview(false);
              } else {
                router.back();
              }
            }}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-[8px] px-4 py-[6px] active:bg-gray-200"
          >
            <Back />
            <span className="ds-text font-medium whitespace-nowrap text-gray-600">
              이전 페이지
            </span>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            {isPreview ? null : (
              <>
                <span
                  ref={spanRef}
                  className="ds-text invisible absolute font-medium whitespace-pre text-gray-900"
                  aria-hidden="true"
                >
                  {title || '제목을 입력하세요'}
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="제목을 입력하세요."
                  aria-label="문서 제목"
                  style={{ width: inputWidth }}
                  className="ds-text hover:border-primary-200 rounded-[8px] bg-white px-3 py-[6px] text-start font-medium overflow-ellipsis transition-[width] duration-200 ease-out placeholder:text-gray-400 hover:border-[1.2px] focus:outline-none"
                />
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-6">
            {isPreview ? (
              <>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="flex h-[33px] w-[33px] cursor-pointer items-center justify-center rounded-[8px] border-[1.2px] border-gray-200 transition-colors hover:bg-gray-100 focus:outline-none"
                >
                  <Download />
                </button>
                <div className="h-[32px] w-[1.6px] bg-gray-200" />
                <Button
                  text="채점하기"
                  size="M"
                  color="primary"
                  className="ds-subtext h-[33px] rounded-lg px-4 py-1.5"
                  onClick={handleGrade}
                />
              </>
            ) : (
              <>
                <div className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      // window에 등록된 토글 함수 호출
                      if (typeof window !== 'undefined') {
                        const win = window as Window & {
                          togglePreview?: () => void;
                        };
                        if (win.togglePreview) {
                          win.togglePreview();
                        }
                      }
                    }}
                    className="flex h-[33px] w-[33px] cursor-pointer items-center justify-center rounded-[8px] border-[1.2px] border-gray-200 transition-colors hover:bg-gray-100 focus:outline-none"
                  >
                    <Eye />
                  </button>
                  <div className="pointer-events-none absolute top-10 left-1/2 hidden -translate-x-1/2 group-hover:block">
                    <div className="relative h-[44px] w-[73px] select-none">
                      <Image
                        src="/images/bubble.png"
                        alt="미리보기 호버 말풍선"
                        fill
                        sizes="73px"
                        className="object-contain"
                      />
                      <span className="ds-subtext absolute inset-0 top-2 flex items-center justify-center font-medium text-white">
                        미리보기
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-[1.6px] bg-gray-200" />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`text-primary-500 border-primary-500 ds-subtext flex h-[33px] items-center justify-center rounded-[8px] border-[1.2px] px-3 py-2 font-medium transition ${isSaving
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-primary-50 cursor-pointer'
                      }`}
                  >
                    {isSaving ? '저장 중...' : '저장하기'}
                  </button>
                  <Button
                    text="채점하기"
                    size="M"
                    color="primary"
                    className={`ds-subtext h-[33px] rounded-lg px-4 py-1.5 ${isSaving ? 'pointer-events-none opacity-50' : ''
                      }`}
                    disabled={isSaving}
                    onClick={handleGrade}
                  />
                </div>
              </>
            )}
          </div>

          {isModalOpen && gradingPlanId && (
            <CreateModal
              title="AI로 사업계획서 채점하기"
              imageSrc="/images/grading_Image.png"
              imageAlt="채점하기 안내 이미지"
              imageWidth={336}
              imageHeight={202}
              subtitle={`방금 작성하신 사업계획서를 항목별로 분석해 점수·강점·리스크를 즉시 제공해드려요.\n70점 이상이면, 아이템에 맞는 전문가 추천까지 제공해드려요.`}
              onClose={handleCloseModal}
              buttonText="채점하기"
              onClick={() => {
                router.push(`/loading?planId=${gradingPlanId}`);
              }}
            />
          )}
          <LoginModal open={openLoginModal} onClose={handleCloseLoginModal} />
        </div>
      </header>
      {toastMessage ? (
        <ToastMessage message={toastMessage} onClose={clearToast} />
      ) : null}
    </>
  );
};

const BusinessHeader = () => (
  <Suspense
    fallback={
      <header className="fixed top-0 right-0 bottom-0 z-[100] h-[60px] w-full bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.05)]" />
    }
  >
    <BusinessHeaderContent />
  </Suspense>
);

export default BusinessHeader;