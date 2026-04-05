import axios from 'axios';

const API_BaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  role: string | null;
  token?: string;
  refreshToken?: string;
}

export interface AuthLoginResponse {
  token: string;
  refreshToken?: string | null;
  user: User;
}

export interface AuthRefreshResponse {
  token: string;
  refreshToken?: string | null;
  user?: User;
}

export const authService = {
  login: async (credentials: any) => {
    const response = await axios.post(`${API_BaseURL}/auth/login`, credentials);
    return response.data as AuthLoginResponse;
  },

  refreshToken: async (token: string, refreshToken: string) => {
    const response = await axios.post(`${API_BaseURL}/auth/refresh-token`, {
      token,
      refreshToken,
    });
    return response.data as AuthRefreshResponse;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenIssuedAt');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('user');
  },
};
