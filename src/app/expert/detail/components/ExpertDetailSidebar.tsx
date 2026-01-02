'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useExpertStore } from '@/store/expert.store';
import { useBusinessStore } from '@/store/business.store';
import { useEvaluationStore } from '@/store/report.store';
import { useUserStore } from '@/store/user.store';
import { useExpertReportDetail } from '@/hooks/queries/useExpert';
import GrayPlus from '@/assets/icons/gray_plus.svg';
import WhitePlus from '@/assets/icons/white_plus.svg';
import BusinessPlanDropdown from './BusinessPlanDropdown';
import { ExpertDetailResponse } from '@/types/expert/expert.detail';

interface ExpertDetailSidebarProps {
  expert: ExpertDetailResponse;
}

const ExpertDetailSidebar = ({ expert }: ExpertDetailSidebarProps) => {
  const router = useRouter();
  const { setSelectedMentor } = useExpertStore();
  const planId = useBusinessStore((s) => s.planId);
  const hasExpertUnlocked = useEvaluationStore((s) => s.hasExpertUnlocked);
  const user = useUserStore((s) => s.user);
  const isMember = !!user;

  const { data: reportDetails = [] } = useExpertReportDetail(expert.id, {
    enabled: isMember,
  });

  const selectedPlan = useMemo(() => {
    return reportDetails.find((plan) => plan.businessPlanId === planId);
  }, [reportDetails, planId]);

  const canUseExpert = isMember && hasExpertUnlocked;
  const isSelectedPlanOver70 = selectedPlan?.isOver70 ?? false;
  const shouldShowCreateButton =
    !isMember || (isMember && reportDetails.length === 0);

  const disabled = shouldShowCreateButton
    ? false
    : !canUseExpert || !planId || !isSelectedPlanOver70;

  const handleConnect = () => {
    if (!expert) return;

    if (shouldShowCreateButton) {
      router.push('/business');
      return;
    }

    if (disabled) return;

    setSelectedMentor({
      id: expert.id,
      name: expert.name,
      careers: expert.careers.map((career) => ({
        orderIndex: career.orderIndex,
        careerTitle: career.careerTitle,
      })),
      tags: expert.tags,
      image: expert.profileImageUrl,
      workingperiod: expert.workedPeriod,
    });

    router.push(`/pay`);
  };

  return (
    <aside className="flex h-[300px] w-[324px] flex-col items-start rounded-[12px] border border-gray-200 p-6">
      <h1 className="ds-subtitle font-semibold text-gray-900">
        이 전문가의 피드백이 필요하신가요?
      </h1>
      <div className="ds-subtext mt-3 font-medium text-gray-600">
        지금 바로 사업계획서 피드백을 받아보세요.
        <br />
        전문가의 기준으로 사업계획서를 점검할 수 있어요
      </div>

      <div className="mt-8 w-full">
        <BusinessPlanDropdown
          expertId={expert.id}
          hasNoPlans={shouldShowCreateButton}
        />
        <p className="ds-caption text-primary-500 mt-2 font-medium">
          * 70점 이상의 사업계획서만 전문가 연결이 가능해요.
        </p>
      </div>

      <button
        onClick={handleConnect}
        disabled={shouldShowCreateButton ? false : disabled}
        className={`ds-text mt-8 flex w-full items-center justify-center gap-1 rounded-lg px-8 py-[10px] font-medium ${
          shouldShowCreateButton
            ? 'bg-primary-500 hover:bg-primary-700 cursor-pointer text-white'
            : disabled
              ? 'cursor-not-allowed bg-gray-200 text-gray-500'
              : 'bg-primary-500 hover:bg-primary-700 cursor-pointer text-white'
        }`}
      >
        {shouldShowCreateButton ? (
          <WhitePlus className="h-5 w-5 shrink-0" />
        ) : disabled ? (
          <GrayPlus className="h-5 w-5 shrink-0" />
        ) : (
          <WhitePlus className="h-5 w-5 shrink-0" />
        )}
        <span>
          {shouldShowCreateButton ? '사업계획서 생성' : '전문가 연결'}
        </span>
      </button>
    </aside>
  );
};

export default ExpertDetailSidebar;
