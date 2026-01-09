'use client';
import Image from 'next/image';
import { useUserStore } from '@/store/user.store';
import Naver from '@/assets/icons/naver_profile.svg';
import KaKao from '@/assets/icons/kakao_profile.svg';

const MyAccount = () => {
  const { user } = useUserStore();

  return (
    <div className="mt-6 flex w-full flex-row items-start gap-4">
      <div className="bg-gray-80 flex w-full flex-col items-start gap-6 rounded-xl p-6">
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
    </div>
  );
};

export default MyAccount;
