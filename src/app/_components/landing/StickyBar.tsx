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
        className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
      >
        <div className="mx-auto max-w-[1176px] pb-6">
          <div className="flex items-center rounded-[12px] bg-black/80 px-8 py-5">
            <div className="ds-title block font-medium text-white">
              사업계획서 작성하러 가기
            </div>
            <div className="ml-auto flex gap-3">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/business');
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="bg-primary-500 ds-text hover:bg-primary-600 active:bg-primary-700 h-[50px] w-[220px] cursor-pointer rounded-full px-8 font-medium text-white"
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
