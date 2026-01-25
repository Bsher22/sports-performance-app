import apiClient from './client';
import { Sport, SportCreate, SportUpdate, SportListItem } from '@/types/sport';

export const sportsApi = {
  list: async (includeInactive = false): Promise<SportListItem[]> => {
    const response = await apiClient.get<SportListItem[]>('/sports', {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  get: async (id: number): Promise<Sport> => {
    const response = await apiClient.get<Sport>(`/sports/${id}`);
    return response.data;
  },

  create: async (data: SportCreate): Promise<Sport> => {
    const response = await apiClient.post<Sport>('/sports', data);
    return response.data;
  },

  update: async (id: number, data: SportUpdate): Promise<Sport> => {
    const response = await apiClient.put<Sport>(`/sports/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sports/${id}`);
  },
};
