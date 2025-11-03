export interface SelectedItem {
    number: string;
    title: string;
    subtitle: string;
}
export interface ItemContent {
    itemName?: string;
    oneLineIntro?: string;
    editorFeatures?: any; // TipTap JSON
    editorSkills?: any;
    editorGoals?: any;
    // 일반 항목 전용
    editorContent?: any; // TipTap JSON
}

export interface BusinessStore {
    selectedItem: SelectedItem;
    setSelectedItem: (item: SelectedItem) => void;

    // 각 항목별 내용 저장 (number를 키로 사용)
    contents: Record<string, ItemContent>;

    // 항목 내용 업데이트
    updateItemContent: (number: string, content: Partial<ItemContent>) => void;

    // 항목 내용 가져오기
    getItemContent: (number: string) => ItemContent;

    // 모든 항목 저장 (전역 저장 함수)
    saveAllItems: (planId: number) => Promise<void>;
}


