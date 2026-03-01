import { apiClient } from '../utils/axiosConfig';

export interface SyncRecord {
  id: number;
  userId: number;
  trainingType: string;
  trainingId: number;
  completionDate: string;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  errorMessage?: string;
  syncedAt?: string;
}

export const syncAPI = {
  getPendingSyncs: async (): Promise<SyncRecord[]> => {
    const response = await apiClient.get('/sync/pending');
    return response.data.data;
  },

  syncTrainingRecord: async (recordId: number): Promise<void> => {
    await apiClient.post(`/sync/${recordId}/execute`, {});
  },

  retryFailedSyncs: async (): Promise<void> => {
    await apiClient.post('/sync/retry-failed', {});
  },

  getSyncStats: async (): Promise<{
    total: number;
    pending: number;
    synced: number;
    failed: number;
  }> => {
    const response = await apiClient.get('/sync/stats');
    return response.data.data;
  },

  forceSync: async (userId: number): Promise<void> => {
    await apiClient.post(`/sync/force/${userId}`, {});
  },
};