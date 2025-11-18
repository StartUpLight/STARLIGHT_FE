'use client';
import { useState } from 'react';
import { MentorCardProps } from '@/types/expert/expert.props';
import { ApplyFeedback } from '@/api/expert';
import { getBusinessPlanSubsections, getBusinessPlanTitle } from '@/api/business';
import { generatePdfFromSubsections } from '@/lib/generatePdf';
import Image from 'next/image';
import Check from '@/assets/icons/gray_check.svg';
import Plus from '@/assets/icons/white_plus.svg';
import { useBusinessStore } from '@/store/business.store';

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
  const [didApply, setDidApply] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isDone = status === 'done' || didApply;
  const disabled = isDone || uploading || planId == null;

  const handleClick = async () => {
    if (disabled) return;

    try {
      setUploading(true);

      // 모든 서브섹션 조회
      const response = await getBusinessPlanSubsections(planId!);

      // 제목 조회
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

      // PDF 생성 (Preview와 동일한 방식)
      const pdfFile = await generatePdfFromSubsections(response, title);

      // PDF 다운로드
      // const pdfUrl = URL.createObjectURL(pdfFile);
      // const link = document.createElement('a');
      // link.href = pdfUrl;
      // link.download = `사업계획서_${title || '스타라이트'}_${new Date().getTime()}.pdf`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(pdfUrl);

      // 전문가 연결 요청
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
    <div className="bg-gray-80 flex w-full flex-row items-start justify-between gap-6 rounded-[12px] p-9">
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
          <div className="flex w-full flex-wrap gap-[6px]">
            {tags.map((tag, i) => (
              <div
                key={`${name}-tag-${tag}-${i}`}
                className="bg-primary-50 items-center rounded-[4px] px-2 py-[2px]"
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
          'ds-text flex w-[156px] items-center justify-center gap-1 rounded-[8px] px-3 py-2 font-medium',
          disabled
            ? 'bg-gray-200 text-gray-500'
            : 'bg-primary-500 hover:bg-primary-700 cursor-pointer text-white',
        ].join(' ')}
        title={
          planId == null
            ? '피드백을 요청할 수 있는 사업계획서가 없습니다.'
            : undefined
        }
      >
        {isDone ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        {isDone ? '신청 완료' : uploading ? '신청 중..' : '전문가 연결'}
      </button>
    </div>
  );
};

export default MentorCard;
