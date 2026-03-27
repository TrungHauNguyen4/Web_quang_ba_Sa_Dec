import axios from 'axios';

const API_BaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const newsService = {
  getAll: async (params?: any) => {
    const response = await axios.get(`${API_BaseURL}/news`, { params });
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

  create: async (data: any) => {
    const response = await axios.post(`${API_BaseURL}/admin/news`, data, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
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
