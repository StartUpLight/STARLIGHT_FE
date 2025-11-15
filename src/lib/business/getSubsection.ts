import { SubSectionType } from '@/types/business/business.type';

// 문항 번호를 서버 스펙의 subSectionType 문자열로 매핑합니다.
export const getSubSectionTypeFromNumber = (number: string): SubSectionType => {
    switch (number) {
        case '0':
            return 'OVERVIEW_BASIC';
        case '1-1':
            return 'PROBLEM_BACKGROUND';
        case '1-2':
            return 'PROBLEM_PURPOSE';
        case '1-3':
            return 'PROBLEM_MARKET';
        case '2-1':
            return 'FEASIBILITY_STRATEGY';
        case '2-2':
            return 'FEASIBILITY_MARKET';
        case '3-1':
            return 'GROWTH_MODEL';
        case '3-2':
            return 'GROWTH_FUNDING';
        case '3-3':
            return 'GROWTH_ENTRY';
        case '4-1':
            return 'TEAM_FOUNDER';
        case '4-2':
            return 'TEAM_MEMBERS';
        default:
            return 'OVERVIEW_BASIC';
    }
};


