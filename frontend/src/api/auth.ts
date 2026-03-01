import { apiClient } from '../utils/axiosConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const authAPI = {
  login: async (username: string, password: string) => {
    // Use fetch for login to avoid circular dependency with token interceptor
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    // Backend returns { message, user, token } directly
    // Return in the format expected by Login component
    return {
      user: data.user,
      token: data.token,
      message: data.message
    };
  },

  register: async (userData: any) => {
    // Use fetch for register to avoid circular dependency
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

