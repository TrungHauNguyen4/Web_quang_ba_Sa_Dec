
  # Fulfill attached request

  This is a code bundle for Fulfill attached request. The original project is available at https://www.figma.com/design/gsZAw0gaaUYCNexrLCpclo/Fulfill-attached-request.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  

 

**Tóm tắt mục tiêu**
- Xây backend ASP.NET Core (REST API) + SQL Server để thay thế dữ liệu giả trên frontend `fulfill attached request`.  
- MVP: News, Destinations, Cuisines, Comments, Media upload, Auth (JWT, role Admin/Editor), basic admin CRUD + comment moderation.

**Phân công 5 người (branch tên gợi ý)**
- **Member 1 — Backend Lead** (`feature/backend-core`): thiết kế DB & entities, `ApplicationDbContext`, migrations, CRUD cơ bản cho `News` và `Destinations`. Deliverable: migrations + controllers + DTOs + Swagger.
- **Member 2 — Auth & Users** (`feature/auth`): cấu hình Identity + JWT, seed roles/admin, endpoints `login`/`refresh`, authorize policies. Deliverable: auth controller + docs cách lấy token.
- **Member 3 — Media & Uploads** (`feature/media`): endpoint upload `POST /api/admin/media/upload` (IFormFile) lưu vào `wwwroot/uploads/`, tạo bảng `MediaFiles`, trả URL. Deliverable: storage service + upload controller.
- **Member 4 — API & Business Logic** (`feature/api-services`): services layer, validation, comment flow (`POST /api/comments`, admin moderation), service applications (optional). Deliverable: service classes, unit tests for core flows.
- **Member 5 — Integration, QA & CI** (`feature/ci-qa`): tích hợp frontend calls mẫu (docs), viết README + Postman collection, CI build pipeline (GitHub Actions), chạy migration script trong staging/dev. Deliverable: README.md, Postman, CI workflow.

**Sprint & thứ tự ưu tiên (đơn giản, 2 sprint)**
- **Sprint 1 (days 1–7)**: Backend Lead + Auth + Media → DB schema, migrations, CRUD `News`/`Destinations`, Auth JWT, upload endpoint, Swagger.  
- **Sprint 2 (days 8–14)**: API services (comments, moderation), frontend integration, CI/QA, docs, final polish.

**Tasks chi tiết (mỗi member)**
- **Backend Lead**
  - Tạo project `Sadec.Api` (dotnet new webapi).  
  - Thêm EF Core SQL Server, tạo entities: User (Identity), News, Destination, MediaFile, Comment.  
  - Migrations: `InitialCreate`.  
  - Controllers CRUD cho News & Destinations (paging/filter).
- **Auth & Users**
  - Cấu hình Identity + JWT, create seed (Admin/Editor/Viewer).  
  - Endpoints `POST /api/auth/login`, `POST /api/auth/refresh`.  
  - Middleware `[Authorize(Roles="Admin,Editor")]`.
- **Media & Uploads**
  - Implement `POST /api/admin/media/upload` (validate size/type), save to `wwwroot/uploads/{yyyy}/{mm}/guid.ext`.  
  - Tạo `MediaFiles` record, trả `{ id, url }`.  
  - Ensure `app.UseStaticFiles()`.
- **API & Business Logic**
  - Implement comments: `POST /api/comments` (status=pending), admin endpoints to list/approve/reject.  
  - Add validation (FluentValidation optional) and error handling middleware.
- **Integration, QA & CI**
  - Provide sample API client functions (fetch examples) for frontend team.  
  - Create Postman collection + runbook.  
  - Add simple GitHub Actions: build backend, run unit tests, publish artifact.  
  - Document local dev DB connection / migration steps.

**Branching & PR rules (student-friendly)**
- Branch pattern: `feature/<short>` from `develop` (or directly from `main` if simple).  
- PR checklist: 1 reviewer, CI green, migrations included if schema changed, small PRs (<300 LOC).  
- Merge only after README update for new endpoints.

**Minimal DB schema (summary)**
- Users (Identity): Id, UserName, Email, Role, PasswordHash, CreatedAt  
- News: Id, Title, Slug, Excerpt, Content, Status, AuthorId, PublishedAt, CreatedAt  
- Destinations: Id, Title, Slug, Excerpt, Content, Lat, Lon, Status, CreatedAt  
- MediaFiles: Id, FileName, Url, MimeType, SizeBytes, UploadedBy, UploadedAt  
- Comments: Id, TargetType, TargetId, UserName, Email, Content, Status, CreatedAt

**API ưu tiên cần làm đầu tiên**
- Auth: `POST /api/auth/login`  
- News: `GET /api/news`, `GET /api/news/{id}`, `POST/PUT/DELETE /api/admin/news`  
- Destinations: `GET /api/destinations`, admin CRUD  
- Media: `POST /api/admin/media/upload`  
- Comments: `POST /api/comments`, admin moderation endpoints

**Comments & moderation (implemented)**
- `POST /api/comments`
- `GET /api/comments?targetType=news|destination&targetId={guid}`
- `GET /api/admin/comments?page=1&pageSize=20&status=Pending|Approved|Rejected`
- `PATCH /api/admin/comments/{commentId}/approve`
- `PATCH /api/admin/comments/{commentId}/reject`

**Run tests**
- `dotnet test Sadec.Api.Tests/Sadec.Api.Tests.csproj`

**Đơn giản hóa triển khai cho sinh viên**
- Lưu file vào `wwwroot/uploads/` (không dùng cloud).  
- Dùng local SQL Server / SQL Server Express (connection string trong `appsettings.Development.json`).  
- Seed 1 admin user; không cần refresh token nếu muốn giảm phức tạp (chỉ JWT đơn giản).

**PR/Review checklist (tối giản)**
- API endpoints documented in Swagger.  
- Migrations + seed script included.  
- Có sample curl/Postman for main flows.  
- Basic input validation and file size/type check.  
- One reviewer approves.

**Estimates (rough, per member, in days)**
- Backend Lead: 4–6d, Auth: 2–4d, Media: 2–3d, API logic: 3–5d, CI/QA/docs: 2–4d. (Làm song song → tổng ~10 werkdagen)

**Next immediate steps (đơn giản, 3 bước)**
- 1) Tạo 5 branch theo tên đề xuất và assign owners.  
- 2) Tạo issues nhỏ cho từng task (mỗi branch ít nhất 3 issue).  
- 3) Backend Lead khởi tạo repo backend folder (`Sadec.Api`) hoặc giải thích cách đặt trong mono-repo; push skeleton project trước để others branch off.

