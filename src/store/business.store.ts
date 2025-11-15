"use client";
import { create } from 'zustand';
import { buildSubsectionRequest } from '@/lib/business/requestBuilder';
import { postBusinessPlan, postBusinessPlanSubsections, getBusinessPlanSubsection } from '@/api/business';
import sections from '@/data/sidebar.json';
import { BusinessStore, ItemContent } from '@/types/business/business.store.type';
import { convertResponseToItemContent } from '@/lib/business/converter/responseMapper';
import { getSubSectionTypeFromNumber } from '@/lib/business/getSubsection';

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

export const useBusinessStore = create<BusinessStore>((set, get) => ({
    planId: loadPlanIdFromStorage(),
    setPlanId: (planId: number) => {
        set({ planId });
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
        type SidebarItem = { name: string; number: string; title: string; subtitle: string };
        type SidebarSection = { title: string; items: SidebarItem[] };
        const allItems = (sections as SidebarSection[]).flatMap((section) => section.items);

        const contents: Record<string, ItemContent> = {};

        // 모든 섹션을 병렬로 불러오기
        const requests = allItems.map(async (item: SidebarItem) => {
            try {
                const subSectionType = getSubSectionTypeFromNumber(item.number);
                const response = await getBusinessPlanSubsection(planId, subSectionType);
                if (response.result === 'SUCCESS' && response.data?.content) {
                    const content = response.data.content;
                    const itemContent = convertResponseToItemContent(
                        content.blocks || [],
                        content.checks
                    );
                    contents[item.number] = itemContent;
                }
            } catch (error) {
                console.error(`[${item.number}] 데이터 불러오기 실패:`, error);
            }
        });

        await Promise.allSettled(requests);
        set({ contents });
        return contents;
    },
    // localStorage 초기화
    clearStorage: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(PLAN_ID_KEY);
            localStorage.removeItem('businessPlanTitle');
        }
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

            // contents에 해당 항목이 존재하면(한 번이라도 작성한 적이 있으면) 빈 값이어도 저장 요청 전송
            const hasContentHistory = item.number in contents;

            if (!requestBody.blocks || requestBody.blocks.length === 0) {
                if (!hasContentHistory) {
                    //console.log(`[${item.number}] 스킵: 빈 블록이고 작성 이력 없음`);
                    return;
                }
                //console.log(`[${item.number}] 빈 값이지만 저장 요청 전송 (작성 이력 있음)`);
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

