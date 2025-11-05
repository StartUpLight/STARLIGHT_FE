import sections from '@/data/sidebar.json';

// 사이드바 템플릿에서 문항 번호에 해당하는 체크리스트의 선택 상태를 추출합니다.
export const getChecks = (number: string): boolean[] => {
    const allItems = (sections as any[]).flatMap((section: any) => section.items);
    const item = allItems.find((it: any) => it.number === number);
    if (!item || !item.checklist) return [];
    return item.checklist.map((check: any) => check.checked || false);
};
