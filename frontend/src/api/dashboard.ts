import { apiClient } from '../utils/axiosConfig';

export const dashboardAPI = {
  // Get taxpayer dashboard
  getTaxpayerDashboard: async (userId: number) => {
    const response = await apiClient.get(`/dashboard/taxpayer/${userId}`);
    return response.data;
  },

  // Get staff dashboard
  getStaffDashboard: async (userId: number) => {
    const response = await apiClient.get(`/dashboard/staff/${userId}`);
    return response.data;
  },

  // Get content admin dashboard
  getContentAdminDashboard: async () => {
    const response = await apiClient.get(`/dashboard/content-admin`);
    return response.data;
  },

  // Get training admin dashboard
  getTrainingAdminDashboard: async () => {
    const response = await apiClient.get(`/dashboard/training-admin`);
    return response.data;
  },

  // Get communication officer dashboard
  getCommOfficerDashboard: async () => {
    const response = await apiClient.get(`/dashboard/comm-officer`);
    return response.data;
  },

  // Get manager dashboard
  getManagerDashboard: async () => {
    const response = await apiClient.get(`/dashboard/manager`);
    return response.data;
  },

  // Get system admin dashboard
  getSystemAdminDashboard: async () => {
    const response = await apiClient.get(`/dashboard/system-admin`);
    return response.data;
  },

  // Get auditor dashboard
  getAuditorDashboard: async () => {
    const response = await apiClient.get(`/dashboard/auditor`);
    return response.data;
  },
};
