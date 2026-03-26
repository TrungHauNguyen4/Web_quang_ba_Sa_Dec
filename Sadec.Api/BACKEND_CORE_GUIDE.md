# Backend Core Guide (Member 1 + Member 2 Handoff)

Tài liệu này là bản bàn giao thực tế cho các member còn lại để thay frontend hard-code sang API thật nhanh và ít rủi ro.

## 1) Phạm vi đã hoàn thành

### 1.1 Backend Core (Member 1)
- EF Core + SQL Server + migrations.
- CRUD News và Destinations.
- Public routes cho trang người dùng, admin routes cho dashboard.
- Paging/filter cho list endpoint.

### 1.2 Auth & Users (Member 2)
- ASP.NET Identity + JWT.
- Seed role `Admin`, `Editor`, `Viewer`.
- Seed user mẫu `admin@sadec.local`, `editor@sadec.local`, `viewer@sadec.local`.
- Auth endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/refresh-token` (alias tương thích)

## 2) API contract đã chốt (dùng để frontend migrate)

### 2.1 News
- Public:
  - `GET /api/news?page=1&pageSize=10&q=...`
  - `GET /api/news/{id}`
  - `GET /api/news/slug/{slug}`
- Admin (`Bearer`, role `Admin|Editor`):
  - `GET /api/admin/news?page=1&pageSize=20&q=...&status=0|1|2`
  - `POST /api/admin/news`
  - `PUT /api/admin/news/{id}`
  - `DELETE /api/admin/news/{id}`

List response dùng chuẩn phân trang:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "total": 0,
  "totalPages": 0
}
```

### 2.2 Destinations
- Public:
  - `GET /api/destinations?page=1&pageSize=10&q=...`
  - `GET /api/destinations/{id}`
  - `GET /api/destinations/slug/{slug}`
- Admin (`Bearer`, role `Admin|Editor`):
  - `GET /api/admin/destinations?page=1&pageSize=20&q=...&status=0|1|2`
  - `POST /api/admin/destinations`
  - `PUT /api/admin/destinations/{id}`
  - `DELETE /api/admin/destinations/{id}`

List response dùng cùng chuẩn phân trang như News.

### 2.3 Auth
- `POST /api/auth/login`

Request:

```json
{
  "username": "admin@sadec.local",
  "password": "Admin@123"
}
```

Response:

```json
{
  "token": "<jwt>",
  "refreshToken": "<refresh-token>",
  "user": {
    "id": "...",
    "displayName": "Admin",
    "email": "admin@sadec.local",
    "role": "Admin"
  }
}
```

- `POST /api/auth/refresh` (khuyến nghị dùng route này)

Request:

```json
{
  "token": "<jwt-cu>",
  "refreshToken": "<refresh-token-cu>"
}
```

## 3) Validation rules quan trọng

- `title`: bắt buộc, độ dài 3-200.
- `slug`: bắt buộc, độ dài 3-200, format `kebab-case` (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
- `excerpt`: tối đa 500 ký tự.
- `username`: tối thiểu 3 ký tự.
- `password`: tối thiểu 6 ký tự.

## 4) CORS cho frontend team

Đang đọc từ `Cors:AllowedOrigins` trong appsettings.

Mặc định development:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:4173`

Nếu frontend chạy domain khác, chỉ cần thêm vào `AllowedOrigins`.

## 5) Chạy backend local

Từ root repo:

1. `dotnet restore`
2. `dotnet build .\Sadec.Api\Sadec.Api.csproj`
3. `dotnet run --project .\Sadec.Api\Sadec.Api.csproj`
4. Mở Swagger tại `http://localhost:5090/swagger`

## 6) Checklist bàn giao cho Member 3-5

- Contract Auth/News/Destinations đã ổn định.
- Frontend phải đọc dữ liệu phân trang từ `items` thay vì mảng trực tiếp.
- Admin call phải gửi `Authorization: Bearer <token>`.
- Route refresh thống nhất dùng `/api/auth/refresh`.
- Nếu cần tương thích code cũ, `/api/auth/refresh-token` vẫn hoạt động.

## 7) Ghi chú cho frontend migration

- Ưu tiên migrate theo thứ tự:
  1. Login
  2. Admin News
  3. Admin Destinations
  4. Public News và Public Destinations
- Các màn hình Media/Comments/Users/Services sẽ nối API sau khi Member 3-4 hoàn thành endpoint tương ứng.
