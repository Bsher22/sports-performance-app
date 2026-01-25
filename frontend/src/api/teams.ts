import apiClient from './client';
import { Team, TeamCreate, TeamUpdate, TeamStats } from '@/types/team';
import { PlayerListItem } from '@/types/player';

export const teamsApi = {
  list: async (includeInactive = false): Promise<Team[]> => {
    const response = await apiClient.get<Team[]>('/teams', {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  get: async (id: number): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  create: async (data: TeamCreate): Promise<Team> => {
    const response = await apiClient.post<Team>('/teams', data);
    return response.data;
  },

  update: async (id: number, data: TeamUpdate): Promise<Team> => {
    const response = await apiClient.put<Team>(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },

  getPlayers: async (id: number, includeInactive = false): Promise<PlayerListItem[]> => {
    const response = await apiClient.get<PlayerListItem[]>(`/teams/${id}/players`, {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  getStats: async (id: number): Promise<TeamStats> => {
    const response = await apiClient.get<TeamStats>(`/teams/${id}/stats`);
    return response.data;
  },
};
