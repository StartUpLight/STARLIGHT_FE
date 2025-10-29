'use client';
import { create } from 'zustand';

interface SelectedItem {
    number: string;
    title: string;
    subtitle: string;
}

interface BusinessStore {
    selectedItem: SelectedItem;
    setSelectedItem: (item: SelectedItem) => void;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
    selectedItem: {
        number: '0',
        title: '개요',
        subtitle: '구성원의 담당업무, 사업화와 관련하여 보유한 전문성(기술력, 노하우) 위주로 작성.',
    },
    setSelectedItem: (item) => set({ selectedItem: item }),
}));

