'use client';

import LoadingScreen from '@/app/_components/common/LoadingScreen';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  return (
    <LoadingScreen
      title="신청 완료"
      subtitles={[
        '전문가 멘토링 신청이 완료되었어요!',
        '멘토링 결과는 마이페이지에서 확인할 수 있어요.',
      ]}
      buttonTextLeft="또 다른 전문가 신청하기"
      onClickLeft={() => router.push('/expert')}
      buttonTextRight="신청 내역 확인하기"
      onClickRight={() => router.push('/mypage')}
    />
  );
};

export default Page;
