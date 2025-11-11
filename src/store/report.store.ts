'use client';
import { create } from 'zustand';

type EvaluationState = {
  totalScore: number;
  setTotalScore: (score: number) => void;
};

export const useEvaluationStore = create<EvaluationState>((set) => ({
  totalScore: 0,
  setTotalScore: (score) => set({ totalScore: score }),
}));
