'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Back from '@/assets/icons/back_icon.svg';
import Eye from '@/assets/icons/eye.svg';
import Button from './Button';
import CreateModal from '@/app/business/components/CreateModal';
import Image from 'next/image';
import { useBusinessStore } from '@/store/business.store';

const BusinessHeader = () => {
  const router = useRouter();
  // const { saveAllItems, initializePlan, resetDraft } = useBusinessStore();
  const { saveAllItems, initializePlan } = useBusinessStore();
  const [title, setTitle] = useState('');
  const [focused, setFocused] = useState(false);
  const [inputWidth, setInputWidth] = useState(179);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const planId = await initializePlan();
      await saveAllItems(planId);
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
    } finally {
      setIsSaving(false);
    }
    // alert('모든 항목이 임시 저장되었습니다.');
  };

  // 3분마다 자동 임시 저장
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const setup = async () => {
      try {
        await initializePlan();
        intervalId = setInterval(async () => {
          try {
            const planId = await initializePlan();
            await saveAllItems(planId);
          } catch (e) {
            console.error('자동 임시 저장 실패:', e);
          }
        }, 180000);
      } catch (e) {
        console.error('사업계획서 초기화 실패:', e);
      }
    };
    setup();

    return () => {
      if (intervalId) clearInterval(intervalId);
      // resetDraft();
    };
  }, [initializePlan, saveAllItems]);

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

  return (
    <header className="fixed inset-x-0 top-0 z-[100] w-full bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.05)]">
      <div className="flex h-[60px] w-full items-center justify-between px-8">
        <div
          onClick={() => router.back()}
          className="flex cursor-pointer items-center justify-center gap-1 rounded-[8px] px-4 py-[6px] active:bg-gray-200"
        >
          <Back />
          <span className="ds-text font-medium whitespace-nowrap text-gray-600">
            이전 페이지
          </span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
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
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="group relative">
            <button
              type="button"
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
              className={`text-primary-500 border-primary-500 ds-subtext h-[33px] border-[1.2px] rounded-[8px] px-3 py-2 flex items-center justify-center font-medium transition ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary-50'}`}
            >
              {isSaving ? "저장 중..." : "임시 저장"}
            </button>
            <Button
              text="채점하기"
              size="M"
              color="primary"
              className="ds-subtext h-[33px] rounded-[8px] px-4 py-[6px]"
              onClick={handleOpenModal}
            />
          </div>
        </div>
        {isModalOpen && (
          <CreateModal
            title="AI로 사업계획서 채점하기"
            subtitle={`방금 작성하신 사업계획서를 항목별로 분석해 점수·강점·리스크를 즉시 제공해드려요.
    70점 이상이면, 아이템에 맞는 전문가 추천까지 제공해드려요.`}
            onClose={handleCloseModal}
            buttonText="채점받기"
            onClick={() => router.push('/report')}
          />
        )}
      </div>
    </header>
  );
};

export default BusinessHeader;
