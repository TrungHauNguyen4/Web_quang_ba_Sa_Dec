import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes('azurestaticapps.net') 
    ? 'https://sadec-backend.azurewebsites.net/api' 
    : 'http://localhost:5000/api');
const AUTH_PATHS = ["/auth/login", "/auth/refresh", "/auth/refresh-token"];

export const api = axios.create({
  baseURL: API_BASE_URL,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;
let configured = false;

function isAuthRequest(url?: string): boolean {
  if (!url) return false;
  return AUTH_PATHS.some((path) => url.includes(path));
}

function readJwtExpiryMs(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (typeof payload?.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

function clearSessionStorage(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenIssuedAt");
  localStorage.removeItem("tokenExpiresAt");
  localStorage.removeItem("user");
}

function persistAuthTokens(accessToken: string, refreshToken?: string | null): void {
  localStorage.setItem("token", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  const now = Date.now();
  localStorage.setItem("tokenIssuedAt", String(now));
  const expiresAt = readJwtExpiryMs(accessToken);
  if (expiresAt) {
    localStorage.setItem("tokenExpiresAt", String(expiresAt));
  } else {
    localStorage.removeItem("tokenExpiresAt");
  }
}

async function doRefreshToken(): Promise<string | null> {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!token || !refreshToken) return null;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { token, refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    const nextToken: string | undefined = response.data?.token ?? response.data?.Token;
    const nextRefreshToken: string | undefined = response.data?.refreshToken ?? response.data?.RefreshToken;
    if (!nextToken) return null;

    persistAuthTokens(nextToken, nextRefreshToken);
    return nextToken;
  } catch {
    return null;
  }
}

function redirectToLoginIfNeeded(): void {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config) => {
      if (!isAuthRequest(config.url)) {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const request = error.config as RetryableRequestConfig | undefined;
      const status = error.response?.status;

      if (!request || status !== 401 || request._retry || isAuthRequest(request.url)) {
        return Promise.reject(error);
      }

      request._retry = true;

      if (!refreshPromise) {
        refreshPromise = doRefreshToken().finally(() => {
          refreshPromise = null;
        });
      }

      const nextToken = await refreshPromise;
      if (!nextToken) {
        clearSessionStorage();
        redirectToLoginIfNeeded();
        return Promise.reject(error);
      }

      request.headers = request.headers ?? {};
      request.headers.Authorization = `Bearer ${nextToken}`;
      return client(request);
    }
  );
}

export function configureApiAuth(): void {
  if (configured) return;
  configured = true;

  attachInterceptors(axios);
  attachInterceptors(api);
}

configureApiAuth();
