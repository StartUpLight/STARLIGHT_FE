import { create } from 'zustand';

export type SpellCheckItem = {
  id: number;
  original: string;
  corrected: string;
  open: boolean;
  severity?: string;
  context?: string;
  help?: string;
  suggestions?: string[];
};

type State = {
  open: boolean;
  loading: boolean;
  items: SpellCheckItem[];
};

type Actions = {
  openPanel: () => void;
  closePanel: () => void;
  setOpen: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setItems: (items: SpellCheckItem[]) => void;
  toggleItem: (id: number) => void;
  reset: () => void;
};

export const useSpellCheckStore = create<State & Actions>((set) => ({
  open: false,
  loading: false,
  items: [],
  openPanel: () => set({ open: true }),
  closePanel: () => set({ open: false }),
  setOpen: (v) => set({ open: v }),
  setLoading: (v) => set({ loading: v }),
  setItems: (items) => set({ items }),
  toggleItem: (id) =>
    set((s) => ({
      items: s.items.map((it) =>
        it.id === id ? { ...it, open: !it.open } : it
      ),
    })),
  reset: () => set({ open: false, loading: false, items: [] }),
}));
