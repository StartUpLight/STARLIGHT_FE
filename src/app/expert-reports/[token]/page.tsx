'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import FeedBackHeader from '../components/FeedBackHeader';
import FeedBackForm from '../components/FeedBackForm';
import { FeedBackFormHandle, SectionKey } from '@/types/feedback/sections';
import { expertReportsResponse } from '@/types/expert/expert.type';
import { useExpertReportFeedback } from '@/hooks/mutation/useExpertReportFeedback';
import { useExpertReport } from '@/hooks/queries/useExpertReport';

type FeedbackMap = Partial<Record<SectionKey, string>>;

const ExpertWritePage = () => {
  const formRef = useRef<FeedBackFormHandle>(null);
  const params = useParams<{ token: string }>();
  const token = params?.token ?? '';

  const { mutate } = useExpertReportFeedback(token);
  const { data, isLoading } = useExpertReport(token);

  const initialFeedback: FeedbackMap | undefined = data && {
    summary: data.overallComment ?? '',
    strength:
      data.details.find((detail) => detail.commentType === 'STRENGTH')
        ?.content ?? '',
    weakness:
      data.details.find((detail) => detail.commentType === 'WEAKNESS')
        ?.content ?? '',
  };

  const isCompleteDisabled = data?.canEdit === false;

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
        console.log(data);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <>
      <FeedBackHeader
        onComplete={handleComplete}
        disabled={isCompleteDisabled}
      />
      <FeedBackForm
        ref={formRef}
        initialFeedback={initialFeedback}
        loading={isLoading}
      />
    </>
  );
};

export default ExpertWritePage;
