import {
  FileCheck2,
  FileClock,
  FileWarning,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  BellRing,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const dossierTrend = [
  { day: "T2", received: 48, resolved: 42 },
  { day: "T3", received: 52, resolved: 39 },
  { day: "T4", received: 46, resolved: 44 },
  { day: "T5", received: 61, resolved: 50 },
  { day: "T6", received: 58, resolved: 47 },
  { day: "T7", received: 24, resolved: 20 },
  { day: "CN", received: 10, resolved: 8 },
];

const departmentBacklog = [
  { unit: "Tư pháp", pending: 21 },
  { unit: "Hộ tịch", pending: 15 },
  { unit: "Đất đai", pending: 17 },
  { unit: "Lao động", pending: 9 },
  { unit: "Văn hóa", pending: 12 },
];

export function Dashboard() {
  const stats = [
    {
      title: "Hồ sơ tiếp nhận hôm nay",
      value: "61",
      icon: FileSpreadsheet,
      tone: "bg-blue-50 text-blue-700",
      trend: "+8%",
      up: true,
    },
    {
      title: "Hồ sơ đang xử lý",
      value: "128",
      icon: FileClock,
      tone: "bg-amber-50 text-amber-700",
      trend: "+3%",
      up: false,
    },
    {
      title: "Hồ sơ quá hạn",
      value: "7",
      icon: FileWarning,
      tone: "bg-rose-50 text-rose-700",
      trend: "-2",
      up: true,
    },
    {
      title: "Hồ sơ đã hoàn tất",
      value: "1,294",
      icon: FileCheck2,
      tone: "bg-emerald-50 text-emerald-700",
      trend: "+11%",
      up: true,
    },
  ];

  const quickTasks = [
    { label: "Bình luận chờ duyệt", value: 6, level: "warning" },
    { label: "Tin tức cho xuất bản", value: 4, level: "info" },
    { label: "Hồ sơ cần bổ sung", value: 9, level: "warning" },
    { label: "Cảnh báo quá hạn", value: 2, level: "danger" },
  ];

  const activities = [
    { actor: "Nguyễn Văn A", action: "duyệt hồ sơ", target: "HS-2026-00142", time: "5 phút trước" },
    { actor: "Trần Thị B", action: "cập nhật tin", target: "Thông báo lịch tiếp dân", time: "18 phút trước" },
    { actor: "Lê Văn C", action: "từ chối hồ sơ", target: "HS-2026-00135", time: "41 phút trước" },
    { actor: "Hệ thống", action: "đồng bộ dữ liệu", target: "báo cáo ngày", time: "1 giờ trước" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bảng điều hành nghiệp vụ</h1>
            <p className="text-sm text-slate-500">Giám sát tiếp nhận, xử lý và trả kết quả hồ sơ hành chính cấp phường.</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            Phiên trực: 01/04/2026 - Cập nhật lúc 10:45
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <span className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.tone}`}>
                <stat.icon size={22} />
              </span>
            </div>
            <div className={`mt-3 flex items-center gap-1 text-sm ${stat.up ? "text-emerald-600" : "text-amber-600"}`}>
              {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {stat.trend}
              <span className="text-slate-400">so với tuần trước</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Tiếp nhận và giải quyết theo ngày</h2>
            <span className="text-xs text-slate-500">Đơn vị: Hồ sơ</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dossierTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Line type="monotone" dataKey="received" name="Tiếp nhận" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="resolved" name="Giải quyết" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Hồ sơ tồn theo bộ phận</h2>
            <ShieldAlert size={18} className="text-amber-600" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentBacklog}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="unit" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="pending" fill="#f59e0b" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            {quickTasks.map((task) => (
              <div key={task.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-700">{task.label}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.level === "danger" ? "bg-rose-100 text-rose-700" : task.level === "warning" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
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
            {activities.map((item, idx) => (
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
    </div>
  );
}




