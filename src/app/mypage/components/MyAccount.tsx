'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import PayHistoryModal from './PayHistoryModal';

const MyAccount = () => {
  const [isModal, setIsModal] = useState(false);
  return (
    <div className="bg-gray-80 mt-6 flex w-full flex-col items-start gap-6 rounded-[12px] p-6">
      <div className="flex w-full flex-row items-start justify-between">
        <div className="ds-subtitle font-medium text-black">내 계정 </div>
        <button
          className="ds-caption cursor-pointer items-center rounded-[4px] bg-gray-200 p-2 font-medium text-gray-900"
          onClick={() => setIsModal(true)}
        >
          {' '}
          이용권 구매 내역
        </button>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex flex-row gap-4">
        <div className="h-[52px] w-[52px] rounded-full bg-gray-400" />
        <div className="flex flex-col items-start">
          <div className="ds-text font-medium text-gray-900"> 홍길동 </div>
          <div className="mt-1 flex flex-row items-center gap-2">
            <Image
              src="/images/kakao.png"
              alt="카카오"
              width={20}
              height={20}
              className="h-5 w-5 object-cover"
            />
            <div className="ds-subtext font-medium text-gray-900">
              starlight@gmail.com
            </div>
          </div>
        </div>
      </div>
      {isModal && <PayHistoryModal />}
    </div>
  );
};

export default MyAccount;
