import axios from 'axios';

const API_BaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string | null;
  token?: string;
  refreshToken?: string;
}

export const authService = {
  login: async (credentials: any) => {
    const response = await axios.post(`${API_BaseURL}/auth/login`, credentials);
    return response.data;
  },

  refreshToken: async (token: string, refreshToken: string) => {
    const response = await axios.post(`${API_BaseURL}/auth/refresh-token`, {
      token,
      refreshToken,
    });
    return response.data;
  },

  logout: async () => {
    // Invalidate token or session on server if needed
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
