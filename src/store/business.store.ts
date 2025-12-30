'use client';
import { create } from 'zustand';
import { buildSubsectionRequest } from '@/lib/business/requestBuilder';
import {
  postBusinessPlan,
  postBusinessPlanSubsections,
  getBusinessPlanSubsection,
  getBusinessPlanTitle,
} from '@/api/business';
import sections from '@/data/sidebar.json';
import {
  BusinessStore,
  ItemContent,
} from '@/types/business/business.store.type';
import { convertResponseToItemContent } from '@/lib/business/converter/responseMapper';
import { getSubSectionTypeFromNumber } from '@/lib/business/mappers/getSubsection';

const PLAN_ID_KEY = 'businessPlanId';

// localStorage에서 planId 복원
const loadPlanIdFromStorage = (): number | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(PLAN_ID_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

// localStorage에 planId 저장
const savePlanIdToStorage = (planId: number) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLAN_ID_KEY, String(planId));
  } catch (error) {
    console.error('localStorage 저장 실패:', error);
  }
};

let initializingPlanPromise: Promise<number> | null = null;
let currentLoadAbortController: AbortController | null = null;

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  planId: loadPlanIdFromStorage(),
  setPlanId: (planId: number) => {
    const currentPlanId = get().planId;
    // planId가 변경될 때만 contents 초기화
    if (currentPlanId !== planId) {
      // 이전 로딩 요청 취소
      if (currentLoadAbortController) {
        currentLoadAbortController.abort();
        currentLoadAbortController = null;
      }
      // contents 즉시 초기화하여 이전 데이터가 보이지 않도록 함
      set({
        planId,
        contents: {},
        title: '',
      });
    }
    savePlanIdToStorage(planId);
  },
  initializePlan: async () => {
    const current = get().planId;
    if (typeof current === 'number' && current > 0) return current;
    if (initializingPlanPromise) {
      return initializingPlanPromise;
    }
    initializingPlanPromise = (async () => {
      try {
        const res = await postBusinessPlan();
        if (res.result === 'SUCCESS' && res.data?.businessPlanId) {
          const newPlanId = res.data.businessPlanId;
          set({ planId: newPlanId });
          // localStorage에 저장
          savePlanIdToStorage(newPlanId);
          return newPlanId;
        }
        throw new Error('Failed to initialize business plan');
      } finally {
        initializingPlanPromise = null;
      }
    })();
    return initializingPlanPromise;
  },
  // API에서 모든 섹션 데이터 불러오기
  loadContentsFromAPI: async (planId: number) => {
    // 이전 로딩 요청 취소
    if (currentLoadAbortController) {
      currentLoadAbortController.abort();
    }

    // 새로운 AbortController 생성
    const abortController = new AbortController();
    currentLoadAbortController = abortController;

    // 현재 store의 planId와 요청한 planId가 일치하는지 확인
    const currentPlanId = get().planId;
    if (currentPlanId !== planId) {
      console.warn(
        `loadContentsFromAPI: planId 불일치 (store: ${currentPlanId}, 요청: ${planId}). 요청 취소.`
      );
      abortController.abort();
      return {};
    }

    type SidebarItem = {
      name: string;
      number: string;
      title: string;
      subtitle: string;
    };
    type SidebarSection = { title: string; items: SidebarItem[] };
    const allItems = (sections as SidebarSection[]).flatMap(
      (section) => section.items
    );

    const contents: Record<string, ItemContent> = {};

    // 모든 섹션을 병렬로 불러오기
    const requests = allItems.map(async (item: SidebarItem) => {
      // 요청이 취소되었는지 확인
      if (abortController.signal.aborted) {
        return;
      }

      try {
        const subSectionType = getSubSectionTypeFromNumber(item.number);
        const response = await getBusinessPlanSubsection(
          planId,
          subSectionType,
          abortController.signal
        );

        // 요청이 취소되었는지 다시 확인
        if (abortController.signal.aborted) {
          return;
        }

        if (response.result === 'SUCCESS' && response.data?.content) {
          const content = response.data.content;
          const itemContent = convertResponseToItemContent(
            content.blocks || [],
            content.checks
          );
          contents[item.number] = itemContent;
        }
      } catch (error) {
        const err = error as { name?: string; code?: string; message?: string };
        const isCanceled =
          err?.name === 'AbortError' ||
          err?.name === 'CanceledError' ||
          err?.code === 'ERR_CANCELED' ||
          (err?.message && err.message.includes('canceled'));
        if (isCanceled) {
          return;
        }
        //console.error(`[${item.number}] 데이터 불러오기 실패:`, error);
      }
    });

    await Promise.allSettled(requests);

    // 요청이 취소되었는지 최종 확인
    if (abortController.signal.aborted) {
      return {};
    }

    // planId가 여전히 일치하는지 확인 (로딩 중에 변경되었을 수 있음)
    const finalPlanId = get().planId;
    if (finalPlanId !== planId) {
      console.warn(
        `loadContentsFromAPI: 로딩 완료 후 planId 불일치 (store: ${finalPlanId}, 요청: ${planId}). 데이터 무시.`
      );
      currentLoadAbortController = null;
      return {};
    }

    set({ contents });
    currentLoadAbortController = null;
    return contents;
  },
  resetDraft: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PLAN_ID_KEY);
      localStorage.removeItem('businessPlanTitle');
    }
    set({
      planId: null,
      selectedItem: {
        number: '0',
        title: '개요',
        subtitle:
          '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
      },
      contents: {},
      title: '',
    });
  },
  selectedItem: {
    number: '0',
    title: '개요',
    subtitle:
      '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
  },
  setSelectedItem: (item) => set({ selectedItem: item }),

  contents: {},

  updateItemContent: (number: string, content: Partial<ItemContent>) => {
    set((state) => {
      const newContents = {
        ...state.contents,
        [number]: {
          ...state.contents[number],
          ...content,
        },
      };
      return { contents: newContents };
    });
  },

  getItemContent: (number: string) => {
    return get().contents[number] || {};
  },
  hydrateContents: (
    payload: { contents?: Record<string, ItemContent>; title?: string } = {}
  ) => {
    set((state) => ({
      contents: payload?.contents ?? state.contents,
      title: typeof payload?.title === 'string' ? payload.title : state.title,
    }));
  },

  saveAllItems: async (planId?: number) => {
    let targetPlanId = planId;
    if (!targetPlanId) {
      targetPlanId = await get().initializePlan();
    }
    const { contents } = get();

    type SidebarChecklist = {
      title: string;
      content: string;
      checked?: boolean;
    };
    type SidebarItem = {
      name: string;
      number: string;
      title: string;
      subtitle: string;
      checklist?: SidebarChecklist[];
    };
    type SidebarSection = { title: string; items: SidebarItem[] };
    const allItems = (sections as SidebarSection[]).flatMap(
      (section) => section.items
    );

    const requests: Promise<void>[] = [];
    allItems.forEach((item: SidebarItem) => {
      const content = contents[item.number] || {};
      const requestBody = buildSubsectionRequest(
        item.number,
        item.title,
        content
      );

      // contents에 해당 항목이 존재하면(한 번이라도 작성한 적이 있으면) 빈 값이어도 저장 요청 전송
      const hasContentHistory = item.number in contents;

      if (!requestBody.blocks || requestBody.blocks.length === 0) {
        if (!hasContentHistory) {
          return;
        }
      }

      const req = postBusinessPlanSubsections(
        targetPlanId as number,
        requestBody
      )
        .then(() => {
          console.log(`[${item.number}] 저장 성공, planId: ${targetPlanId},`);
        })
        .catch((err) => {
          console.error(`[${item.number}] 저장 실패`, err);
        });
      requests.push(req);
    });

    await Promise.allSettled(requests);

    // 저장 성공 시 시간 업데이트
    set({ lastSavedTime: new Date() });
  },

  // 단일 항목만 저장 (자동 저장용)
  saveSingleItem: async (planId: number, number: string) => {
    const { contents } = get();

    type SidebarChecklist = {
      title: string;
      content: string;
      checked?: boolean;
    };
    type SidebarItem = {
      name: string;
      number: string;
      title: string;
      subtitle: string;
      checklist?: SidebarChecklist[];
    };
    type SidebarSection = { title: string; items: SidebarItem[] };
    const allItems = (sections as SidebarSection[]).flatMap(
      (section) => section.items
    );

    // 해당 number에 맞는 항목 찾기
    const item = allItems.find((item: SidebarItem) => item.number === number);
    if (!item) {
      console.warn(`[${number}] 항목을 찾을 수 없습니다.`);
      return;
    }

    const content = contents[number] || {};
    const requestBody = buildSubsectionRequest(number, item.title, content);

    // contents에 해당 항목이 존재하면(한 번이라도 작성한 적이 있으면) 빈 값이어도 저장 요청 전송
    const hasContentHistory = number in contents;

    if (!requestBody.blocks || requestBody.blocks.length === 0) {
      if (!hasContentHistory) {
        return;
      }
    }

    try {
      await postBusinessPlanSubsections(planId, requestBody);
      console.log(`[${number}] 자동 저장 성공, planId: ${planId}`);
      // 저장 성공 시 시간 업데이트
      set({ lastSavedTime: new Date() });
    } catch (err) {
      console.error(`[${number}] 자동 저장 실패`, err);
    }
  },

  // 미리보기 모드
  isPreview: false,
  setPreview: (isPreview: boolean) => set({ isPreview }),

  // 저장 시간
  lastSavedTime: null,
  setLastSavedTime: (time: Date | null) => set({ lastSavedTime: time }),

  // 저장 중 상태
  isSaving: false,
  setIsSaving: (isSaving: boolean) => set({ isSaving }),

  isGrading: false,
  setIsGrading: (isGrading: boolean) => set({ isGrading }),

  // 제목 관리
  title: '',
  setTitle: (title: string) => set({ title }),
  loadTitleFromAPI: async (planId: number) => {
    try {
      const response = await getBusinessPlanTitle(planId);
      if (response.result === 'SUCCESS' && response.data) {
        const title = response.data;
        set({ title });
        return title;
      }
      return null;
    } catch (error) {
      console.error('제목 불러오기 실패:', error);
      return null;
    }
  },
}));
