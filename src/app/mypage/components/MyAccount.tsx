'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import PayHistoryModal from './PayHistoryModal';
import { useUserStore } from '@/store/user.store';
import Naver from '@/assets/icons/naver_profile.svg';
import KaKao from '@/assets/icons/kakao_profile.svg';

const MyAccount = () => {
  const [isModal, setIsModal] = useState(false);
  const { user } = useUserStore();

  return (
    <div className="mt-6 flex flex-row items-start gap-4">
      <div className="bg-gray-80 flex w-[556px] flex-col items-start gap-6 rounded-xl p-6">
        <div className="ds-subtitle font-medium text-black">내 계정 </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="flex flex-row gap-4">
          {user?.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="멤버 이미지"
              width={52}
              height={52}
              className="h-[52px] w-[52px] rounded-full object-cover"
              priority
            />
          ) : (
            <div className="ds-text flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gray-400 font-medium">
              {user?.name.charAt(0)}
            </div>
          )}

          <div className="flex flex-col items-start">
            <div className="ds-text font-medium text-gray-900">
              {' '}
              {user?.name}{' '}
            </div>
            <div className="mt-1 flex flex-row items-center gap-2">
              {user?.provider === 'kakao' && <KaKao />}
              {user?.provider === 'naver' && <Naver />}

              <div className="ds-subtext font-medium text-gray-900">
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-80 flex w-[375px] flex-col items-start gap-6 rounded-xl p-6">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="ds-subtitle font-medium text-black"> 요금제 관리</div>
          <button
            className="ds-caption inline-flex h-7 cursor-pointer items-center justify-center rounded-sm bg-gray-200 px-2 font-medium text-gray-900 hover:bg-gray-300 active:bg-gray-300"
            onClick={() => setIsModal(true)}
          >
            구매 내역
          </button>
        </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="flex w-full flex-col items-start gap-1.5">
          <div className="ds-text font-medium text-black">Lite 요금제</div>
          <div className="ds-subtext font-medium text-gray-500">
            잔여횟수 총 1/5회
          </div>
        </div>
      </div>

      {isModal && <PayHistoryModal onClose={() => setIsModal(false)} />}
    </div>
  );
};

export default MyAccount;
