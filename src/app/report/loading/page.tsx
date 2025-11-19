'use client';
import LoadingPoint from '@/assets/icons/loading_point.svg';

const page = () => {
  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="mt-[220px] text-center">
        <div className="bg-primary-500 mx-auto mb-6 flex h-[60px] w-[60px] items-center justify-center gap-[6px] rounded-full">
          <LoadingPoint />
          <LoadingPoint />
          <LoadingPoint />
        </div>
        <h1 className="ds-heading mb-2 font-bold text-gray-900">
          사업계획서 분석중
        </h1>
        <div className="mb-[44px]">
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

export default page;
