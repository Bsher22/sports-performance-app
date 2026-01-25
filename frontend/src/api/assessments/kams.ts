import apiClient from '../client';
import { KAMSResult, KAMSResultCreate, TestDefinition } from '@/types/assessment';

export const kamsApi = {
  getTests: async (): Promise<TestDefinition[]> => {
    const response = await apiClient.get<TestDefinition[]>('/assessments/kams/tests');
    return response.data;
  },

  getResults: async (sessionId: string): Promise<KAMSResult[]> => {
    const response = await apiClient.get<KAMSResult[]>(`/assessments/kams/${sessionId}/results`);
    return response.data;
  },

  createResult: async (sessionId: string, data: KAMSResultCreate): Promise<KAMSResult> => {
    const response = await apiClient.post<KAMSResult>(
      `/assessments/kams/${sessionId}/results`,
      data
    );
    return response.data;
  },

  createBulkResults: async (sessionId: string, results: KAMSResultCreate[]): Promise<KAMSResult[]> => {
    const response = await apiClient.post<KAMSResult[]>(
      `/assessments/kams/${sessionId}/results/bulk`,
      { results }
    );
    return response.data;
  },

  updateResult: async (
    sessionId: string,
    resultId: string,
    data: Partial<KAMSResultCreate>
  ): Promise<KAMSResult> => {
    const response = await apiClient.put<KAMSResult>(
      `/assessments/kams/${sessionId}/results/${resultId}`,
      data
    );
    return response.data;
  },

  deleteResult: async (sessionId: string, resultId: string): Promise<void> => {
    await apiClient.delete(`/assessments/kams/${sessionId}/results/${resultId}`);
  },

  uploadPdf: async (file: File): Promise<{ message: string; filename: string; status: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/assessments/kams/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
