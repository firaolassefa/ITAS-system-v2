import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('itas_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const dashboardAPI = {
  // Get taxpayer dashboard
  getTaxpayerDashboard: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/taxpayer/${userId}`, getAuthHeaders());
    return response.data;
  },

  // Get staff dashboard
  getStaffDashboard: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/staff/${userId}`, getAuthHeaders());
    return response.data;
  },

  // Get content admin dashboard
  getContentAdminDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/content-admin`, getAuthHeaders());
    return response.data;
  },

  // Get training admin dashboard
  getTrainingAdminDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/training-admin`, getAuthHeaders());
    return response.data;
  },

  // Get communication officer dashboard
  getCommOfficerDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/comm-officer`, getAuthHeaders());
    return response.data;
  },

  // Get manager dashboard
  getManagerDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/manager`, getAuthHeaders());
    return response.data;
  },

  // Get system admin dashboard
  getSystemAdminDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/system-admin`, getAuthHeaders());
    return response.data;
  },

  // Get auditor dashboard
  getAuditorDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/auditor`, getAuthHeaders());
    return response.data;
  },
};
