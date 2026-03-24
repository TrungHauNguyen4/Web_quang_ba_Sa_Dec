# Backend Core Guide (Member 1 — Backend Lead)

Tài liệu này giải thích những gì đã được tạo trong `Sadec.Api` và cách bạn chạy / migrate / test API.

## 1) Những thứ đã implement (deliverable)

### 1.1 EF Core + SQL Server
- Đã thêm EF Core SQL Server vào project.
- `ApplicationDbContext` quản lý 2 bảng:
  - `News`
  - `Destinations`

### 1.2 Entities
Nằm trong thư mục `Sadec.Api/Entities/`:
- `News` (tin tức)
- `Destination` (địa danh)
- `ContentStatus` (Draft/Published/Archived)

### 1.3 DTOs
Nằm trong thư mục `Sadec.Api/Dtos/`:
- `NewsDtos.cs`: `NewsDto`, `NewsCreateDto`, `NewsUpdateDto`
- `DestinationDtos.cs`: `DestinationDto`, `DestinationCreateDto`, `DestinationUpdateDto`

### 1.4 Controllers (CRUD)
Nằm trong thư mục `Sadec.Api/Controllers/`:
- `NewsController`:
  - `GET    /api/news`
  - `GET    /api/news/{id}`
  - `POST   /api/news`
  - `PUT    /api/news/{id}`
  - `DELETE /api/news/{id}`
- `DestinationsController`:
  - `GET    /api/destinations`
  - `GET    /api/destinations/{id}`
  - `POST   /api/destinations`
  - `PUT    /api/destinations/{id}`
  - `DELETE /api/destinations/{id}`

### 1.5 Migrations
- Đã tạo migration `InitialCreate` trong `Sadec.Api/Migrations/`.
- Migration tạo bảng + unique index cho `Slug`.

### 1.6 Swagger
- Khi chạy ở môi trường `Development`, có Swagger UI:
  - `http://localhost:5090/swagger`

## 2) Lưu ý quan trọng về .NET SDK (global.json)

Máy của bạn có cả .NET SDK 9 và 10.
- SDK 10 đang bị lỗi workload manifest nên build có thể fail.
- Repo đã thêm `global.json` để pin SDK về **9.0.308**, giúp `dotnet build` / EF migrations chạy ổn định.

## 3) Cấu hình Database

Connection string đang để trong:
- `Sadec.Api/appsettings.json`
- `Sadec.Api/appsettings.Development.json`

Mặc định đang dùng SQL Server Express instance thật trên máy Windows:

`Server=.\\SQLEXPRESS;Database=SadecDb;Trusted_Connection=True;MultipleActiveResultSets=true;Encrypt=True;TrustServerCertificate=True`

Nếu bạn dùng SQL Server instance khác, chỉ cần thay `DefaultConnection` theo máy bạn.

### Override connection string không sửa file
Bạn có thể override bằng biến môi trường (phù hợp CI/CD):
- `ConnectionStrings__DefaultConnection=Server=...;Database=...;...`

## 4) Chạy backend (dev)

Từ thư mục root của repo:

1) Restore + build:
- `dotnet restore`
- `dotnet build .\Sadec.Api\Sadec.Api.csproj`

2) Chạy API:
- `dotnet run --project .\Sadec.Api\Sadec.Api.csproj`

Mặc định profile đang set:
- `http://localhost:5090`
- `https://localhost:7175`

3) Mở Swagger:
- `http://localhost:5090/swagger`

## 5) EF Core migrations (tạo/sửa DB schema)

Repo đã cài `dotnet-ef` dạng **local tool** (manifest ở `.config/dotnet-tools.json`).

### 5.1 Tạo migration mới
Ví dụ thêm field mới rồi tạo migration:

- `dotnet tool run dotnet-ef migrations add AddSomething \
  --project .\Sadec.Api\Sadec.Api.csproj \
  --startup-project .\Sadec.Api\Sadec.Api.csproj \
  --output-dir Migrations`

### 5.2 Update database
- `dotnet tool run dotnet-ef database update \
  --project .\Sadec.Api\Sadec.Api.csproj \
  --startup-project .\Sadec.Api\Sadec.Api.csproj`

### 5.3 Xoá migration vừa tạo (nếu chưa apply)
- `dotnet tool run dotnet-ef migrations remove \
  --project .\Sadec.Api\Sadec.Api.csproj \
  --startup-project .\Sadec.Api\Sadec.Api.csproj`

## 6) Test nhanh bằng file .http

Mở file `Sadec.Api/Sadec.Api.http` trong VS Code và bấm `Send Request`.
- Có sẵn mẫu request: list/create News và Destinations.

## 7) Quy ước dữ liệu / lỗi thường gặp

- `Slug` là unique (không được trùng). Nếu trùng API trả `409 Conflict`.
- Enum `ContentStatus` hiện đang gửi/nhận dạng số (mặc định của .NET):
  - `0` = Draft
  - `1` = Published
  - `2` = Archived

## 8) Next step gợi ý (khi sang Member 2 / Auth)

Khi có JWT/role:
- Bạn có thể khóa `POST/PUT/DELETE` bằng `[Authorize(Roles = "Admin,Editor")]`.
- Giữ `GET` public để frontend hiển thị.
