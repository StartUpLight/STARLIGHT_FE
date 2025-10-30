'use client';
import Button from '@/app/_components/common/Button';
import React from 'react';
import Close from '@/assets/icons/close.svg';
import { createPortal } from 'react-dom';

interface CreateModalProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  onClose?: () => void;
  onClick?: () => void;
}

const CreateModal = ({
  title,
  subtitle,
  buttonText = '생성하기',
  onClose,
  onClick,
}: CreateModalProps) => {
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20">
      <div className="relative flex w-[585px] flex-col items-start rounded-[20px] bg-gray-100 p-10">
        <button
          onClick={onClose}
          className="absolute top-7 right-7 cursor-pointer"
          aria-label="닫기"
        >
          <Close />
        </button>

        <div className="ds-heading font-bold text-gray-800">{title}</div>

        <div className="ds-subtext mt-2 font-medium whitespace-pre-line text-gray-600">
          {subtitle}
        </div>

        <div className="mt-8 h-[144px] w-[505px] bg-white" />

        <Button
          text={buttonText}
          className="mt-8 w-full rounded-full"
          onClick={onClick}
        />
      </div>
    </div>,
    document.body
  );
};

export default CreateModal;
