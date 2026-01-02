'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useExpertDetail } from '@/hooks/queries/useExpert';
import ExpertDetailHeader from './components/ExpertDetailHeader';
import ExpertDetailContent from './components/ExpertDetailContent';
import ExpertDetailSidebar from './components/ExpertDetailSidebar';

function ExpertDetailContentWrapper() {
  const searchParams = useSearchParams();
  const expertId = searchParams.get('id');
  const { data: expert, isLoading } = useExpertDetail(
    expertId ? Number(expertId) : 0
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="ds-subtext text-gray-600">로딩 중</div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="ds-subtext text-gray-600">
          해당 전문가를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <ExpertDetailHeader expert={expert} />

      <div className="w-full px-[248px]">
        <div className="flex flex-row gap-6 pt-[76px]">
          <ExpertDetailContent expert={expert} />
          <ExpertDetailSidebar expert={expert} />
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="ds-subtext text-gray-600">로딩 중</div>
        </div>
      }
    >
      <ExpertDetailContentWrapper />
    </Suspense>
  );
};

export default Page;
