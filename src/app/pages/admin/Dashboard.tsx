import {
  FileCheck2,
  FileClock,
  FileWarning,
  FileSpreadsheet,
  ArrowUpRight,
  BellRing,
  ShieldAlert,
  Newspaper,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { dashboardService, DashboardOverviewResponse } from "../../services/dashboard.service";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

export function Dashboard() {
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await dashboardService.getOverview();
        setData(response);
      } catch {
        setError("Không tải được dữ liệu bảng điều hành.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const stats = data
    ? [
        {
          title: "Hồ sơ tiếp nhận hôm nay",
          value: `${data.stats.receivedToday}`,
          icon: FileSpreadsheet,
          tone: "bg-blue-50 text-blue-700",
          trend: "Trực tiếp",
        },
        {
          title: "Hồ sơ đang xử lý",
          value: `${data.stats.processing}`,
          icon: FileClock,
          tone: "bg-amber-50 text-amber-700",
          trend: "Trực tiếp",
        },
        {
          title: "Hồ sơ quá hạn",
          value: `${data.stats.overdue}`,
          icon: FileWarning,
          tone: "bg-rose-50 text-rose-700",
          trend: "Trực tiếp",
        },
        {
          title: "Hồ sơ đã hoàn tất",
          value: `${data.stats.completedTotal}`,
          icon: FileCheck2,
          tone: "bg-emerald-50 text-emerald-700",
          trend: "Trực tiếp",
        },
        {
          title: "Lượt xem tin tức",
          value: `${data.stats.totalNewsViews}`,
          icon: Eye,
          tone: "bg-cyan-50 text-cyan-700",
          trend: "Theo truy cập",
        },
        {
          title: "Tin đã xuất bản",
          value: `${data.stats.publishedNews}`,
          icon: Newspaper,
          tone: "bg-indigo-50 text-indigo-700",
          trend: "Theo nội dung",
        },
      ]
    : [];

  const processingTrendData = data
    ? {
        labels: data.trend.map((item) => item.day),
        datasets: [
          {
            label: "Tiếp nhận",
            data: data.trend.map((item) => item.received),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.2)",
            tension: 0.3,
          },
          {
            label: "Giải quyết",
            data: data.trend.map((item) => item.resolved),
            borderColor: "#0f766e",
            backgroundColor: "rgba(15,118,110,0.2)",
            tension: 0.3,
          },
        ],
      }
    : null;

  const trafficData = data
    ? {
        labels: data.accessTrend.map((item) => item.label),
        datasets: [
          {
            label: "Lượt xem",
            data: data.accessTrend.map((item) => item.views),
            backgroundColor: "rgba(14, 116, 144, 0.75)",
          },
        ],
      }
    : null;

  const newsReportData = data
    ? {
        labels: data.newsReport.map((item) => (item.title.length > 28 ? `${item.title.slice(0, 28)}...` : item.title)),
        datasets: [
          {
            label: "Lượt xem",
            data: data.newsReport.map((item) => item.views),
            backgroundColor: "rgba(245, 158, 11, 0.8)",
          },
        ],
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bảng điều hành nghiệp vụ</h1>
            <p className="text-sm text-slate-500">Theo dõi số liệu vận hành và tình hình xử lý hồ sơ theo thời gian thực.</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            {data?.generatedAt ? `Cập nhật lúc ${new Date(data.generatedAt).toLocaleString("vi-VN")}` : "Đang cập nhật..."}
          </div>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Đang tải bảng điều hành...</div> : null}

      {!loading && data ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.tone}`}>
                    <stat.icon size={22} />
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm text-emerald-600">
                  <ArrowUpRight size={16} />
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Tiếp nhận và giải quyết theo ngày</h2>
                <span className="text-xs text-slate-500">Đơn vị: Hồ sơ</span>
              </div>
              <div className="h-72">
                {processingTrendData ? <Line data={processingTrendData} options={{ responsive: true, maintainAspectRatio: false }} /> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Thống kê truy cập theo ngày</h2>
                <Eye size={18} className="text-cyan-700" />
              </div>
              <div className="h-72">
                {trafficData ? <Bar data={trafficData} options={{ responsive: true, maintainAspectRatio: false }} /> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Tồn đọng theo thủ tục</h2>
                <ShieldAlert size={18} className="text-amber-600" />
              </div>
              <div className="h-72">
                <Bar
                  data={{
                    labels: data.backlog.map((item) => item.unit),
                    datasets: [{ label: "Tồn đọng", data: data.backlog.map((item) => item.pending), backgroundColor: "rgba(245, 158, 11, 0.8)" }],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Báo cáo tin tức nổi bật</h2>
                <Newspaper size={18} className="text-indigo-700" />
              </div>
              <div className="h-72">
                {newsReportData ? <Bar data={newsReportData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: "y" }} /> : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <BellRing size={18} className="text-blue-600" />
                <h2 className="text-lg font-bold">Công việc cần xử lý ngay</h2>
              </div>
              <div className="space-y-3">
                {data.quickTasks.map((task) => (
                  <div key={task.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-700">{task.label}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        task.level === "danger"
                          ? "bg-rose-100 text-rose-700"
                          : task.level === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {task.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-bold text-slate-900">Nhật ký hoạt động</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {data.activities.map((item, idx) => (
                  <div key={idx} className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{item.actor}</span> {item.action} <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
