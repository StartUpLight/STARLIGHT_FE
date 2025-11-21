'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type EvaluationState = {
  totalScore: number;
  hasExpertUnlocked: boolean;
  setTotalScore: (score: number) => void;
  resetEvaluation: () => void;
};

export const useEvaluationStore = create<EvaluationState>()(
  persist(
    (set) => ({
      totalScore: 0,
      hasExpertUnlocked: false,

      setTotalScore: (score: number) =>
        set((state) => ({
          totalScore: score,
          hasExpertUnlocked: state.hasExpertUnlocked || score >= 70,
        })),

      resetEvaluation: () =>
        set({
          totalScore: 0,
          hasExpertUnlocked: false,
        }),
    }),
    {
      name: 'evaluation',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        hasExpertUnlocked: state.hasExpertUnlocked,
      }),
    }
  )
);
