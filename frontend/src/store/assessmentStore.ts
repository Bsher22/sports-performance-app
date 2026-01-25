import { create } from 'zustand';
import { AssessmentSession, AssessmentType } from '@/types/assessment';

type AssessmentStep = 'select' | 'input' | 'review';

interface AssessmentState {
  // Current assessment flow state
  currentSession: AssessmentSession | null;
  currentStep: AssessmentStep;
  pendingResults: Record<string, unknown>;

  // Actions
  startAssessment: (session: AssessmentSession) => void;
  setStep: (step: AssessmentStep) => void;
  updateResult: (testCode: string, result: unknown) => void;
  updateResults: (results: Record<string, unknown>) => void;
  clearAssessment: () => void;
  getResultForTest: (testCode: string) => unknown | undefined;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentSession: null,
  currentStep: 'select',
  pendingResults: {},

  startAssessment: (session) => set({
    currentSession: session,
    currentStep: 'input',
    pendingResults: {}
  }),

  setStep: (step) => set({ currentStep: step }),

  updateResult: (testCode, result) => set((state) => ({
    pendingResults: { ...state.pendingResults, [testCode]: result }
  })),

  updateResults: (results) => set((state) => ({
    pendingResults: { ...state.pendingResults, ...results }
  })),

  clearAssessment: () => set({
    currentSession: null,
    currentStep: 'select',
    pendingResults: {}
  }),

  getResultForTest: (testCode) => get().pendingResults[testCode],
}));
