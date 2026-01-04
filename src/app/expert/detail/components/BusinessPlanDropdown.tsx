'use client';

import { useState, useRef, useEffect } from 'react';
import { useExpertReportDetail } from '@/hooks/queries/useExpert';
import { useBusinessStore } from '@/store/business.store';
import { useUserStore } from '@/store/user.store';
import DropDownIcon from '@/assets/icons/drop_down.svg';
import PurpleDropDownIcon from '@/assets/icons/puple_drop_down.svg';
import { ExpertReportDetailResponse } from '@/types/expert/expert.detail';

interface BusinessPlanDropdownProps {
  expertId: number;
  hasNoPlans?: boolean;
}

const BusinessPlanDropdown = ({
  expertId,
  hasNoPlans = false,
}: BusinessPlanDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const planId = useBusinessStore((s) => s.planId);
  const setPlanId = useBusinessStore((s) => s.setPlanId);
  const user = useUserStore((s) => s.user);

  const { data: reportDetails = [], isLoading } = useExpertReportDetail(
    expertId,
    { enabled: !!user }
  );

  const selectedPlan = reportDetails.find(
    (plan) => plan.businessPlanId === planId
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (plan: ExpertReportDetailResponse) => {
    setPlanId(plan.businessPlanId);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800">
        로딩 중
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`ds-subtext flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left font-medium outline-none ${
          selectedPlan
            ? 'bg-primary-50 text-primary-500'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        <span>
          {selectedPlan
            ? `${selectedPlan.businessPlanTitle}`
            : hasNoPlans
              ? '사업계획서를 먼저 작성해주세요.'
              : '사업계획서를 선택하세요'}
        </span>
        {selectedPlan ? (
          <PurpleDropDownIcon className="h-[7px] w-[10px]" />
        ) : (
          <DropDownIcon className="h-[7px] w-[10px]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-[300px] w-[276px] overflow-y-auto rounded-lg bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.10)]">
          {reportDetails.length === 0 ? (
            <div className="ds-subtext px-3 py-2 font-medium text-gray-800">
              등록된 사업계획서가 없습니다.
            </div>
          ) : (
            reportDetails.map((plan) => {
              const isSelected = plan.businessPlanId === planId;
              return (
                <button
                  key={plan.businessPlanId}
                  type="button"
                  onClick={() => handleSelect(plan)}
                  className={`ds-subtext w-full cursor-pointer px-3 py-2 text-left font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary-50 text-primary-500'
                      : 'hover:bg-primary-50 bg-white text-gray-800'
                  }`}
                >
                  {plan.businessPlanTitle}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessPlanDropdown;
