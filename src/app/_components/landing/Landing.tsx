'use client';
import Image from 'next/image';
import useStickyCta from '@/hooks/useStickyCta';
import StickyBar from './StickyBar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import UploadReportModal from '../common/UploadReportModal';
import LoginModal from '../common/LoginModal';
import { useAuthStore } from '@/store/auth.store';

const Landing = () => {
  const { ctaRef, showSticky } = useStickyCta();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <div className="relative flex flex-col items-center text-center font-semibold text-white">
        <p className="text-5xl">막막한 사업계획서 작성,</p>
        <p className="mt-6 text-5xl">스타라이트와 함께 하세요</p>
        <div className="ds-title mt-[18px] font-semibold text-white">
          AI와 전문가가 함께하는 사업계획서 플랫폼
        </div>

        <div ref={ctaRef} className="mt-8 flex gap-3">
          <button
            className="bg-primary-500 ds-text hover:bg-primary-600 active:bg-primary-700 h-[50px] w-[220px] cursor-pointer rounded-full px-8 font-medium text-white"
            onClick={() => {
              if (isAuthenticated) {
                router.push('/business');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          >
            사업계획서 작성하기
          </button>
          <button
            className="ds-text h-[50px] cursor-pointer rounded-full bg-white px-8 font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200"
            onClick={() => {
              if (isAuthenticated) {
                setIsModalOpen(true);
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          >
            PDF 업로드하고 채점받기
          </button>
        </div>

        <div className="pointer-events-none absolute top-full left-1/2 mt-20 -translate-x-1/2">
          <Image
            src="/images/landing/homeimage.png"
            alt="홈화면 이미지"
            width={912}
            height={560}
            className="w-[90vw] max-w-[912px]"
            priority
            unoptimized={true}
          />
        </div>
      </div>

      {isModalOpen && (
        <UploadReportModal open={true} onClose={() => setIsModalOpen(false)} />
      )}

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <StickyBar show={showSticky} />
    </>
  );
};

export default Landing;
