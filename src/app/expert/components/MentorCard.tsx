'use client';
import { useState } from 'react';
import { MentorCardProps } from '@/types/expert/expert.props';
import { ApplyFeedback } from '@/api/expert';
import {
  getBusinessPlanSubsections,
  getBusinessPlanTitle,
} from '@/api/business';
import { generatePdfFromSubsections } from '@/lib/generatePdf';
import Image from 'next/image';
import Check from '@/assets/icons/gray_check.svg';
import Plus from '@/assets/icons/white_plus.svg';
import { useBusinessStore } from '@/store/business.store';
import { useEvaluationStore } from '@/store/report.store';
import { useUserStore } from '@/store/user.store';

type ExtraProps = {
  onApplied?: () => void;
};

const MentorCard = ({
  name,
  careers,
  status,
  tags,
  image,
  workingperiod,
  id,
  onApplied,
}: MentorCardProps & ExtraProps) => {
  const planId = useBusinessStore((s) => s.planId);

  const hasExpertUnlocked = useEvaluationStore((s) => s.hasExpertUnlocked);

  const user = useUserStore((s) => s.user);
  const isMember = !!user;

  const [didApply, setDidApply] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isDone = status === 'done' || didApply;
  const canUseExpert = isMember && hasExpertUnlocked;

  const disabled = !canUseExpert || isDone || uploading || planId == null;

  let disabledReason: string | undefined;
  if (!isMember) {
    disabledReason = '전문가 연결은 회원만 이용할 수 있어요.';
  } else if (!hasExpertUnlocked) {
    disabledReason =
      'AI 리포트에서 70점 이상을 달성하면 전문가 연결을 이용할 수 있어요.';
  } else if (planId == null) {
    disabledReason = '피드백을 요청할 수 있는 사업계획서가 없습니다.';
  }

  const handleClick = async () => {
    if (disabled) return;

    try {
      setUploading(true);

      const response = await getBusinessPlanSubsections(planId!);

      let title = response.data?.title;
      if (!title) {
        try {
          const titleResponse = await getBusinessPlanTitle(planId!);
          if (titleResponse.result === 'SUCCESS' && titleResponse.data) {
            title = titleResponse.data;
          }
        } catch (e) {
          console.warn('제목 조회 실패:', e);
        }
      }

      let pdfFile: File;
      try {
        pdfFile = await generatePdfFromSubsections(response, title);
      } catch (pdfError) {
        console.error('PDF 생성 실패, 빈 파일로 대체합니다:', pdfError);
        pdfFile = new File([new Uint8Array()], 'empty.pdf', {
          type: 'application/pdf',
        });
      }

      await ApplyFeedback({
        expertId: id,
        businessPlanId: planId!,
        file: pdfFile,
      });

      setDidApply(true);
      onApplied?.();
    } catch (e) {
      console.error('전문가 연결 실패:', e);
      alert('전문가 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-80 flex w-full flex-row items-start justify-between gap-6 rounded-xl p-9">
      <div className="flex flex-row gap-6">
        <Image
          src={image || '/images/sampleImage.png'}
          alt={name}
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <div className="flex flex-row items-center gap-2">
            <div className="ds-subtitle font-semibold text-gray-900">
              {name}
              <span className="ds-subtitle ml-1 font-semibold text-gray-700">
                멘토
              </span>
            </div>
            <div className="h-3 w-px bg-gray-300" />
            <div className="ds-subtext font-medium text-gray-700">
              {workingperiod}년 경력 개발자
            </div>
          </div>
          <div className="ds-subtext my-3 font-medium text-gray-600">
            {careers.join(' / ')}
          </div>
          <div className="flex w-full flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <div
                key={`${name}-tag-${tag}-${i}`}
                className="bg-primary-50 items-center rounded-sm px-2 py-0.5"
              >
                <div className="ds-caption text-primary-500 font-medium">
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        disabled={disabled}
        onClick={handleClick}
        className={[
          'ds-text flex w-[156px] items-center justify-center gap-1 rounded-lg px-3 py-2 font-medium',
          disabled
            ? 'bg-gray-200 text-gray-500'
            : 'bg-primary-500 hover:bg-primary-700 cursor-pointer text-white',
        ].join(' ')}
        title={disabled ? disabledReason : undefined}
      >
        {isDone ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        {isDone ? '신청 완료' : uploading ? '신청 중..' : '전문가 연결'}
      </button>
    </div>
  );
};

export default MentorCard;
