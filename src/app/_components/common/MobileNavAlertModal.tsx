'use client';
import React from 'react';
import ErrorIcon from '@/assets/icons/error.svg';

type MobileNavAlertModalProps = {
  open: boolean;
  onClose: () => void;
};

const MobileNavAlertModal = ({ open, onClose }: MobileNavAlertModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] lg:[display:none]">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="flex w-[326px] flex-col items-center gap-6 rounded-[20px] bg-white px-6 pt-8 pb-6 md:w-[377px] md:rounded-xl md:px-6">
          <ErrorIcon />
          <div className="flex w-full flex-col gap-2">
            <p className="text-center text-[18px] font-semibold leading-[1.5] tracking-[-0.36px] text-gray-900 md:text-[20px] md:tracking-[-0.4px]">
              PC환경에서 서비스를 이용해주세요
            </p>
            <div className="flex flex-col items-center text-[14px] font-medium leading-[1.5] text-gray-600">
              <p>모바일 환경에서는 지원되지 않습니다.</p>
              <p>안정적인 경험을 위해 데스크탑 환경을 권장해요!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-primary-500 w-full cursor-pointer rounded-lg py-[10px] text-[16px] font-medium leading-[1.5] tracking-[-0.16px] text-white transition-colors hover:bg-primary-600"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavAlertModal;
