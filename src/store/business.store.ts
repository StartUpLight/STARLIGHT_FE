'use client';
import { create } from 'zustand';
import { createSaveRequestBodyFromJson } from '@/lib/api/business';
import sections from '@/data/sidebar.json';

interface SelectedItem {
    number: string;
    title: string;
    subtitle: string;
}

// 각 항목별 에디터 내용 저장
interface ItemContent {
    // 개요(number="0") 전용
    itemName?: string;
    oneLineIntro?: string;
    editorFeatures?: any; // TipTap JSON
    editorSkills?: any;
    editorGoals?: any;

    // 일반 항목 전용
    editorContent?: any; // TipTap JSON
}

interface BusinessStore {
    selectedItem: SelectedItem;
    setSelectedItem: (item: SelectedItem) => void;

    // 각 항목별 내용 저장 (number를 키로 사용)
    contents: Record<string, ItemContent>;

    // 항목 내용 업데이트
    updateItemContent: (number: string, content: Partial<ItemContent>) => void;

    // 항목 내용 가져오기
    getItemContent: (number: string) => ItemContent;

    // 모든 항목 저장 (전역 저장 함수)
    saveAllItems: (planId: number) => void;
}

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

    saveAllItems: (planId: number) => {
        const { contents } = get();

        // 모든 항목 가져오기
        const allItems = sections.flatMap((section: any) => section.items);

        // 각 항목에 대해 requestBody 생성 (빈 블록은 제외)
        allItems.forEach((item) => {
            const content = contents[item.number] || {};

            const requestBody = createSaveRequestBodyFromJson(
                item.number,
                item.title,
                content.itemName || '',
                content.oneLineIntro || '',
                content.editorFeatures || null,
                content.editorSkills || null,
                content.editorGoals || null,
                content.editorContent || null
            );

            // 빈 blocks인 경우 스킵
            if (!requestBody.blocks || requestBody.blocks.length === 0) {
                console.log(`[${item.number}] 스킵: 빈 블록`);
                return;
            }

            // 각 블록의 content가 비어있는지 확인
            const hasValidContent = requestBody.blocks.some((block: any) => {
                return block.content &&
                    block.content.length > 0 &&
                    block.content.some((item: any) => {
                        if (item.type === 'text') {
                            return item.value && item.value.trim() !== '';
                        }
                        // 표나 이미지는 항상 유효하다고 간주
                        return true;
                    });
            });

            if (!hasValidContent) {
                console.log(`[${item.number}] 스킵: 유효한 내용 없음`);
                return;
            }

            // requestBody 콘솔에 출력 (API 요청은 하지 않음)
            console.log(`[${item.number}] 요청 바디:`, JSON.stringify(requestBody, null, 2));
        });
    },
}));

