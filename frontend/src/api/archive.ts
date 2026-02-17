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

export interface ArchivedResource {
  id: number;
  originalResourceId: number;
  title: string;
  description: string;
  archivedBy: number;
  archivedAt: string;
  deletionScheduledFor: string;
  status: 'ARCHIVED' | 'DELETED';
}

export const archiveAPI = {
  getArchivedResources: async (): Promise<ArchivedResource[]> => {
    const response = await axios.get('/archive/resources', getAuthHeaders());
    return response.data.data;
  },

  archiveResource: async (resourceId: number, scheduleDeletion: string): Promise<void> => {
    await axios.post(`/archive/resources/${resourceId}`, { scheduleDeletion }, getAuthHeaders());
  },

  restoreResource: async (archiveId: number): Promise<void> => {
    await axios.post(`/archive/restore/${archiveId}`, {}, getAuthHeaders());
  },

  permanentDelete: async (archiveId: number): Promise<void> => {
    await axios.delete(`/archive/${archiveId}/permanent`, getAuthHeaders());
  },

  getArchiveStats: async (): Promise<{
    archivedCount: number;
    scheduledForDeletion: number;
    storageSaved: string;
  }> => {
    const response = await axios.get('/archive/stats', getAuthHeaders());
    return response.data.data;
  },
};