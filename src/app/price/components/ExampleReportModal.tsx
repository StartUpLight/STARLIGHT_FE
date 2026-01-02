import React, { useState } from 'react';
import Close from '@/assets/icons/close.svg';
import Image from 'next/image';

interface ExampleReportModalProps {
  onClose?: () => void;
}

const REPORT_SLIDES = [
  {
    title: 'AI 채점 리포트',
    description: 'AI 진단 기반으로 내 사업계획서의 강·약점을 정확하게 분석',
    image: '/images/price/example_report_1.webp',
  },
  {
    title: 'AI 채점 리포트',
    description: 'AI 진단 기반으로 내 사업계획서의 강·약점을 정확하게 분석',
    image: '/images/price/example_report_2.webp',
  },
  {
    title: 'AI 채점 리포트',
    description: 'AI 진단 기반으로 내 사업계획서의 강·약점을 정확하게 분석',
    image: '/images/price/example_report_3.webp',
  },
];

const ExampleReportModal = ({ onClose }: ExampleReportModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = REPORT_SLIDES[currentIndex];

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/20">
      <div className="w-[662px] rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="ds-title font-semibold text-gray-900">
            AI 사업계획서 리포트 예시
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="닫기"
          >
            <Close />
          </button>
        </div>

        <div className="bg-gray-80 h-[409px] w-full rounded-b-xl p-6">
          <p className="ds-subtext text-primary-500 font-semibold">
            {slide.title}
          </p>

          <p className="ds-subtext mt-1 font-semibold text-gray-900">
            {slide.description}
          </p>

          <div className="mt-4 flex items-center">
            <Image
              src={slide.image}
              alt={slide.title}
              width={614}
              height={272}
              className="h-[272px] w-[614px] object-contain"
              priority
              quality={100}
              unoptimized={true}
            />
          </div>

          <div className="mt-4 flex justify-center gap-3">
            {REPORT_SLIDES.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 w-1.5 cursor-pointer rounded-full ${
                    isActive ? 'bg-gray-500' : 'bg-gray-300'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleReportModal;
