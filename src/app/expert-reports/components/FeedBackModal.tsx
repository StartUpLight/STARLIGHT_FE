import React from 'react';
import Close from '@/assets/icons/close.svg';
import Error from '@/assets/icons/error.svg';
import Button from '@/app/_components/common/Button';

interface FeedBackModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const FeedBackModal = ({ onClose, onSubmit }: FeedBackModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative flex h-[308px] w-[377px] flex-col rounded-xl bg-white">
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-6 right-6 h-[18px] w-[18px] cursor-pointer"
        >
          <Close />
        </button>

        <div className="flex w-full flex-col items-center justify-center gap-6 px-6 py-8">
          <Error />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="ds-title font-semibold text-gray-900">
              피드백을 제출하시겠어요?
            </div>
            <div className="ds-subtext text-center font-medium text-gray-600">
              최종 제출 후에는 피드백 수정이 어려워요. <br />
              링크를 통해 피드백을 언제든 확인할 수 있어요.
            </div>
          </div>

          <div className="flex w-full flex-row items-center justify-center gap-4">
            <Button
              text="이전으로"
              size="L"
              color="bg-white"
              onClick={onClose}
              className={
                'ds-text h-11 w-full cursor-pointer rounded-lg border-[1.2px] border-gray-300 px-8 py-2.5 hover:bg-gray-100 active:bg-gray-200'
              }
            />
            <Button
              text="피드백 보내기"
              size="L"
              color="primary"
              onClick={onSubmit}
              className={'ds-text h-11 w-full rounded-lg px-8 py-2.5'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedBackModal;
