import Button from '@/app/_components/common/Button';
import React from 'react';
import ArrowRight from '@/assets/icons/right_icon.svg';

const ExampleExpert = () => {
  return (
    <div className="bg-gray-80 mt-8 flex w-full flex-row items-center justify-between rounded-xl p-6">
      <div className="ds-subtitle font-semibold text-gray-900">
        {' '}
        전문가 리포트 예시가 필요하신가요?
      </div>

      <Button
        text="전문가 리포트 예시 보러가기"
        size="L"
        color="bg-gray-200"
        icon={<ArrowRight />}
        className="h-11 gap-1 rounded-lg hover:bg-gray-300 active:bg-gray-300"
      />
    </div>
  );
};

export default ExampleExpert;
