'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import UploadReportModal from '../common/UploadReportModal';
import LoginModal from '../common/LoginModal';
import { useAuthStore } from '@/store/auth.store';

interface StickyBarProps {
  show: boolean;
}

const StickyBar = ({ show }: StickyBarProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-50 hidden transition-all duration-300 lg:block ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
      >
        <div className="mx-auto max-w-[1176px] px-4 pb-4 md:px-6 md:pb-5 lg:px-0 lg:pb-6">
          <div className="flex flex-col gap-3 rounded-[12px] bg-black/80 px-4 py-4 md:flex-row md:items-center md:px-6 md:py-4 lg:px-8 lg:py-5">
            <div className="ds-subtext hidden font-medium text-white md:ds-text md:block lg:ds-title">
              사업계획서 작성하러 가기
            </div>
            <div className="flex w-full flex-col gap-2 md:ml-auto md:w-auto md:flex-row md:gap-3">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/business');
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="bg-primary-500 ds-subtext hover:bg-primary-600 active:bg-primary-700 h-[42px] w-full cursor-pointer rounded-full px-4 font-medium text-white md:ds-text md:h-[46px] md:w-auto md:px-6 lg:h-[50px] lg:w-[220px] lg:px-8"
              >
                사업계획서 작성하기
              </button>
              <button
                className="ds-subtext h-[42px] w-full cursor-pointer rounded-full bg-white px-4 font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200 md:ds-text md:h-[46px] md:w-auto md:px-6 lg:h-[50px] lg:px-8"
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
          </div>
        </div>
      </div>
      {isModalOpen && (
        <UploadReportModal open={true} onClose={() => setIsModalOpen(false)} />
      )}
      <LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default StickyBar;
