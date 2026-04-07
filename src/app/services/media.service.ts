import { api } from "@/lib/api";

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

    // Do not set Content-Type manually; the browser will add the correct multipart boundary.
    const response = await api.post(`/admin/media/upload`, formData);
    return response.data;
  },

  getAll: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const response = await api.get(`/admin/media`, { params });
    return response.data as PagedMediaResponse;
  },

  getPublic: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const response = await api.get(`/media`, { params });
    return response.data as PagedMediaResponse;
  },

  remove: async (id: string) => {
    await api.delete(`/admin/media/${id}`);
  }
};
