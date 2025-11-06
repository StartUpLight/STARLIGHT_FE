import { create } from 'zustand';
import type { Editor } from '@tiptap/core';

type EditorState = {
  sectionNumber: string;
  features: Editor | null;
  skills: Editor | null;
  goals: Editor | null;
  register: (p: {
    sectionNumber: string;
    features: Editor | null;
    skills: Editor | null;
    goals: Editor | null;
  }) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  sectionNumber: '0',
  features: null,
  skills: null,
  goals: null,
  register: (p) => set(p),
}));
