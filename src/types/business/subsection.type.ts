import { SubSectionType } from './business.type';

export const getSubSectionType = (num: string): SubSectionType | null => {
  const mapping: Record<string, SubSectionType> = {
    '0': 'OVERVIEW_BASIC',
    '1-1': 'PROBLEM_BACKGROUND',
    '1-2': 'PROBLEM_PURPOSE',
    '1-3': 'PROBLEM_MARKET',
    '2-1': 'FEASIBILITY_STRATEGY',
    '2-2': 'FEASIBILITY_MARKET',
    '3-1': 'GROWTH_MODEL',
    '3-2': 'GROWTH_FUNDING',
    '3-3': 'GROWTH_ENTRY',
    '4-1': 'TEAM_FOUNDER',
    '4-2': 'TEAM_MEMBERS',
  };
  return mapping[num] || null;
};
