'use client';

import { useState } from 'react';
import FeedBackModal from './FeedBackModal';

type FeedBackHeaderProps = {
  onComplete: () => void;
  disabled?: boolean;
};

const FeedBackHeader = ({ onComplete, disabled }: FeedBackHeaderProps) => {
  const [isModal, setIsModal] = useState(false);

  const handleSubmit = () => {
    onComplete();
    setIsModal(false);
  };

  return (
    <header className="fixed top-0 right-0 bottom-0 z-100 h-[60px] w-full bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.05)]">
      <div className="flex h-full w-full items-center justify-end px-8">
        <button
          type="button"
          onClick={() => setIsModal(true)}
          disabled={disabled}
          className="ds-subtext bg-primary-500 hover:bg-primary-600 flex h-[33px] cursor-pointer items-center justify-center rounded-lg px-4 py-1.5 font-medium text-white transition disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-900"
        >
          완료하기
        </button>
      </div>
      {isModal && (
        <FeedBackModal
          onClose={() => setIsModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </header>
  );
};

export default FeedBackHeader;
