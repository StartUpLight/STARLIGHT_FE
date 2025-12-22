'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useGetMyBusinessPlans } from '@/hooks/queries/useMy';
import { BusinessPlanItem } from '@/types/mypage/mypage.type';
import { useBusinessStore } from '@/store/business.store';
import DropDownIcon from '@/assets/icons/drop_down.svg';
import PurpleDropDownIcon from '@/assets/icons/puple_drop_down.svg';
import { useGradeQueries } from '@/hooks/queries/useGradeQueries';

const BusinessPlanDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const planId = useBusinessStore((s) => s.planId);
  const setPlanId = useBusinessStore((s) => s.setPlanId);

  const { data: businessPlansData, isLoading } = useGetMyBusinessPlans({
    page: 1,
    size: 100,
  });

  const allPlans: BusinessPlanItem[] = businessPlansData?.data?.content ?? [];
  const gradeQueries = useGradeQueries(allPlans);

  const plans = useMemo(() => {
    return allPlans.filter((plan, index) => {
      const gradeData = gradeQueries[index]?.data;
      const totalScore = gradeData?.data?.totalScore ?? 0;
      return totalScore >= 70;
    });
  }, [allPlans, gradeQueries]);

  const selectedPlan = plans.find((plan) => plan.businessPlanId === planId);

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

  const handleSelect = (plan: BusinessPlanItem) => {
    setPlanId(plan.businessPlanId);
    setIsOpen(false);
  };

  const isGradesLoading = gradeQueries.some((query) => query.isLoading);

  if (isLoading || isGradesLoading) {
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
            ? `${selectedPlan.title}`
            : plans.length > 0
              ? `${plans[0].title}`
              : '사업계획서를 선택하세요'}
        </span>
        {selectedPlan ? (
          <PurpleDropDownIcon className="h-[7px] w-[10px]" />
        ) : (
          <DropDownIcon className="h-[7px] w-[10px]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 h-[222px] w-[276px] overflow-y-auto rounded-lg bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.10)]">
          {plans.length === 0 ? (
            <div className="ds-subtext px-3 py-2 font-medium text-gray-800">
              등록된 사업계획서가 없습니다.
            </div>
          ) : (
            plans.map((plan) => {
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
                  {plan.title}
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
