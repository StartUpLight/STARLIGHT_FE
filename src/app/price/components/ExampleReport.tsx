'use client';
import Button from '@/app/_components/common/Button';
import React, { useState } from 'react';
import ArrowRight from '@/assets/icons/right_icon.svg';
import ExampleReportModal from './ExampleReportModal';

const ExampleReport = () => {
  const [isModal, setIsModal] = useState(false);
  return (
    <>
      <div className="bg-gray-80 mt-8 flex w-full flex-row items-center justify-between rounded-xl p-6">
        <div className="ds-subtitle font-semibold text-gray-900">
          {' '}
          AI 리포트 예시가 필요하신가요?
        </div>

        <Button
          text="AI 리포트 예시 보러가기"
          size="L"
          color="bg-gray-200"
          icon={<ArrowRight />}
          className="h-11 w-[263px] gap-1 rounded-lg text-gray-900 hover:bg-gray-300 active:bg-gray-300"
          onClick={() => setIsModal(true)}
        />
      </div>
      {isModal && <ExampleReportModal onClose={() => setIsModal(false)} />}
    </>
  );
};

export default ExampleReport;
