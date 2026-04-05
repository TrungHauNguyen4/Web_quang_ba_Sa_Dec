import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface FeedbackPayload {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  content: string;
}

export interface FeedbackSubmitResult {
  ticketId: string;
  status: string;
  submittedAt: string;
}

export const feedbackService = {
  submit: async (payload: FeedbackPayload) => {
    const response = await axios.post(`${API_BASE_URL}/feedback`, payload);
    return response.data as FeedbackSubmitResult;
  },
};
