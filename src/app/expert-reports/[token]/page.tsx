'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import FeedBackHeader from '../components/FeedBackHeader';
import FeedBackForm from '../components/FeedBackForm';
import { FeedBackFormHandle } from '@/types/feedback/sections';
import { expertReportsResponse } from '@/types/expert/expert.type';
import { useExpertReportFeedback } from '@/hooks/mutation/useExpertReportFeedback';

const ExpertWritePage = () => {
  const formRef = useRef<FeedBackFormHandle>(null);
  const params = useParams<{ token: string }>();
  const token = params?.token ?? '';

  const { mutate } = useExpertReportFeedback(token);

  const handleComplete = () => {
    if (!formRef.current || !token) return;

    const raw = formRef.current.getFeedback();

    const body: expertReportsResponse = {
      saveType: 'FINAL',
      overallComment: raw.summary,
      details: [
        {
          commentType: 'STRENGTH',
          content: raw.strength,
        },
        {
          commentType: 'WEAKNESS',
          content: raw.weakness,
        },
      ],
    };

    mutate(body, {
      onSuccess: (data) => {
        console.log(data); //수정예정
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <>
      <FeedBackHeader onComplete={handleComplete} />
      <FeedBackForm ref={formRef} />
    </>
  );
};

export default ExpertWritePage;
