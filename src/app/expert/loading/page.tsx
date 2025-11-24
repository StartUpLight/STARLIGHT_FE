'use client';

import LoadingScreen from '@/app/_components/common/LoadingScreen';

const Page = () => {
  return (
    <LoadingScreen
      title="신청 완료"
      subtitles={[
        '전문가 멘토링 신청이 완료되었어요!',
        '멘토링 결과는 마이페이지에서 확인할 수 있어요.',
      ]}
      buttonTextLeft="또 다른 멘토 신청하기"
      buttonTextRight="신청 내역 확인하기"
    />
  );
};

export default Page;
