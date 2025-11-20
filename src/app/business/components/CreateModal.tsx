'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Button from '@/app/_components/common/Button';
import Close from '@/assets/icons/close.svg';

interface CreateModalProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  onClose?: () => void;
  onClick?: () => void;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const CreateModal = ({
  title,
  subtitle,
  buttonText = '생성하기',
  onClose,
  onClick,
  imageSrc = '/images/bussinessModal_Image.png',
  imageAlt = '사진',
  imageWidth = 273,
  imageHeight = 190,
}: CreateModalProps) => {
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20">
      <div className="relative flex w-[585px] flex-col items-center justify-center rounded-[20px] bg-gray-100 p-10">
        <button
          onClick={onClose}
          className="absolute top-7 right-7 cursor-pointer"
          aria-label="닫기"
        >
          <Close />
        </button>

        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="self-center object-contain"
          priority
        />

        <div className="ds-heading mt-8 font-bold text-gray-800">{title}</div>

        <div className="ds-subtext mt-2 text-center font-medium whitespace-pre-line text-gray-600">
          {subtitle}
        </div>

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
