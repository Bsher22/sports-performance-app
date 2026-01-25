import apiClient from './client';
import { Player, PlayerCreate, PlayerUpdate, PlayerListItem, PlayerWithAssessments } from '@/types/player';

export interface PlayerFilters {
  skip?: number;
  limit?: number;
  team_id?: number;
  sport_id?: number;
  is_pitcher?: boolean;
  is_active?: boolean;
  search?: string;
}

export const playersApi = {
  list: async (filters?: PlayerFilters): Promise<PlayerListItem[]> => {
    const response = await apiClient.get<PlayerListItem[]>('/players', {
      params: filters,
    });
    return response.data;
  },

  get: async (id: string): Promise<Player> => {
    const response = await apiClient.get<Player>(`/players/${id}`);
    return response.data;
  },

  create: async (data: PlayerCreate): Promise<Player> => {
    const response = await apiClient.post<Player>('/players', data);
    return response.data;
  },

  update: async (id: string, data: PlayerUpdate): Promise<Player> => {
    const response = await apiClient.put<Player>(`/players/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/players/${id}`);
  },

  getWithAssessments: async (id: string): Promise<PlayerWithAssessments> => {
    const response = await apiClient.get<PlayerWithAssessments>(`/players/${id}/assessments`);
    return response.data;
  },
};
