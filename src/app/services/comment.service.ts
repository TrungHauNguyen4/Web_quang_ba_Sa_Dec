import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface CommentItem {
  id: string;
  targetType: string;
  targetId: string;
  targetSlug?: string | null;
  targetTitle?: string | null;
  userName: string;
  email: string;
  content: string;
  status: number | "Pending" | "Approved" | "Rejected" | string;
  createdAt: string;
}

export interface PagedCommentResponse {
  items: CommentItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CommentCreatePayload {
  targetType: string;
  targetId: string;
  userName?: string;
  email?: string;
  content: string;
}

export interface CommentAutoApproveDto {
  enabled: boolean;
}

export const commentService = {
  getApprovedByTarget: async (params: {
    targetType: string;
    targetId: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await axios.get(`${API_BASE_URL}/comments`, { params });
    return response.data as PagedCommentResponse;
  },

  submit: async (payload: CommentCreatePayload) => {
    const response = await axios.post(`${API_BASE_URL}/comments`, payload);
    return response.data as CommentItem;
  },

  getForModeration: async (params?: {
    page?: number;
    pageSize?: number;
    status?: "Pending" | "Approved" | "Rejected";
    targetType?: string;
  }) => {
    const response = await axios.get(`${API_BASE_URL}/admin/comments`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as PagedCommentResponse;
  },

  getAutoApprove: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/comments/auto-approve`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as CommentAutoApproveDto;
  },

  setAutoApprove: async (enabled: boolean) => {
    const response = await axios.put(
      `${API_BASE_URL}/admin/comments/auto-approve`,
      { enabled },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return response.data as CommentAutoApproveDto;
  },

  approve: async (commentId: string) => {
    const response = await axios.patch(
      `${API_BASE_URL}/admin/comments/${commentId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return response.data as CommentItem;
  },

  reject: async (commentId: string) => {
    const response = await axios.patch(
      `${API_BASE_URL}/admin/comments/${commentId}/reject`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return response.data as CommentItem;
  },

  remove: async (commentId: string) => {
    await axios.delete(`${API_BASE_URL}/admin/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  clearReviewedHistory: async () => {
    const response = await axios.delete(`${API_BASE_URL}/admin/comments/history`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as { deletedCount: number };
  },

  clearAll: async () => {
    const response = await axios.delete(`${API_BASE_URL}/admin/comments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as { deletedCount: number };
  },
};