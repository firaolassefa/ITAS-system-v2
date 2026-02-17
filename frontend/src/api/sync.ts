import axios from 'axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

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
    const response = await axios.get('/sync/pending', getAuthHeaders());
    return response.data.data;
  },

  syncTrainingRecord: async (recordId: number): Promise<void> => {
    await axios.post(`/sync/${recordId}/execute`, {}, getAuthHeaders());
  },

  retryFailedSyncs: async (): Promise<void> => {
    await axios.post('/sync/retry-failed', {}, getAuthHeaders());
  },

  getSyncStats: async (): Promise<{
    total: number;
    pending: number;
    synced: number;
    failed: number;
  }> => {
    const response = await axios.get('/sync/stats', getAuthHeaders());
    return response.data.data;
  },

  forceSync: async (userId: number): Promise<void> => {
    await axios.post(`/sync/force/${userId}`, {}, getAuthHeaders());
  },
};