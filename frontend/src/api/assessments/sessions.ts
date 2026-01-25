import apiClient from '../client';
import { AssessmentSession, SessionCreate, SessionUpdate, AssessmentType } from '@/types/assessment';

export interface SessionFilters {
  skip?: number;
  limit?: number;
  player_id?: string;
  assessment_type?: AssessmentType;
  is_complete?: boolean;
  start_date?: string;
  end_date?: string;
}

export const sessionsApi = {
  list: async (filters?: SessionFilters): Promise<AssessmentSession[]> => {
    const response = await apiClient.get<AssessmentSession[]>('/assessments/sessions', {
      params: filters,
    });
    return response.data;
  },

  get: async (id: string): Promise<AssessmentSession> => {
    const response = await apiClient.get<AssessmentSession>(`/assessments/sessions/${id}`);
    return response.data;
  },

  create: async (data: SessionCreate): Promise<AssessmentSession> => {
    const response = await apiClient.post<AssessmentSession>('/assessments/sessions', data);
    return response.data;
  },

  update: async (id: string, data: SessionUpdate): Promise<AssessmentSession> => {
    const response = await apiClient.put<AssessmentSession>(`/assessments/sessions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/assessments/sessions/${id}`);
  },

  markComplete: async (id: string): Promise<AssessmentSession> => {
    const response = await apiClient.post<AssessmentSession>(`/assessments/sessions/${id}/complete`);
    return response.data;
  },
};
