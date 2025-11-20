'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import FeedBackHeader from '../components/FeedBackHeader';
import FeedBackForm from '../components/FeedBackForm';
import { FeedBackFormHandle, SectionKey } from '@/types/feedback/sections';
import {
  expertReportsResponse,
  getExpertReportsResponse,
} from '@/types/expert/expert.type';
import { useExpertReportFeedback } from '@/hooks/mutation/useExpertReportFeedback';
import { useExpertReport } from '@/hooks/queries/useExpertReport';

type FeedbackMap = Partial<Record<SectionKey, string>>;

const ExpertWritePage = () => {
  const formRef = useRef<FeedBackFormHandle>(null);
  const params = useParams<{ token: string }>();
  const token = params?.token ?? '';

  const queryClient = useQueryClient();

  const { data, isLoading } = useExpertReport(token);
  const { mutate } = useExpertReportFeedback(token);

  const initialFeedback: FeedbackMap | undefined = data && {
    summary: data.overallComment ?? '',
    strength:
      data.details.find((detail) => detail.commentType === 'STRENGTH')
        ?.content ?? '',
    weakness:
      data.details.find((detail) => detail.commentType === 'WEAKNESS')
        ?.content ?? '',
  };

  const typedData = data as getExpertReportsResponse | undefined;
  const isSubmitted = !!typedData && typedData.canEdit === false;

  const isCompleteDisabled = isSubmitted;

  const handleComplete = () => {
    if (!formRef.current || !token) return;

    const raw = formRef.current.getFeedback();

    const body: expertReportsResponse = {
      saveType: 'FINAL',
      overallComment: raw.summary,
      details: [
        { commentType: 'STRENGTH', content: raw.strength },
        { commentType: 'WEAKNESS', content: raw.weakness },
      ],
    };

    mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GetExpertReport', token],
        });
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
        isSubmitted={isSubmitted}
      />
    </>
  );
};

export default ExpertWritePage;
