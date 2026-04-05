# Checklist dap ung yeu cau giang vien

Ngay cap nhat: 2026-04-04

## 1) Cac muc da bo sung trong dot nay

- [x] Tin tuc theo danh muc (public)
  - Them truong danh muc cho tin tuc (backend + frontend).
  - Them API lay danh muc va filter theo danh muc.
  - Them chip filter danh muc tai trang tin tuc cong khai.

- [x] Chia se bai viet tin tuc
  - Them nut `Chia se` su dung Web Share API.
  - Co fallback copy link vao clipboard.
  - Them link chia se Facebook.

- [x] Lien he co Google Maps
  - Thay placeholder bang iframe Google Maps embed tai trang lien he.

- [x] WYSIWYG editor cho quan tri tin tuc
  - Tich hop `react-quill` trong form tao/sua tin.
  - Preview noi dung HTML trong modal xem truoc.

- [x] Tang cuong an toan XSS cho noi dung rich text
  - Tich hop `dompurify` de sanitize HTML truoc khi render o client.

- [x] Audit logs (nhat ky hoat dong)
  - Them entity/table `AuditLogs`.
  - Them service ghi log.
  - Ghi log cho dang nhap thanh cong/that bai.
  - Ghi log cho cac thao tac quan ly tai khoan: tao, doi vai tro, xoa.
  - Dashboard doc nhat ky tu `AuditLogs`.

- [x] Dashboard theo Chart.js + bao cao truy cap/noi dung
  - Chuyen bieu do tu Recharts sang Chart.js (`react-chartjs-2`).
  - Them so lieu truy cap dua tren luot xem tin tuc.
  - Them bao cao top tin tuc theo luot xem.

- [x] Dong bo phan quyen Admin/Editor cho khu user-management
  - Route `/admin/users` chi cho role Admin.
  - Sidebar an menu Tai khoan/Vai tro voi non-Admin.

## 2) Cac goi da bo sung

- [x] react-quill
- [x] quill
- [x] chart.js
- [x] react-chartjs-2
- [x] dompurify

## 3) Database migration moi

- [x] Tao migration: `AddNewsCategoryAndAuditLogs`
- [x] File migration:
  - `Sadec.Api/Migrations/20260404121142_AddNewsCategoryAndAuditLogs.cs`
  - `Sadec.Api/Migrations/20260404121142_AddNewsCategoryAndAuditLogs.Designer.cs`

## 4) Kiem tra xay dung

- [x] Frontend build: `npm run build` (thanh cong)
- [x] Backend build: `dotnet build .\\Sadec.Api\\Sadec.Api.csproj` (thanh cong)

## 5) Huong dan cap nhat DB tren may chay

- Chay: `dotnet ef database update --project .\\Sadec.Api\\Sadec.Api.csproj --startup-project .\\Sadec.Api\\Sadec.Api.csproj`

