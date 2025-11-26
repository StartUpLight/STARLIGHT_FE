'use client';

import { create } from 'zustand';
import { MentorCardProps } from '@/types/expert/expert.props';

export type SelectedMentor = Pick<
  MentorCardProps,
  'id' | 'name' | 'careers' | 'tags' | 'image' | 'workingperiod' | 'image'
>;

type ExpertStore = {
  selectedMentor: SelectedMentor | null;
  setSelectedMentor: (mentor: SelectedMentor | null) => void;
};

export const useExpertStore = create<ExpertStore>((set) => ({
  selectedMentor: null,
  setSelectedMentor: (mentor) => set({ selectedMentor: mentor }),
}));
