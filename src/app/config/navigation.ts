export type PublicNavigationItem = {
  label: string;
  path: string;
  description: string;
};

export const publicNavigation: PublicNavigationItem[] = [
  { label: "TRANG CHỦ", path: "/", description: "Cổng thông tin điện tử" },
  { label: "DỊCH VỤ CÔNG", path: "/dich-vu", description: "Dịch vụ công và thủ tục" },
  { label: "CÔNG DÂN", path: "/lien-he", description: "Phản ánh kiến nghị" },
  { label: "ĐẶC SẢN", path: "/am-thuc", description: "Ẩm thực và sản vật địa phương" },
  { label: "DU KHÁCH", path: "/dia-danh", description: "Thông tin địa bàn" },
  { label: "CHÍNH QUYỀN", path: "/gioi-thieu", description: "Điều hành và giới thiệu" },
  { label: "TIN TỨC", path: "/tin-tuc", description: "Thông báo văn bản" },
  { label: "THƯ VIỆN", path: "/thu-vien", description: "Thư viện ảnh và video" },
];

export const footerQuickLinks = publicNavigation.filter(({ path }) =>
  ["/dia-danh", "/am-thuc", "/dich-vu", "/tin-tuc", "/lien-he"].includes(path),
);


