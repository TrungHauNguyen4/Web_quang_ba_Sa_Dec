export type PublicNavigationItem = {
  label: string;
  path: string;
  description: string;
};

export const publicNavigation: PublicNavigationItem[] = [
  { label: "Trang chủ", path: "/", description: "Cổng thông tin phường/xã" },
  { label: "Địa bàn", path: "/dia-danh", description: "Thông tin khu vực, điểm công cộng" },
  { label: "Văn hóa & đời sống", path: "/am-thuc", description: "Hoạt động cộng đồng, ẩm thực địa phương" },
  { label: "Bản đồ", path: "/ban-do", description: "Vị trí trụ sở, cơ sở hạ tầng" },
  { label: "Tin tức", path: "/tin-tuc", description: "Thông báo, văn bản, sự kiện" },
  { label: "Giới thiệu", path: "/gioi-thieu", description: "Tổng quan phường/xã" },
  { label: "Thư viện", path: "/thu-vien", description: "Hình ảnh, video minh bạch" },
  { label: "Dịch vụ", path: "/dich-vu", description: "Dịch vụ công trực tuyến" },
  { label: "Liên hệ", path: "/lien-he", description: "Phản ánh, hỗ trợ người dân" },
];

export const footerQuickLinks = publicNavigation.filter(({ path }) =>
  ["/dia-danh", "/am-thuc", "/dich-vu", "/tin-tuc"].includes(path),
);