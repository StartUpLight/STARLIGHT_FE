"use client";
import { create } from 'zustand';
import { buildSubsectionRequest } from '@/lib/businessFormMapper';
import { postBusinessPlan, postBusinessPlanSubsections } from '@/api/business';
import sections from '@/data/sidebar.json';
import { BusinessStore, ItemContent } from '@/types/business/business.store.type';

let initializingPlanPromise: Promise<number> | null = null;

export const useBusinessStore = create<BusinessStore>((set, get) => ({
    planId: null,
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
                    set({ planId: res.data.businessPlanId });
                    return res.data.businessPlanId;
                }
                throw new Error('Failed to initialize business plan');
            } finally {
                initializingPlanPromise = null;
            }
        })();
        return initializingPlanPromise;
    },
    resetDraft: () => {
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
        set((state) => ({
            contents: {
                ...state.contents,
                [number]: {
                    ...state.contents[number],
                    ...content,
                },
            },
        }));
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

            if (!requestBody.blocks || requestBody.blocks.length === 0) {
                console.log(`[${item.number}] 스킵: 빈 블록`);
                return;
            }

            const req = postBusinessPlanSubsections(targetPlanId as number, requestBody)
                .then(() => { console.log(`[${item.number}] 저장 성공, planId: ${targetPlanId},`); })
                .catch((err) => { console.error(`[${item.number}] 저장 실패`, err); });
            requests.push(req);
        });

        await Promise.allSettled(requests);
    },
}));

