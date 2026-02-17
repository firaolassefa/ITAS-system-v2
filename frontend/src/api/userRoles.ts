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

export interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserWithRole {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
}

export const userRolesAPI = {
  getAllRoles: async (): Promise<UserRole[]> => {
    const response = await axios.get('/roles', getAuthHeaders());
    return response.data.data;
  },

  createRole: async (roleData: Omit<UserRole, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserRole> => {
    const response = await axios.post('/roles', roleData, getAuthHeaders());
    return response.data.data;
  },

  updateRole: async (id: number, roleData: Partial<UserRole>): Promise<UserRole> => {
    const response = await axios.put(`/roles/${id}`, roleData, getAuthHeaders());
    return response.data.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await axios.delete(`/roles/${id}`, getAuthHeaders());
  },

  getAllUsers: async (): Promise<UserWithRole[]> => {
    const response = await axios.get('/users', getAuthHeaders());
    return response.data.data;
  },

  assignRole: async (userId: number, roleId: number): Promise<void> => {
    await axios.post(`/users/${userId}/assign-role`, { roleId }, getAuthHeaders());
  },

  updateUserStatus: async (userId: number, active: boolean): Promise<void> => {
    await axios.patch(`/users/${userId}/status`, { active }, getAuthHeaders());
  },
};