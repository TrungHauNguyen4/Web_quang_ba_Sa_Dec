import { 
  Users, 
  MapPin, 
  Newspaper, 
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const trafficData = [
  { name: 'T2', visitors: 4000 },
  { name: 'T3', visitors: 3000 },
  { name: 'T4', visitors: 2000 },
  { name: 'T5', visitors: 2780 },
  { name: 'T6', visitors: 1890 },
  { name: 'T7', visitors: 2390 },
  { name: 'CN', visitors: 3490 },
];

const postData = [
  { name: 'Tuần 1', posts: 12 },
  { name: 'Tuần 2', posts: 19 },
  { name: 'Tuần 3', posts: 15 },
  { name: 'Tuần 4', posts: 22 },
];

export function Dashboard() {
  const stats = [
    { title: "Tổng Bài Viết", value: "156", icon: Newspaper, color: "bg-blue-50 text-blue-600", trend: "+12%", isUp: true },
    { title: "Tổng Địa Danh", value: "42", icon: MapPin, color: "bg-orange-50 text-orange-600", trend: "+2%", isUp: true },
    { title: "Tổng Người Dùng", value: "1,204", icon: Users, color: "bg-purple-50 text-purple-600", trend: "+18%", isUp: true },
    { title: "Hồ Sơ Dịch Vụ", value: "89", icon: FileText, color: "bg-green-50 text-green-600", trend: "-5%", isUp: false },
  ];

  const activities = [
    { user: "Nguyễn Văn A", action: "đã thêm bài viết mới", target: "Lễ hội Hoa Xuân 2026", time: "10 phút trước" },
    { user: "Trần Thị B", action: "đã cập nhật địa danh", target: "Chùa Kiến An Cung", time: "1 giờ trước" },
    { user: "Lê Văn C", action: "đã duyệt hồ sơ", target: "HS-12345", time: "3 giờ trước" },
    { user: "Hệ thống", action: "đã sao lưu dữ liệu định kỳ", target: "", time: "5 giờ trước" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Tổng Quan</h1>
        <div className="text-sm text-stone-500">Cập nhật lần cuối: Hôm nay, 08:00 AM</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-stone-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-stone-800">{stat.value}</h3>
              <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.trend} <span className="text-stone-400 font-normal">so với tháng trước</span>
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={28} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-800">Lưu Lượng Truy Cập</h2>
            <select className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-green-500 bg-stone-50">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>Năm nay</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#16a34a', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="visitors" stroke="#16a34a" strokeWidth={3} dot={{r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-800">Bài Viết Mới</h2>
            <TrendingUp size={20} className="text-stone-400" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="posts" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"
      >
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">Hoạt Động Gần Đây</h2>
          <button className="text-sm text-green-600 font-medium hover:text-green-700">Xem tất cả</button>
        </div>
        <div className="divide-y divide-stone-100">
          {activities.map((activity, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold shrink-0 text-sm">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-stone-800">
                    <span className="font-semibold">{activity.user}</span> {activity.action} {activity.target && <span className="font-medium text-stone-600">"{activity.target}"</span>}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
