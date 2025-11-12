'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getMember } from '@/api/mypage';
import { getMemberRequest } from '@/types/mypage/mypage.type';

interface UserState {
  user: getMemberRequest | null;
  setUser: (user: getMemberRequest) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => {
        set({ user });
      },

      clearUser: () => {
        set({ user: null });
      },

      fetchUser: async () => {
        try {
          const response = await getMember();

          const userData = response?.data;

          if (userData) {
            set({ user: userData });
          } else {
            console.warn('유저를 찾을 수 없습니다', response);
          }
        } catch (error) {
          console.error('유저를 찾을 수 없습니다', error);
        }
      },
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => {
        if (!state.user) return { user: null };
        return { user: state.user };
      },
    }
  )
);
