import axios from 'axios';

const API_BaseURL = '/api';

export interface MediaItemDto {
  id: string;
  url: string;
  fileName: string;
  sizeBytes: number;
  contentType: string;
  createdAt: string;
}

export interface PagedMediaResponse {
  items: MediaItemDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const mediaService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BaseURL}/admin/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.data;
  },

  getAll: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const response = await axios.get(`${API_BaseURL}/admin/media`, {
        params,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data as PagedMediaResponse;
  },

  getPublic: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const response = await axios.get(`${API_BaseURL}/media`, { params });
    return response.data as PagedMediaResponse;
  }
};
