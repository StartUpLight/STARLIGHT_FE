import sections from '@/data/sidebar.json';
import type { Section, SectionItem, ChecklistProps } from '@/types/business/checklist.type';

// 사이드바 템플릿에서 문항 번호에 해당하는 체크리스트의 선택 상태를 추출합니다.
export const getChecks = (number: string): boolean[] => {
    const allItems: SectionItem[] = (sections as Section[]).flatMap((section) => section.items);
    const item: SectionItem | undefined = allItems.find((it) => it.number === number);
    if (!item || !item.checklist) return [];
    return (item.checklist as ChecklistProps[]).map((check) => Boolean(check.checked));
};
