import apiClient from '../client';
import { SprintResult, SprintResultCreate, TestDefinition } from '@/types/assessment';

export const sprintApi = {
  getTests: async (): Promise<TestDefinition[]> => {
    const response = await apiClient.get<TestDefinition[]>('/assessments/sprint/tests');
    return response.data;
  },

  getResults: async (sessionId: string): Promise<SprintResult[]> => {
    const response = await apiClient.get<SprintResult[]>(`/assessments/sprint/${sessionId}/results`);
    return response.data;
  },

  createResult: async (sessionId: string, data: SprintResultCreate): Promise<SprintResult> => {
    const response = await apiClient.post<SprintResult>(
      `/assessments/sprint/${sessionId}/results`,
      data
    );
    return response.data;
  },

  createBulkResults: async (sessionId: string, results: SprintResultCreate[]): Promise<SprintResult[]> => {
    const response = await apiClient.post<SprintResult[]>(
      `/assessments/sprint/${sessionId}/results/bulk`,
      { results }
    );
    return response.data;
  },

  updateResult: async (
    sessionId: string,
    resultId: string,
    data: Partial<SprintResultCreate>
  ): Promise<SprintResult> => {
    const response = await apiClient.put<SprintResult>(
      `/assessments/sprint/${sessionId}/results/${resultId}`,
      data
    );
    return response.data;
  },

  deleteResult: async (sessionId: string, resultId: string): Promise<void> => {
    await apiClient.delete(`/assessments/sprint/${sessionId}/results/${resultId}`);
  },
};
