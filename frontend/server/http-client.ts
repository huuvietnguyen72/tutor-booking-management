import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import { APP_SAVE_KEY } from "@/shared/constants/app";
import AUTH_PATHS from "./_paths/auth-path";
import { IAuthResponse } from "./_types/auth-type";
import { TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "./_constants/auth";


declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

class HttpClient {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: any[] = [];
  private noAuth: boolean;

  constructor(baseURL: string, noAuth: boolean) {
    this.noAuth = noAuth;
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!noAuth) {
      this.api.interceptors.request.use(
        (config) => {
          const accessToken = this.getAccessToken();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error),
      );
    }

    this.setupResponseInterceptor();
  }

  private setupResponseInterceptor() {
    this.api.interceptors.response.use(
      (response) => {
        const responseData = response.data as Record<string, unknown>;
        
        // Handle custom error codes in body
        const isAuthErrorInBody = responseData?.success === false && [401, 302].includes(responseData.code as number);
        
        // Handle the specific "authentication is null" message provided by the user
        const isAuthNullError = responseData?.success === false && 
          typeof responseData.message === "string" && 
          responseData.message.includes("authentication\" is null");

        if (isAuthErrorInBody || isAuthNullError) {
          const fakeError: AxiosError = Object.assign(new Error(isAuthNullError ? "Auth instance null" : "Auth error in body"), {
            response,
            config: response.config,
            isAxiosError: true,
            status: 401, // Force 401 for internal logic
          }) as AxiosError;
          throw fakeError;
        }
        return response;
      },
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) throw error;

        const responseData = error.response?.data as any;
        const status = error.response?.status || (error as any).status;
        
        // Handle specific "authentication is null" error even if it returns 400 or other codes
        const isAuthNullMessage = responseData?.success === false && 
          typeof responseData?.message === "string" && 
          responseData.message.includes("authentication\" is null");

        const originalRequest = error.config as InternalAxiosRequestConfig;
        
        const isNetworkError = !status && error.message === "Network Error";
        const hasAuthHeader = !!originalRequest?.headers?.["Authorization"] || !!originalRequest?.headers?.Authorization;
        const isAuthError = (status === 302 || status === 401 || status === 403) || 
                          (isAuthNullMessage) || 
                          (isNetworkError && hasAuthHeader);

        if (isAuthError && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers["Authorization"] = `Bearer ${token}`;
                }
                return this.api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newTokens = await this.refreshToken();
            
            const tokenOptions = { maxAge: TOKEN_MAX_AGE, path: "/" };
            const refreshTokenOptions = { maxAge: REFRESH_TOKEN_MAX_AGE, path: "/" };

            setCookie(APP_SAVE_KEY.TOKEN_KEY, newTokens.token, tokenOptions);
            setCookie(APP_SAVE_KEY.REFRESH_TOKEN_KEY, newTokens.refreshToken, refreshTokenOptions);

            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newTokens.token}`;
            }

            this.processQueue(null, newTokens.token);
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private async refreshToken(): Promise<IAuthResponse> {
    const refreshToken = getCookie(APP_SAVE_KEY.REFRESH_TOKEN_KEY) as string;
    if (!refreshToken) throw new Error("No refresh token found");

    // Use raw axios to completely avoid hitting interceptors, preventing infinite refresh loops
    const response = await axios.post<{ data: IAuthResponse }>(
      `${this.api.defaults.baseURL || ""}${AUTH_PATHS.REFRESH_TOKEN}`,
      {
        refreshToken,
      },
    );
    return response.data.data;
  }

  private handleAuthError() {
    deleteCookie(APP_SAVE_KEY.TOKEN_KEY, { path: "/" });
    deleteCookie(APP_SAVE_KEY.REFRESH_TOKEN_KEY, { path: "/" });
    
    // Avoid automatic redirect for instances configured without auth or when already on login/register pages
    if (typeof window !== "undefined" && !this.noAuth) {
      const isAuthPage = window.location.pathname.includes("/login") || window.location.pathname.includes("/register");
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
  }

  protected async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const config = error.config;
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data ||
          error.message;
        console.error(
          `[HttpClient] ${config?.method?.toUpperCase()} ${config?.url} failed:`,
          errorMessage,
        );
      }
      throw error;
    }
  }

  get<T>(url: string, configs?: AxiosRequestConfig) {
    return this.request<T>({ ...configs, method: "GET", url });
  }

  post<T>(url: string, data?: unknown, configs?: AxiosRequestConfig) {
    return this.request<T>({ ...configs, method: "POST", url, data });
  }

  put<T>(url: string, data?: unknown, configs?: AxiosRequestConfig) {
    return this.request<T>({ ...configs, method: "PUT", url, data });
  }

  patch<T>(url: string, data?: unknown, configs?: AxiosRequestConfig) {
    return this.request<T>({ ...configs, method: "PATCH", url, data });
  }

  delete<T>(url: string, configs?: AxiosRequestConfig) {
    return this.request<T>({ ...configs, method: "DELETE", url });
  }

  private getAccessToken(): string {
    return getCookie(APP_SAVE_KEY.TOKEN_KEY) as string;
  }
}

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const axiosInstance = new HttpClient(NEXT_PUBLIC_API_URL, false);
export const axiosInstanceNoAuth = new HttpClient(NEXT_PUBLIC_API_URL, true);
