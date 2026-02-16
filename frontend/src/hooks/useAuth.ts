import { useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('itas_user');
    const token = localStorage.getItem('itas_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: any = await authAPI.login(username, password);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('itas_user', JSON.stringify(userData));
      localStorage.setItem('itas_token', token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('itas_user');
    localStorage.removeItem('itas_token');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('itas_token');
  };

  const hasRole = (role: string) => {
    return user?.userType === role;
  };

  const hasPermission = (permission: string) => {
    // This would be expanded based on your permission system
    return user?.permissions?.includes(permission) || false;
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasPermission,
  };
};