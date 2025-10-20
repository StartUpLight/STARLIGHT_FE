'use client';
import React, { useState } from 'react';
import Button from '@/app/_components/common/Button';
import SpellCheck from '../SpellCheck';
import CheckList from '../CheckList';
import CreateModal from '../CreateModal';
import { useRouter } from 'next/navigation';

const RightSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <CheckList />

      <div className="min-h-[310px]">
        <SpellCheck />
      </div>

      <div className="mt-4 flex w-full flex-shrink-0 flex-row gap-[10px]">
        <Button
          text="미리보기"
          size="L"
          color="secondary"
          className="w-[156px] rounded-[8px]"
        />

        <Button
          text="채점하기"
          size="L"
          className="w-[156px] rounded-[8px]"
          onClick={handleOpenModal}
        />
      </div>
      {isModalOpen && (
        <CreateModal
          title="AI로 사업계획서 채점하기"
          subtitle={`방금 작성하신 사업계획서를 항목별로 분석해 점수·강점·리스크를 즉시 제공해드려요.
    70점 이상이면, 아이템에 맞는 전문가 추천까지 제공해드려요.`}
          onClose={handleCloseModal}
          buttonText="채점받기"
          onClick={() => router.push('/report')}
        />
      )}
    </div>
  );
};

export default RightSidebar;
