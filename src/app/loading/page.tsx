'use client';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/loading.json';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostGrade } from '@/hooks/mutation/usePostGrade';
import { useEffect, useRef, Suspense } from 'react';

const LoadingInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planIdParam = searchParams.get('planId');

  const { mutateAsync: postGradeMutateAsync } = usePostGrade();
  const sendOnceRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (sendOnceRef.current) return;
      sendOnceRef.current = true;

      if (!planIdParam) {
        router.back();
        return;
      }

      const id = Number(planIdParam);
      if (Number.isNaN(id)) {
        router.back();
        return;
      }

      try {
        await postGradeMutateAsync(id);
        router.push('/report');
      } catch (error) {
        console.error('채점에 실패했습니다.', error);
        router.back();
      }
    };

    run();
  }, [planIdParam, postGradeMutateAsync, router]);

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
          사업계획서 채점중
        </h1>
        <div className="mb-11">
          <p className="ds-subtitle font-medium text-gray-600">
            사업계획서를 채점 중이에요.
          </p>
          <p className="ds-subtitle font-medium text-gray-600">
            잠시만 기다려주세요!
          </p>
        </div>
      </div>
    </div>
  );
};

const LoadingPage = () => {
  return (
    <Suspense fallback={null}>
      <LoadingInner />
    </Suspense>
  );
};

export default LoadingPage;
