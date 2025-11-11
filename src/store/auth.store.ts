'use client';
import { create } from 'zustand';

interface AuthStore {
    isAuthenticated: boolean;
    checkAuth: () => void;
    login: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,

    checkAuth: () => {
        if (typeof window === 'undefined') return;
        const accessToken = localStorage.getItem('accessToken');
        set({ isAuthenticated: !!accessToken });
    },

    login: () => {
        set({ isAuthenticated: true });
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        set({ isAuthenticated: false });
    },
}));

