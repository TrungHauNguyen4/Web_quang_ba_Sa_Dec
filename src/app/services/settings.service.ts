import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5090/api";

export interface SystemSettingsDto {
  siteName: string;
  slogan: string;
  seoDescription: string;
  logoUrl?: string | null;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface UpdateSystemSettingsDto {
  siteName: string;
  slogan: string;
  seoDescription: string;
  logoUrl?: string | null;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return undefined;
  }

  return { Authorization: `Bearer ${token}` };
};

export const settingsService = {
  getPublic: async () => {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    return response.data as SystemSettingsDto;
  },

  get: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/settings`, {
      headers: getAuthHeaders(),
    });
    return response.data as SystemSettingsDto;
  },

  update: async (payload: UpdateSystemSettingsDto) => {
    const response = await axios.put(`${API_BASE_URL}/admin/settings`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data as SystemSettingsDto;
  },
};
