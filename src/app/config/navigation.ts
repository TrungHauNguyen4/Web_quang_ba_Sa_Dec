export type PublicNavigationItem = {
  label: string;
  path: string;
  description: string;
};

export const publicNavigation: PublicNavigationItem[] = [
  { label: "Trang chủ", path: "/", description: "Khám phá tổng quan Sa Đéc" },
  { label: "Địa danh", path: "/dia-danh", description: "Điểm đến nổi bật và di sản" },
  { label: "Ẩm thực", path: "/am-thuc", description: "Đặc sản và trải nghiệm địa phương" },
  { label: "Bản đồ", path: "/ban-do", description: "Lập hành trình tham quan" },
  { label: "Tin tức", path: "/tin-tuc", description: "Cập nhật hoạt động và sự kiện" },
  { label: "Giới thiệu", path: "/gioi-thieu", description: "Thông tin về Sa Đéc" },
  { label: "Thư viện", path: "/thu-vien", description: "Hình ảnh và video" },
  { label: "Dịch vụ", path: "/dich-vu", description: "Dịch vụ hành chính công" },
  { label: "Liên hệ", path: "/lien-he", description: "Kết nối với ban quản lý" },
];

export const footerQuickLinks = publicNavigation.filter(({ path }) =>
  ["/dia-danh", "/am-thuc", "/dich-vu", "/tin-tuc"].includes(path),
);