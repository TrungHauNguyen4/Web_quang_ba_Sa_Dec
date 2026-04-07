import { api } from "@/lib/api";

export interface SystemSettingsDto {
  siteName: string;
  slogan: string;
  seoDescription: string;
  logoUrl?: string | null;
  administrativeMapImageUrl?: string | null;
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
  administrativeMapImageUrl?: string | null;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
}

export const settingsService = {
  getPublic: async () => {
    const response = await api.get(`/settings`);
    return response.data as SystemSettingsDto;
  },

  get: async () => {
    const response = await api.get(`/admin/settings`);
    return response.data as SystemSettingsDto;
  },

  update: async (payload: UpdateSystemSettingsDto) => {
    const response = await api.put(`/admin/settings`, payload);
    return response.data as SystemSettingsDto;
  },
};
