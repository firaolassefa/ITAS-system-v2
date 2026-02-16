import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const dashboardAPI = {
  // Get dashboard data for current user
  getMyDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/me`);
    return response.data;
  },

  // Get taxpayer dashboard
  getTaxpayerDashboard: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/taxpayer/${userId}`);
    return response.data;
  },

  // Get staff dashboard
  getStaffDashboard: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/staff/${userId}`);
    return response.data;
  },

  // Get content admin dashboard
  getContentAdminDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/content-admin`);
    return response.data;
  },

  // Get training admin dashboard
  getTrainingAdminDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/training-admin`);
    return response.data;
  },

  // Get communication officer dashboard
  getCommOfficerDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/comm-officer`);
    return response.data;
  },

  // Get manager dashboard
  getManagerDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/manager`);
    return response.data;
  },

  // Get system admin dashboard
  getSystemAdminDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/system-admin`);
    return response.data;
  },

  // Get auditor dashboard
  getAuditorDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/auditor`);
    return response.data;
  },
};
