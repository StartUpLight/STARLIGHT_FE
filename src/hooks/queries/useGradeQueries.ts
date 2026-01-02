import { getGrade } from '@/api/business';
import { useQueries } from '@tanstack/react-query';
import { BusinessPlanItem } from '@/types/mypage/mypage.type';

export function useGradeQueries(allPlans: BusinessPlanItem[]) {
  return useQueries({
    queries: allPlans.map((plan) => ({
      queryKey: ['GetAiReport', plan.businessPlanId],
      queryFn: () => getGrade(plan.businessPlanId),
      enabled: !!plan.businessPlanId,
    })),
  });
}
