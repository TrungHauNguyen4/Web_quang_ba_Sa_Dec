import { Link } from "react-router";
import { MapPin, Phone, Mail, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import { footerQuickLinks } from "../config/navigation";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-emerald-950 py-12 text-emerald-50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="container relative mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
            <span className="text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 8.25 3c1.804 0 3.56.71 4.75 1.95A6.73 6.73 0 0117.75 3c3.536 0 6 2.322 6 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </span>
            Sa Đéc
          </h3>
          <p className="max-w-xl text-sm leading-6 text-emerald-100/80">
            Cổng thông tin du lịch Sa Đéc được tối ưu theo hướng tra cứu nhanh, định hướng hành trình rõ ràng và hỗ trợ chuyển đổi mượt từ khám phá nội dung sang liên hệ hoặc sử dụng dịch vụ.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/ban-do"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition-colors hover:bg-orange-50"
            >
              Lập lịch trình <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/tin-tuc"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:text-white"
            >
              Theo dõi sự kiện
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Liên hệ</h4>
          <ul className="space-y-3 text-sm text-emerald-100/80">
            <li className="flex items-center gap-2"><MapPin size={16} /> UBND TP Sa Đéc, Đồng Tháp</li>
            <li className="flex items-center gap-2"><Phone size={16} /> 0277 3861 xxx</li>
            <li className="flex items-center gap-2"><Mail size={16} /> contact@sadec.gov.vn</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Liên kết nhanh</h4>
          <ul className="space-y-2 text-sm text-emerald-100/80">
            {footerQuickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <h4 className="text-lg font-semibold text-white">Mạng xã hội</h4>
          <div className="flex gap-4">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-orange-500 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-orange-500 hover:text-white">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto mt-8 border-t border-white/10 px-4 pt-8 text-center text-sm text-emerald-200/70">
        © 2026 Cổng thông tin du lịch TP. Sa Đéc. Thiết kế mẫu.
      </div>
    </footer>
  );
}
