"use client";
import { create } from 'zustand';
import { buildSubsectionBody } from '@/lib/businessFormMapper';
import { postBusinessPlanSubsections } from '@/api/business';
import sections from '@/data/sidebar.json';
import { BusinessStore, ItemContent } from '@/types/business/business.store.type';

export const useBusinessStore = create<BusinessStore>((set, get) => ({
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

    saveAllItems: async (planId: number) => {
        const { contents } = get();

        const allItems = sections.flatMap((section: any) => section.items);

        const requests: Promise<any>[] = [];
        allItems.forEach((item) => {
            const content = contents[item.number] || {};
            const requestBody = buildSubsectionBody(item.number, item.title, content);

            if (!requestBody.blocks || requestBody.blocks.length === 0) {
                console.log(`[${item.number}] 스킵: 빈 블록`);
                return;
            }

            requests.push(
                postBusinessPlanSubsections(planId, {
                    ...requestBody,
                }).then(() => {
                    console.log(`[${item.number}] 저장 성공`);
                }).catch((err) => {
                    console.error(`[${item.number}] 저장 실패`, err);
                })
            );
        });

        await Promise.allSettled(requests);
    },
}));

