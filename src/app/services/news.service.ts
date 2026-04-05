import axios from 'axios';

export interface NewsPayload {
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  content?: string | null;
  status: number;
  publishedAt?: string | null;
}

const API_BaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5090/api';

export const newsService = {
  getAll: async (params?: any) => {
    const response = await axios.get(`${API_BaseURL}/news`, { params });
    return response.data;
  },

  getAllAdmin: async (params?: any) => {
    const response = await axios.get(`${API_BaseURL}/admin/news`, {
      params,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await axios.get(`${API_BaseURL}/news/slug/${slug}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_BaseURL}/news/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_BaseURL}/news/categories`);
    return response.data as string[];
  },

  create: async (data: NewsPayload) => {
    const response = await axios.post(`${API_BaseURL}/admin/news`, data, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  update: async (id: string, data: NewsPayload) => {
    const response = await axios.put(`${API_BaseURL}/admin/news/${id}`, data, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_BaseURL}/admin/news/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};
