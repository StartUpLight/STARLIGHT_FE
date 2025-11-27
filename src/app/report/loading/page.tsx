'use client';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/loading.json';

const Page = () => {
  return (
    <div className="flex justify-center bg-white">
      <div className="mt-[220px] text-center">
        <div className="mx-auto mb-6 h-[60px] w-[60px]">
          <Lottie
            animationData={loadingAnimation}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <h1 className="ds-heading mb-2 font-bold text-gray-900">
          사업계획서 분석중
        </h1>
        <div className="mb-11">
          <p className="ds-subtitle font-medium text-gray-600">
            사업계획서를 분석 중이에요.
          </p>
          <p className="ds-subtitle font-medium text-gray-600">
            잠시만 기다려주세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
