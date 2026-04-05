# Runbook - Local Dev, Migration, QA

## 1. Run backend

1. Restore and build:
   - `dotnet restore`
   - `dotnet build .\Sadec.Api\Sadec.Api.csproj`
2. Apply migrations:
   - `dotnet ef database update --project .\Sadec.Api\Sadec.Api.csproj`
3. Run API:
   - `dotnet run --project .\Sadec.Api\Sadec.Api.csproj`
4. Open Swagger:
   - `http://localhost:5090/swagger`

## 2. Run frontend

1. Install packages:
   - `npm ci`
2. Run dev server:
   - `npm run dev`
3. Frontend default URL:
   - `http://localhost:5173`

## 3. Auth quick test

1. Login via Swagger or Postman:
   - `POST /api/auth/login`
   - body:
     ```json
     {
       "username": "admin@sadec.local",
       "password": "Admin@123"
     }
     ```
2. Copy `token` and use `Authorization: Bearer <token>` for admin APIs.

## 4. Migration notes for staging/dev

- Keep `appsettings.Development.json` for local SQL Server.
- For staging, provide connection string via environment variables.
- When schema changes:
  1. `dotnet ef migrations add <Name> --project .\Sadec.Api\Sadec.Api.csproj`
  2. Commit migration files.
  3. Run `dotnet ef database update` on target environment.

## 5. QA smoke checklist

- Auth: login and refresh token work.
- News:
  - Public list/detail work.
  - Admin create/delete works with bearer token.
- Destinations:
  - Public list works.
  - Admin create/delete works.
- Media:
  - Admin upload works.
  - Public media endpoint returns uploaded files.
- Comments:
  - Submit comment creates Pending.
  - Admin approve/reject updates status.

## 6. CI

- Workflow file: `.github/workflows/ci.yml`
- Jobs:
  - Backend restore/build/test/publish artifact.
  - Frontend npm ci + build + artifact.
