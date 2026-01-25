import apiClient from '../client';
import { OnBaseUResult, OnBaseUResultCreate, TestDefinition } from '@/types/assessment';

export const onbaseUApi = {
  getTests: async (): Promise<TestDefinition[]> => {
    const response = await apiClient.get<TestDefinition[]>('/assessments/onbaseu/tests');
    return response.data;
  },

  getResults: async (sessionId: string): Promise<OnBaseUResult[]> => {
    const response = await apiClient.get<OnBaseUResult[]>(`/assessments/onbaseu/${sessionId}/results`);
    return response.data;
  },

  createResult: async (sessionId: string, data: OnBaseUResultCreate): Promise<OnBaseUResult> => {
    const response = await apiClient.post<OnBaseUResult>(
      `/assessments/onbaseu/${sessionId}/results`,
      data
    );
    return response.data;
  },

  createBulkResults: async (sessionId: string, results: OnBaseUResultCreate[]): Promise<OnBaseUResult[]> => {
    const response = await apiClient.post<OnBaseUResult[]>(
      `/assessments/onbaseu/${sessionId}/results/bulk`,
      { results }
    );
    return response.data;
  },

  updateResult: async (
    sessionId: string,
    resultId: string,
    data: Partial<OnBaseUResultCreate>
  ): Promise<OnBaseUResult> => {
    const response = await apiClient.put<OnBaseUResult>(
      `/assessments/onbaseu/${sessionId}/results/${resultId}`,
      data
    );
    return response.data;
  },

  deleteResult: async (sessionId: string, resultId: string): Promise<void> => {
    await apiClient.delete(`/assessments/onbaseu/${sessionId}/results/${resultId}`);
  },
};

// Pitcher OnBaseU API (same structure)
export const pitcherOnbaseUApi = {
  getTests: async (): Promise<TestDefinition[]> => {
    const response = await apiClient.get<TestDefinition[]>('/assessments/pitcher-onbaseu/tests');
    return response.data;
  },

  getResults: async (sessionId: string): Promise<OnBaseUResult[]> => {
    const response = await apiClient.get<OnBaseUResult[]>(`/assessments/pitcher-onbaseu/${sessionId}/results`);
    return response.data;
  },

  createResult: async (sessionId: string, data: OnBaseUResultCreate): Promise<OnBaseUResult> => {
    const response = await apiClient.post<OnBaseUResult>(
      `/assessments/pitcher-onbaseu/${sessionId}/results`,
      data
    );
    return response.data;
  },

  createBulkResults: async (sessionId: string, results: OnBaseUResultCreate[]): Promise<OnBaseUResult[]> => {
    const response = await apiClient.post<OnBaseUResult[]>(
      `/assessments/pitcher-onbaseu/${sessionId}/results/bulk`,
      { results }
    );
    return response.data;
  },

  updateResult: async (
    sessionId: string,
    resultId: string,
    data: Partial<OnBaseUResultCreate>
  ): Promise<OnBaseUResult> => {
    const response = await apiClient.put<OnBaseUResult>(
      `/assessments/pitcher-onbaseu/${sessionId}/results/${resultId}`,
      data
    );
    return response.data;
  },

  deleteResult: async (sessionId: string, resultId: string): Promise<void> => {
    await apiClient.delete(`/assessments/pitcher-onbaseu/${sessionId}/results/${resultId}`);
  },
};
