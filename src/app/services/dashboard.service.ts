import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5090/api";

export interface DashboardOverviewResponse {
  stats: {
    receivedToday: number;
    processing: number;
    overdue: number;
    completedTotal: number;
    totalNewsViews: number;
    publishedNews: number;
  };
  trend: Array<{ day: string; received: number; resolved: number }>;
  accessTrend: Array<{ label: string; views: number }>;
  newsReport: Array<{ title: string; views: number }>;
  backlog: Array<{ unit: string; pending: number }>;
  quickTasks: Array<{ label: string; value: number; level: string }>;
  activities: Array<{ actor: string; action: string; target: string; time: string }>;
  generatedAt: string;
}

export const dashboardService = {
  getOverview: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/overview`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data as DashboardOverviewResponse;
  },
};