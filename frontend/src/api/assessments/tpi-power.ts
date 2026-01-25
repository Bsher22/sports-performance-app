import apiClient from '../client';
import { TPIPowerResult, TPIPowerResultCreate, TestDefinition } from '@/types/assessment';

export const tpiPowerApi = {
  getTests: async (): Promise<TestDefinition[]> => {
    const response = await apiClient.get<TestDefinition[]>('/assessments/tpi-power/tests');
    return response.data;
  },

  getResults: async (sessionId: string): Promise<TPIPowerResult[]> => {
    const response = await apiClient.get<TPIPowerResult[]>(`/assessments/tpi-power/${sessionId}/results`);
    return response.data;
  },

  createResult: async (sessionId: string, data: TPIPowerResultCreate): Promise<TPIPowerResult> => {
    const response = await apiClient.post<TPIPowerResult>(
      `/assessments/tpi-power/${sessionId}/results`,
      data
    );
    return response.data;
  },

  createBulkResults: async (sessionId: string, results: TPIPowerResultCreate[]): Promise<TPIPowerResult[]> => {
    const response = await apiClient.post<TPIPowerResult[]>(
      `/assessments/tpi-power/${sessionId}/results/bulk`,
      { results }
    );
    return response.data;
  },

  updateResult: async (
    sessionId: string,
    resultId: string,
    data: Partial<TPIPowerResultCreate>
  ): Promise<TPIPowerResult> => {
    const response = await apiClient.put<TPIPowerResult>(
      `/assessments/tpi-power/${sessionId}/results/${resultId}`,
      data
    );
    return response.data;
  },

  deleteResult: async (sessionId: string, resultId: string): Promise<void> => {
    await apiClient.delete(`/assessments/tpi-power/${sessionId}/results/${resultId}`);
  },
};
