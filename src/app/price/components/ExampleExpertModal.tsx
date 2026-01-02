import React from 'react';
import Close from '@/assets/icons/close.svg';
import Image from 'next/image';

interface ExampleExpertModalProps {
  onClose?: () => void;
}

const ExampleExpertModal = ({ onClose }: ExampleExpertModalProps) => {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/20">
      <div className="w-[662px] rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="ds-title font-semibold text-gray-900">
            전문가 리포트 예시
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="닫기"
          >
            <Close />
          </button>
        </div>

        <div className="bg-gray-80 w-full rounded-b-xl p-6">
          <p className="ds-subtext text-primary-500 font-semibold">
            전문가 리포트
          </p>

          <p className="ds-subtext mt-1 font-semibold text-gray-900">
            검증된 전문가에게 직접 피드백을 받아 개선 방향을 명확히 제시
          </p>

          <div className="mt-4 flex flex-col items-center">
            <Image
              src="/images/price/example_expert_1.png"
              alt="총평 이미지"
              width={614}
              height={272}
              className="h-auto w-auto object-contain"
              priority
              quality={100}
              unoptimized={true}
            />

            <div className="mt-3 flex w-full flex-row gap-3">
              <Image
                src="/images/price/example_expert_2.png"
                alt="장점 이미지"
                width={301}
                height={163}
                className="h-auto object-contain"
                priority
                quality={100}
                unoptimized={true}
              />
              <Image
                src="/images/price/example_expert_3.png"
                alt="단점 이미지"
                width={301}
                height={163}
                className="object-contain"
                priority
                quality={100}
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExampleExpertModal;
