"use client";
import { create } from 'zustand';
import { buildSubsectionRequest } from '@/lib/business/requestBuilder';
import { postBusinessPlan, postBusinessPlanSubsections } from '@/api/business';
import sections from '@/data/sidebar.json';
import { BusinessStore, ItemContent } from '@/types/business/business.store.type';

const STORAGE_KEY = 'businessPlanContents';
const PLAN_ID_KEY = 'businessPlanId';

// localStorage에서 contents 복원
const loadContentsFromStorage = (): Record<string, ItemContent> => {
    if (typeof window === 'undefined') return {};
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

// localStorage에 contents 저장
const saveContentsToStorage = (contents: Record<string, ItemContent>) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
    } catch (error) {
        console.error('localStorage 저장 실패:', error);
    }
};

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

export const useBusinessStore = create<BusinessStore>((set, get) => ({
    planId: loadPlanIdFromStorage(),
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
    // localStorage에서 contents 복원
    restoreContentsFromStorage: () => {
        const contents = loadContentsFromStorage();
        set({ contents });
        return contents;
    },
    // localStorage 초기화
    clearStorage: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(PLAN_ID_KEY);
            localStorage.removeItem('businessPlanTitle');
        }
    },
    resetDraft: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(PLAN_ID_KEY);
            localStorage.removeItem('businessPlanTitle');
        }
        set({
            planId: null,
            selectedItem: {
                number: '0',
                title: '개요',
                subtitle: '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
            },
            contents: {},
        });
    },
    selectedItem: {
        number: '0',
        title: '개요',
        subtitle: '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
    },
    setSelectedItem: (item) => set({ selectedItem: item }),

    contents: loadContentsFromStorage(),

    updateItemContent: (number: string, content: Partial<ItemContent>) => {
        set((state) => {
            const newContents = {
                ...state.contents,
                [number]: {
                    ...state.contents[number],
                    ...content,
                },
            };
            // localStorage에 자동 저장
            saveContentsToStorage(newContents);
            return { contents: newContents };
        });
    },

    getItemContent: (number: string) => {
        return get().contents[number] || {};
    },

    saveAllItems: async (planId?: number) => {
        let targetPlanId = planId;
        if (!targetPlanId) {
            targetPlanId = await get().initializePlan();
        }
        const { contents } = get();

        type SidebarChecklist = { title: string; content: string; checked?: boolean };
        type SidebarItem = { name: string; number: string; title: string; subtitle: string; checklist?: SidebarChecklist[] };
        type SidebarSection = { title: string; items: SidebarItem[] };
        const allItems = (sections as SidebarSection[]).flatMap((section) => section.items);

        const requests: Promise<void>[] = [];
        allItems.forEach((item: SidebarItem) => {
            const content = contents[item.number] || {};
            const requestBody = buildSubsectionRequest(item.number, item.title, content);
            //console.log(`[${item.number}] requestBody:`, JSON.stringify(requestBody, null, 2));

            if (!requestBody.blocks || requestBody.blocks.length === 0) {
                //console.log(`[${item.number}] 스킵: 빈 블록`);
                return;
            }

            const req = postBusinessPlanSubsections(targetPlanId as number, requestBody)
                .then(() => { console.log(`[${item.number}] 저장 성공, planId: ${targetPlanId},`); })
                .catch((err) => { console.error(`[${item.number}] 저장 실패`, err); });
            requests.push(req);
        });

        await Promise.allSettled(requests);

        // 저장 성공 시 시간 업데이트
        set({ lastSavedTime: new Date() });
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
}));

