import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Globe, Users, Landmark, Phone, Mail, MapPin } from "lucide-react";
import { settingsService, SystemSettingsDto } from "../services/settings.service";
import { destinationService } from "../services/destination.service";
import { serviceApplicationService } from "../services/service-application.service";
import { newsService } from "../services/news.service";

export function About() {
  const [settings, setSettings] = useState<SystemSettingsDto | null>(null);
  const [metrics, setMetrics] = useState({ destinations: 0, services: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [settingsData, destinationsData, servicesData, newsData] = await Promise.all([
          settingsService.getPublic(),
          destinationService.getAll({ page: 1, pageSize: 1 }),
          serviceApplicationService.getPublicServices(),
          newsService.getAll({ page: 1, pageSize: 1 }),
        ]);

        if (!active) return;
        setSettings(settingsData);
        setMetrics({
          destinations: Number(destinationsData?.total) || 0,
          services: Array.isArray(servicesData) ? servicesData.length : 0,
          news: Number(newsData?.total) || 0,
        });
      } catch {
        if (!active) return;
        setSettings(null);
        setMetrics({ destinations: 0, services: 0, news: 0 });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const overviewRows = useMemo(
    () => [
      { label: "Tên cổng thông tin", value: settings?.siteName || "Chưa cấu hình" },
      { label: "Khẩu hiệu", value: settings?.slogan || "Chưa cấu hình" },
      { label: "Mô tả điều hành", value: settings?.seoDescription || "Chưa cấu hình" },
      { label: "Số thủ tục công khai", value: `${metrics.services}` },
      { label: "Số địa danh công khai", value: `${metrics.destinations}` },
      { label: "Số bản tin đã công bố", value: `${metrics.news}` },
    ],
    [metrics.destinations, metrics.news, metrics.services, settings?.seoDescription, settings?.siteName, settings?.slogan]
  );

  return (
    <div className="w-full bg-slate-100 min-h-screen">
      <section className="relative h-[56vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920"
            alt="About"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/75" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-4 text-blue-300">
            <Landmark size={32} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold mb-4">
            {settings?.siteName || "Giới thiệu địa phương"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-200 max-w-2xl mx-auto">
            {settings?.slogan || "Tổng quan về tổ chức hành chính, hạ tầng và định hướng phát triển phục vụ người dân."}
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4 text-blue-700">
                <Globe size={20} />
                <h2 className="text-xl font-bold text-slate-900">Thông tin điều hành công khai</h2>
              </div>
              <div className="space-y-3">
                {overviewRows.map((row) => (
                  <div key={row.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.08em] text-slate-500">{row.label}</div>
                    <div className="mt-1 text-slate-800 font-medium">{row.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4 text-blue-700">
                <Users size={20} />
                <h2 className="text-xl font-bold text-slate-900">Đầu mối liên hệ</h2>
              </div>
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <Phone size={16} className="mt-0.5 text-blue-600" />
                  <span>{settings?.contactPhone || "Chưa cập nhật số điện thoại"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={16} className="mt-0.5 text-blue-600" />
                  <span>{settings?.contactEmail || "Chưa cập nhật email"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-blue-600" />
                  <span>{settings?.contactAddress || "Chưa cập nhật địa chỉ"}</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          {loading ? <div className="mb-6 text-center text-sm text-slate-300">Đang đồng bộ dữ liệu giới thiệu...</div> : null}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">{metrics.destinations}</div>
              <div className="text-slate-300 font-medium">Địa danh đã công khai</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">{metrics.services}</div>
              <div className="text-slate-300 font-medium">Thủ tục đang hoạt động</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">{metrics.news}</div>
              <div className="text-slate-300 font-medium">Tin tức đã xuất bản</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">{settings?.contactPhone ? "01" : "00"}</div>
              <div className="text-slate-300 font-medium">Đầu mối liên hệ công khai</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




