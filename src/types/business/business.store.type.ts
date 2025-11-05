export interface SelectedItem {
    number: string;
    title: string;
    subtitle: string;
}

// TipTap Editor JSON (간단 정의) - mapper의 JSONNode와 구조 호환
type JSONAttrValue = string | number | boolean | null | undefined;
export type EditorJSON = {
    type?: string;
    text?: string;
    marks?: Array<{ type: string; attrs?: Record<string, JSONAttrValue> }>;
    attrs?: Record<string, JSONAttrValue>;
    content?: EditorJSON[];
};

export interface ItemContent {
    itemName?: string;
    oneLineIntro?: string;
    editorFeatures?: EditorJSON | null; // TipTap JSON
    editorSkills?: EditorJSON | null;
    editorGoals?: EditorJSON | null;
    // 일반 항목 전용
    editorContent?: EditorJSON | null; // TipTap JSON
    checks?: boolean[];
}

export interface BusinessStore {
    planId: number | null;
    initializePlan: () => Promise<number>;
    resetDraft: () => void;
    selectedItem: SelectedItem;
    setSelectedItem: (item: SelectedItem) => void;

    // 각 항목별 내용 저장 (number를 키로 사용)
    contents: Record<string, ItemContent>;

    // 항목 내용 업데이트
    updateItemContent: (number: string, content: Partial<ItemContent>) => void;

    // 항목 내용 가져오기
    getItemContent: (number: string) => ItemContent;

    // 모든 항목 저장 (전역 저장 함수)
    saveAllItems: (planId?: number) => Promise<void>;

    // localStorage에서 contents 복원
    restoreContentsFromStorage: () => Record<string, ItemContent>;

    // localStorage 초기화
    clearStorage: () => void;
}


