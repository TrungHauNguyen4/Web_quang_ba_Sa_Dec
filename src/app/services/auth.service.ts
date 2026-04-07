import { api } from "@/lib/api";

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
    const response = await api.post(`/auth/login`, credentials);
    return response.data as AuthLoginResponse;
  },

  refreshToken: async (token: string, refreshToken: string) => {
    const response = await api.post(`/auth/refresh-token`, {
      token,
      refreshToken,
    });
    return response.data as AuthRefreshResponse;
  },

  forgotPassword: async (usernameOrEmail: string) => {
    const response = await api.post(`/auth/forgot-password`, { usernameOrEmail });
    return response.data as { message?: string };
  },

  resetPassword: async (payload: { email: string; token: string; newPassword: string }) => {
    const response = await api.post(`/auth/reset-password`, payload);
    return response.data as { message?: string };
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenIssuedAt');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('user');
  },
};
