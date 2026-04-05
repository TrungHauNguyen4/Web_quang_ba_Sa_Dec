import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5090/api";

export interface DestinationItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  content?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface PagedDestinationResponse {
  items: DestinationItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DestinationPayload {
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  videoUrl?: string;
  content?: string;
  latitude?: number | null;
  longitude?: number | null;
  status: number;
}

export const destinationService = {
  getAll: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const response = await axios.get(`${API_BASE_URL}/destinations`, { params });
    return response.data as PagedDestinationResponse;
  },

  getBySlug: async (slug: string) => {
    const response = await axios.get(`${API_BASE_URL}/destinations/slug/${slug}`);
    return response.data as DestinationItem;
  },

  getAllAdmin: async (params?: { page?: number; pageSize?: number; q?: string; status?: number }) => {
    const response = await axios.get(`${API_BASE_URL}/admin/destinations`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as PagedDestinationResponse;
  },

  create: async (payload: DestinationPayload) => {
    const response = await axios.post(`${API_BASE_URL}/admin/destinations`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as DestinationItem;
  },

  update: async (id: string, payload: DestinationPayload) => {
    await axios.put(`${API_BASE_URL}/admin/destinations/${id}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  remove: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/admin/destinations/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};