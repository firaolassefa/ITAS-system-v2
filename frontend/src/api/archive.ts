import axios from 'axios';

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
    const response = await axios.get('/archive/resources');
    return response.data.data;
  },

  archiveResource: async (resourceId: number, scheduleDeletion: string): Promise<void> => {
    await axios.post(`/archive/resources/${resourceId}`, { scheduleDeletion });
  },

  restoreResource: async (archiveId: number): Promise<void> => {
    await axios.post(`/archive/restore/${archiveId}`);
  },

  permanentDelete: async (archiveId: number): Promise<void> => {
    await axios.delete(`/archive/${archiveId}/permanent`);
  },

  getArchiveStats: async (): Promise<{
    archivedCount: number;
    scheduledForDeletion: number;
    storageSaved: string;
  }> => {
    const response = await axios.get('/archive/stats');
    return response.data.data;
  },
};