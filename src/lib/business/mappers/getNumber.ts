import { SubSectionType } from '@/types/business/business.type';

export const getNumberFromSubSectionType = (subSectionType: SubSectionType): string => {
    switch (subSectionType) {
        case 'OVERVIEW_BASIC':
            return '0';
        case 'PROBLEM_BACKGROUND':
            return '1-1';
        case 'PROBLEM_PURPOSE':
            return '1-2';
        case 'PROBLEM_MARKET':
            return '1-3';
        case 'FEASIBILITY_STRATEGY':
            return '2-1';
        case 'FEASIBILITY_MARKET':
            return '2-2';
        case 'GROWTH_MODEL':
            return '3-1';
        case 'GROWTH_FUNDING':
            return '3-2';
        case 'GROWTH_ENTRY':
            return '3-3';
        case 'TEAM_FOUNDER':
            return '4-1';
        case 'TEAM_MEMBERS':
            return '4-2';
        default:
            return '0';
    }
};