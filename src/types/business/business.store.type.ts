export interface SelectedItem {
  number: string;
  title: string;
  subtitle: string;
}

// TipTap Editor JSON (간단 정의) - mapper의 JSONNode와 구조 호환
type JSONAttrValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (number | null)[];
export type EditorJSON = {
  type?: string;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, JSONAttrValue> }>;
  attrs?: Record<string, JSONAttrValue>;
  content?: EditorJSON[];
};

export interface ItemContent {
  itemName?: string | EditorJSON | null;
  oneLineIntro?: string | EditorJSON | null;
  editorFeatures?: EditorJSON | null; // TipTap JSON
  editorSkills?: EditorJSON | null;
  editorGoals?: EditorJSON | null;
  // 일반 항목 전용
  editorContent?: EditorJSON | null; // TipTap JSON
  checks?: boolean[];
}

export interface BusinessStore {
  planId: number | null;
  setPlanId: (planId: number) => void;
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
  hydrateContents: (payload: { contents?: Record<string, ItemContent>; title?: string }) => void;

  // 모든 항목 저장 (전역 저장 함수)
  saveAllItems: (planId?: number) => Promise<void>;
  // 단일 항목만 저장 (자동 저장용)
  saveSingleItem: (planId: number, number: string) => Promise<void>;

  // API에서 contents 불러오기
  loadContentsFromAPI: (planId: number) => Promise<Record<string, ItemContent>>;

  // 미리보기 모드
  isPreview: boolean;
  setPreview: (isPreview: boolean) => void;

  // 저장 시간
  lastSavedTime: Date | null;
  setLastSavedTime: (time: Date | null) => void;

  // 저장 중 상태
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;

  isGrading: boolean;
  setIsGrading: (isGrading: boolean) => void;

  // 제목 관리
  title: string;
  setTitle: (title: string) => void;
  loadTitleFromAPI: (planId: number) => Promise<string | null>;
}
