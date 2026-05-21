import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Do not attach Bearer token (for public read endpoints). */
    skipAuth?: boolean;
    /** Do not clear session / redirect to login on auth errors. */
    skipAuthRedirect?: boolean;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE;

type ApiRequestConfig = InternalAxiosRequestConfig;

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

const isAuthSessionError = (error: AxiosError): boolean => {
  const status = error.response?.status;
  if (status === 401) return true;
  if (status === 403) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message?.toLowerCase() ??
      "";
    return (
      message.includes("admin access") ||
      message.includes("unauthorized") ||
      message.includes("invalid token") ||
      message.includes("jwt expired")
    );
  }
  return false;
};

// Request interceptor → attach token
apiClient.interceptors.request.use((config) => {
  const apiConfig = config as ApiRequestConfig;
  if (apiConfig.skipAuth) return config;

  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor → logout only on real session/auth failures
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiConfig = (error.config ?? {}) as ApiRequestConfig;
    const isLoginRequest = apiConfig.url?.includes("/admin/login");

    if (
      !apiConfig.skipAuthRedirect &&
      !isLoginRequest &&
      isAuthSessionError(error)
    ) {
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
