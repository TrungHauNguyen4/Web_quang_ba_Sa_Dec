import { api } from "@/lib/api";

export interface UserAdminItem {
  id: string;
  displayName: string;
  email: string;
  userName: string;
  role: string;
  createdAt: string;
}

export interface PagedUserResponse {
  items: UserAdminItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const userService = {
  getAll: async (params?: { page?: number; pageSize?: number; q?: string; role?: string }) => {
    const response = await api.get(`/admin/users`, { params });
    return response.data as PagedUserResponse;
  },

  create: async (payload: { displayName: string; email: string; userName: string; password: string; role: string }) => {
    const response = await api.post(`/admin/users`, payload);
    return response.data as UserAdminItem;
  },

  updateRole: async (id: string, role: string) => {
    await api.patch(`/admin/users/${id}/role`, { role });
  },

  remove: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },

  resetPassword: async (id: string, newPassword: string) => {
    await api.post(`/admin/users/${id}/reset-password`, { newPassword });
  },
};