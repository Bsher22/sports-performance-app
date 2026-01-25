import apiClient from './client';
import {
  PlayerProgress,
  PlayerSummary,
  PlayerComparison,
  TeamOverview,
  TeamTrends,
  TeamRankings,
} from '@/types/analysis';
import { AssessmentType } from '@/types/assessment';

export const analysisApi = {
  // Player Analysis
  getPlayerProgress: async (
    playerId: string,
    assessmentType: AssessmentType,
    startDate?: string,
    endDate?: string
  ): Promise<PlayerProgress> => {
    const response = await apiClient.get<PlayerProgress>(`/analysis/player/${playerId}/progress`, {
      params: {
        assessment_type: assessmentType,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  getPlayerSummary: async (playerId: string): Promise<PlayerSummary> => {
    const response = await apiClient.get<PlayerSummary>(`/analysis/player/${playerId}/summary`);
    return response.data;
  },

  comparePlayers: async (
    playerIds: string[],
    assessmentType: AssessmentType,
    asOfDate?: string
  ): Promise<PlayerComparison> => {
    const response = await apiClient.get<PlayerComparison>('/analysis/compare', {
      params: {
        player_ids: playerIds,
        assessment_type: assessmentType,
        as_of_date: asOfDate,
      },
      paramsSerializer: {
        indexes: null, // This ensures arrays are serialized as player_ids=a&player_ids=b
      },
    });
    return response.data;
  },

  // Team Analysis
  getTeamOverview: async (teamId: number): Promise<TeamOverview> => {
    const response = await apiClient.get<TeamOverview>(`/analysis/team/${teamId}/overview`);
    return response.data;
  },

  getTeamTrends: async (
    teamId: number,
    assessmentType: AssessmentType,
    startDate?: string,
    endDate?: string
  ): Promise<TeamTrends> => {
    const response = await apiClient.get<TeamTrends>(`/analysis/team/${teamId}/trends`, {
      params: {
        assessment_type: assessmentType,
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  getTeamRankings: async (teamId: number, assessmentType: AssessmentType): Promise<TeamRankings> => {
    const response = await apiClient.get<TeamRankings>(`/analysis/team/${teamId}/rankings`, {
      params: {
        assessment_type: assessmentType,
      },
    });
    return response.data;
  },
};
