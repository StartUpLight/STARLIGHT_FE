import Clipboard from '@/assets/icons/clipboard.svg';
import Clock from '@/assets/icons/clock.svg';
import Case from '@/assets/icons/briefcase.svg';
import { ExpertDetailResponse } from '@/types/expert/expert.detail';
import { formatCareerDate } from '@/util/formatDate';

interface ExpertDetailContentProps {
  expert: ExpertDetailResponse;
}

const ExpertDetailContent = ({ expert }: ExpertDetailContentProps) => {
  return (
    <main className="min-w-0 flex-1 pb-[118px]">
      <div className="flex flex-wrap items-center gap-x-2">
        <h1 className="ds-title font-semibold text-gray-900">
          {expert.name}
          <span className="ds-title ml-1 font-semibold text-gray-700">
            전문가
          </span>
        </h1>
        <span className="text-[12px] text-gray-300">|</span>
        <p className="ds-subtext font-medium text-gray-700">
          {expert.oneLineIntroduction}
        </p>
      </div>

      <div className="mt-[10px] flex flex-wrap gap-[6px]">
        {expert.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-primary-50 text-primary-500 ds-caption rounded-[4px] px-2 py-[2px] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start gap-1 rounded-[8px] bg-gray-100 p-4">
        <div className="flex flex-row gap-[6px]">
          <Clipboard />
          <div className="ds-subtext font-medium text-gray-900">
            지금까지{' '}
            <span className="text-primary-500 ds-subtext font-semibold">
              {expert.applicationCount}번
            </span>{' '}
            평가 신청을 받은 전문가 입니다.
          </div>
        </div>

        <div className="flex flex-row gap-[6px]">
          <Clock />
          <div className="ds-subtext font-medium text-gray-900">
            평균{' '}
            <span className="text-primary-500 ds-subtext font-semibold">
              2일 내
            </span>{' '}
            평가를 받을 수 있는 전문가입니다.
          </div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="ds-text font-semibold text-gray-900">전문가 정보</h2>
        <p className="ds-subtext mt-4 font-medium text-gray-700">
          {expert.detailedIntroduction}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="ds-text font-semibold text-gray-900">경력 사항</h2>
        <div className="mt-2 flex flex-row gap-1">
          <Case />
          <p className="text-primary-500 ds-subtext font-semibold">
            총 경력 {expert.workedPeriod}년
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {expert.careers
            .sort((a, b) => b.orderIndex - a.orderIndex)
            .map((career) => (
              <div key={career.id} className="flex flex-row gap-7">
                <div className="ds-subtext min-w-[152px] font-medium text-gray-700">
                  {formatCareerDate(
                    career.careerStartedAt,
                    career.careerEndedAt
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="ds-subtext font-semibold text-gray-700">
                    {career.careerTitle}
                  </div>
                  <div className="ds-subtext font-medium text-gray-700">
                    {career.careerExplanation}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
};

export default ExpertDetailContent;
