import { create } from 'zustand';
import { AssessmentSession } from '@/types/assessment';
import { PlayerListItem } from '@/types/player';

type AssessmentStep = 'select' | 'input' | 'review';
type AssessmentMode = 'single' | 'group';

interface GroupSessionInfo {
  playerId: string;
  playerName: string;
  session: AssessmentSession;
  isComplete: boolean;
}

interface AssessmentState {
  // Assessment mode
  mode: AssessmentMode;

  // Current assessment flow state (single mode)
  currentSession: AssessmentSession | null;
  currentStep: AssessmentStep;
  pendingResults: Record<string, unknown>;

  // Group assessment state
  groupSessions: GroupSessionInfo[];
  currentGroupIndex: number;
  selectedPlayers: PlayerListItem[];

  // Actions - Single mode
  startAssessment: (session: AssessmentSession) => void;
  setStep: (step: AssessmentStep) => void;
  updateResult: (testCode: string, result: unknown) => void;
  updateResults: (results: Record<string, unknown>) => void;
  clearAssessment: () => void;
  getResultForTest: (testCode: string) => unknown | undefined;

  // Actions - Group mode
  setMode: (mode: AssessmentMode) => void;
  setSelectedPlayers: (players: PlayerListItem[]) => void;
  startGroupAssessment: (sessions: AssessmentSession[], players: PlayerListItem[]) => void;
  setCurrentGroupIndex: (index: number) => void;
  markCurrentPlayerComplete: () => void;
  nextPlayer: () => void;
  previousPlayer: () => void;
  getCurrentGroupSession: () => GroupSessionInfo | null;
  getGroupProgress: () => { completed: number; total: number };
  isGroupComplete: () => boolean;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  mode: 'single',
  currentSession: null,
  currentStep: 'select',
  pendingResults: {},
  groupSessions: [],
  currentGroupIndex: 0,
  selectedPlayers: [],

  // Single mode actions
  startAssessment: (session) => set({
    mode: 'single',
    currentSession: session,
    currentStep: 'input',
    pendingResults: {},
    groupSessions: [],
    currentGroupIndex: 0,
  }),

  setStep: (step) => set({ currentStep: step }),

  updateResult: (testCode, result) => set((state) => ({
    pendingResults: { ...state.pendingResults, [testCode]: result }
  })),

  updateResults: (results) => set((state) => ({
    pendingResults: { ...state.pendingResults, ...results }
  })),

  clearAssessment: () => set({
    mode: 'single',
    currentSession: null,
    currentStep: 'select',
    pendingResults: {},
    groupSessions: [],
    currentGroupIndex: 0,
    selectedPlayers: [],
  }),

  getResultForTest: (testCode) => get().pendingResults[testCode],

  // Group mode actions
  setMode: (mode) => set({ mode }),

  setSelectedPlayers: (players) => set({ selectedPlayers: players }),

  startGroupAssessment: (sessions, players) => {
    const groupSessions: GroupSessionInfo[] = sessions.map((session, index) => ({
      playerId: session.player_id,
      playerName: players[index]?.full_name || session.player_name || 'Unknown',
      session,
      isComplete: false,
    }));

    set({
      mode: 'group',
      groupSessions,
      currentGroupIndex: 0,
      currentSession: sessions[0] || null,
      currentStep: 'input',
      pendingResults: {},
      selectedPlayers: players,
    });
  },

  setCurrentGroupIndex: (index) => {
    const state = get();
    if (index >= 0 && index < state.groupSessions.length) {
      set({
        currentGroupIndex: index,
        currentSession: state.groupSessions[index].session,
        pendingResults: {},
      });
    }
  },

  markCurrentPlayerComplete: () => set((state) => {
    const newGroupSessions = [...state.groupSessions];
    if (newGroupSessions[state.currentGroupIndex]) {
      newGroupSessions[state.currentGroupIndex] = {
        ...newGroupSessions[state.currentGroupIndex],
        isComplete: true,
      };
    }
    return { groupSessions: newGroupSessions };
  }),

  nextPlayer: () => {
    const state = get();
    const nextIndex = state.currentGroupIndex + 1;
    if (nextIndex < state.groupSessions.length) {
      set({
        currentGroupIndex: nextIndex,
        currentSession: state.groupSessions[nextIndex].session,
        pendingResults: {},
      });
    } else if (state.groupSessions.every(s => s.isComplete)) {
      set({ currentStep: 'review' });
    }
  },

  previousPlayer: () => {
    const state = get();
    const prevIndex = state.currentGroupIndex - 1;
    if (prevIndex >= 0) {
      set({
        currentGroupIndex: prevIndex,
        currentSession: state.groupSessions[prevIndex].session,
        pendingResults: {},
      });
    }
  },

  getCurrentGroupSession: () => {
    const state = get();
    return state.groupSessions[state.currentGroupIndex] || null;
  },

  getGroupProgress: () => {
    const state = get();
    return {
      completed: state.groupSessions.filter(s => s.isComplete).length,
      total: state.groupSessions.length,
    };
  },

  isGroupComplete: () => {
    const state = get();
    return state.groupSessions.length > 0 && state.groupSessions.every(s => s.isComplete);
  },
}));
