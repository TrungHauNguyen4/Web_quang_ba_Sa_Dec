import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5090/api";

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
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as PagedUserResponse;
  },

  create: async (payload: { displayName: string; email: string; userName: string; password: string; role: string }) => {
    const response = await axios.post(`${API_BASE_URL}/admin/users`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as UserAdminItem;
  },

  updateRole: async (id: string, role: string) => {
    await axios.patch(
      `${API_BASE_URL}/admin/users/${id}/role`,
      { role },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
  },

  remove: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};