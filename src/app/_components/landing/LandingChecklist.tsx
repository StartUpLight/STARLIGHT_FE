'use client';
import Image from 'next/image';
import ArrowIcon from '@/assets/icons/chevron_right.svg';
import ArrowSmallIcon from '@/assets/icons/arrow_right_small.svg';
import { useRouter } from 'next/navigation';
import { useCountdown } from '@/hooks/useCountdown';

const LandingChecklist = () => {
  const router = useRouter();
  const timeLeft = useCountdown('2026-02-28T23:59:59');

  return (
    <div className="w-full bg-black px-4 pt-15 md:px-10 md:py-28 lg:px-0 lg:py-40">
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-10 md:gap-12 lg:flex-row lg:gap-[61px]">
        <div className="flex w-full flex-col gap-[30px] md:gap-16 lg:w-auto lg:gap-[100px]">
          <h2 className="text-left text-[20px] leading-[150%] font-bold text-white md:text-[32px] lg:text-left lg:text-[42px]">
            2026년 지원사업, <br />
            사업계획서에서 탈락하지 않게 만드는 방법
          </h2>

          <div className="flex flex-col gap-4">
            <p className="ds-subtext text-left font-semibold text-gray-300 md:ds-text lg:ds-title lg:text-left">
              2026 지원사업 대비 모든 기능 무료 프로모션 (~2/28)
            </p>

            <div className="flex flex-row items-start justify-center gap-2 md:gap-3 lg:justify-start">
              {[
                { value: timeLeft.days, label: '일' },
                { value: timeLeft.hours, label: '시간' },
                { value: timeLeft.minutes, label: '분' },
                { value: timeLeft.seconds, label: '초' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="ds-title flex h-[60px] w-full items-center justify-center rounded-lg bg-gray-900 font-semibold text-white md:ds-heading md:h-[72px] md:w-[90px] lg:h-[86px] lg:w-[120px] lg:py-10"
                >
                  {item.value}
                  {item.label}
                </div>
              ))}
            </div>
            <button
              className="ds-subtext flex h-[44px] w-full cursor-pointer items-center justify-center gap-[2px] rounded bg-white px-4 font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200 md:ds-text md:h-[56px] md:rounded-lg lg:ds-title lg:h-[64px] lg:w-[516px] lg:px-8"
              onClick={() => router.push('/business')}
            >
              2026 지원사업 준비 시작하기
              <ArrowSmallIcon className="md:hidden" />
              <ArrowIcon className="hidden md:block" />
            </button>
          </div>
        </div>

        <Image
          src="/images/landing/landing_promotion.png"
          alt="프로모션 이미지"
          width={479}
          height={412}
          className="hidden h-auto w-full max-w-[360px] md:block md:max-w-[400px] lg:h-[412px] lg:w-[479px] lg:max-w-none"
          priority
          quality={100}
          unoptimized={true}
        />
      </div>
    </div>
  );
};

export default LandingChecklist;
