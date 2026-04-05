import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5090/api";

export interface CuisineItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface PagedCuisineResponse {
  items: CuisineItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CuisinePayload {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  galleryImageUrls?: string[];
  videoUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  status: number;
}

export const cuisineService = {
  getAll: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const response = await axios.get(`${API_BASE_URL}/cuisines`, { params });
    return response.data as PagedCuisineResponse;
  },

  getBySlug: async (slug: string) => {
    const response = await axios.get(`${API_BASE_URL}/cuisines/slug/${slug}`);
    return response.data as CuisineItem;
  },

  getAllAdmin: async (params?: { page?: number; pageSize?: number; q?: string; status?: number }) => {
    const response = await axios.get(`${API_BASE_URL}/admin/cuisines`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as PagedCuisineResponse;
  },

  create: async (payload: CuisinePayload) => {
    const response = await axios.post(`${API_BASE_URL}/admin/cuisines`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as CuisineItem;
  },

  update: async (id: string, payload: CuisinePayload) => {
    await axios.put(`${API_BASE_URL}/admin/cuisines/${id}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  remove: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/admin/cuisines/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};