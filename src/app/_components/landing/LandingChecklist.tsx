'use client';
import Image from 'next/image';
import ArrowIcon from '@/assets/icons/chevron_right.svg';
import { useRouter } from 'next/navigation';

const LandingChecklist = () => {
  const router = useRouter();
  return (
    <div className="w-full bg-black px-[132px] py-40">
      <div className="flex w-full flex-row gap-[61px]">
        <div className="flex flex-col gap-[100px]">
          <h2 className="text-[42px] leading-[150%] font-bold text-white">
            2026년 지원사업, <br />
            사업계획서에서 탈락하지 않게 만드는 방법
          </h2>

          <div className="flex flex-col gap-6">
            <p className="ds-title font-semibold text-gray-300">
              2026 지원사업 대비 모든 기능 무료 프로모션 (~1/10)
            </p>

            <div className="flex flex-row items-start gap-3">
              {['10일', '4시간', '19분', '20초'].map((time) => (
                <div
                  key={time}
                  className="ds-heading flex h-[86px] w-[120px] items-center justify-center rounded-lg bg-gray-900 py-10 font-semibold text-white"
                >
                  {time}
                </div>
              ))}
            </div>
            <button
              className="ds-title flex h-[64px] w-[516px] cursor-pointer items-center justify-center rounded-lg bg-white px-8 font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200"
              onClick={() => router.push('/business')}
            >
              2026 지원사업 준비 시작하기
              <ArrowIcon />
            </button>
          </div>
        </div>

        <Image
          src="/images/landing/landing_promotion.png"
          alt="프로모션 이미지"
          width={479}
          height={412}
          className="h-[412px] w-[479px]"
          priority
          quality={100}
          unoptimized={true}
        />
      </div>
    </div>
  );
};

export default LandingChecklist;
