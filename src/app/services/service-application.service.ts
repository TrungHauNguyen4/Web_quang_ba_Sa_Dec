import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ServiceApplicationItem {
  id: string;
  serviceName: string;
  applicant: string;
  submittedAt: string;
  dueAt: string;
  status: "pending" | "processing" | "completed" | "rejected" | string;
  isOverdue: boolean;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  attachmentUrls: string[];
  updatedAt: string;
}

export interface PublicServiceItem {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  formSchema?: ServiceFormSchema | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormField {
  key: string;
  label: string;
  required: boolean;
  type: "text" | "textarea" | "date" | string;
  placeholder?: string | null;
}

export interface ServiceFormSchema {
  title?: string | null;
  hint?: string | null;
  templateUrl?: string | null;
  requiredDocuments?: string | null;
  fields: ServiceFormField[];
}

export interface PagedServiceApplicationResponse {
  items: ServiceApplicationItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PagedPublicServiceResponse {
  items: PublicServiceItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const serviceApplicationService = {
  getPublicServices: async () => {
    const response = await axios.get(`${API_BASE_URL}/services`);
    return response.data as PublicServiceItem[];
  },

  submit: async (payload: {
    serviceName: string;
    applicant: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
    attachmentUrls?: string[];
  }) => {
    const response = await axios.post(`${API_BASE_URL}/service-applications`, payload);
    return response.data as ServiceApplicationItem;
  },

  uploadAttachment: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_BASE_URL}/service-applications/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data as {
      id: string;
      url: string;
      fileName: string;
      sizeBytes: number;
      contentType: string;
    };
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/service-applications/${id}`);
    return response.data as ServiceApplicationItem;
  },

  getAllAdmin: async (params?: { page?: number; pageSize?: number; q?: string; status?: string }) => {
    const response = await axios.get(`${API_BASE_URL}/admin/service-applications`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as PagedServiceApplicationResponse;
  },

  updateStatus: async (id: string, status: string, note?: string) => {
    await axios.patch(
      `${API_BASE_URL}/admin/service-applications/${id}/status`,
      { status, note },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
  },

  removeApplication: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/admin/service-applications/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  getServicesAdmin: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    const response = await axios.get(`${API_BASE_URL}/admin/services`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as PagedPublicServiceResponse;
  },

  createService: async (payload: { name: string; description?: string; isActive: boolean; formSchema?: ServiceFormSchema | null }) => {
    const response = await axios.post(`${API_BASE_URL}/admin/services`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as PublicServiceItem;
  },

  updateService: async (id: string, payload: { name: string; description?: string; isActive: boolean; formSchema?: ServiceFormSchema | null }) => {
    await axios.put(`${API_BASE_URL}/admin/services/${id}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  removeService: async (id: string) => {
    await axios.delete(`${API_BASE_URL}/admin/services/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};