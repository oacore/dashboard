import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { handleUnauthorized } from './auth401Handler';
import { env } from './env';

export const API = axios.create({
  baseURL: env.IDP_URL,
  headers: {
    "Content-Type": "application/json",
    'x-custom-dashboard-header': 'true',
  },
  timeout: 900000, // 15 minutes in milliseconds
  withCredentials: true, // Enable cookies to be sent with requests
});

export const http = {
  get: async <T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await API.get<T>(path, config);
  },
  post: async <T>(
    path: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await API.post<T>(path, data, config);
  },
  put: async <T>(
    path: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await API.put<T>(path, data, config);
  },
  patch: async <T>(
    path: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await API.patch<T>(path, data, config);
  },
  delete: async <T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return await API.delete<T>(path, config);
  },
};

// Cookie management using js-cookie
export const cookieManager = {
  // Get cookie value
  get: (name: string): string | undefined => {
    return Cookies.get(name);
  },

  // Set cookie with options
  set: (name: string, value: string, options?: Cookies.CookieAttributes): void => {
    const defaultOptions: Cookies.CookieAttributes = {
      expires: 7, // 7 days
      path: '/',
      sameSite: 'lax',
      secure: import.meta.env.MODE === 'production',
    };

    Cookies.set(name, value, { ...defaultOptions, ...options });
  },

  // Remove cookie
  remove: (name: string, options?: Cookies.CookieAttributes): void => {
    const defaultOptions: Cookies.CookieAttributes = {
      path: '/',
      sameSite: 'lax',
    };

    Cookies.remove(name, { ...defaultOptions, ...options });
  },

  // Check if cookie exists
  exists: (name: string): boolean => {
    return Cookies.get(name) !== undefined;
  },

  // Get multiple cookies at once
  getAuthCookies: () => {
    return {
      authToken: Cookies.get('AUTH_TOKEN_DEV'),
      sessionId: Cookies.get('API_SESSION_ID_DEV'),
    };
  },

  // Clear all auth-related cookies
  clearAuthCookies: (): void => {
    Cookies.remove('AUTH_TOKEN_DEV', { path: '/' });
    Cookies.remove('API_SESSION_ID_DEV', { path: '/' });
    Cookies.remove('access_token', { path: '/' });
  }
};

// V3 API uses API key auth; /internal uses session/JWT
const V3_API_KEY = env.API_KEY;

// Request interceptor
// Session auth: credentials: 'include' sends cookies automatically; server sets session via Set-Cookie
API.interceptors.request.use((config) => {
  const requestUrl = config.url ?? config.baseURL ?? '';
  const useV3Auth = String(requestUrl).includes('/v3/');

  // /v3 endpoints require API key - CORE API v3 expects API key auth
  if (useV3Auth) {
    config.headers.Authorization = `Bearer ${V3_API_KEY}`;
    return config;
  }

  // /internal and other session endpoints: no manual auth headers
  // Cookies are sent automatically via withCredentials: true
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = String(error.config?.url ?? error.config?.baseURL ?? '');
      const isInternalApi = requestUrl.includes('/internal/');
      const isAuthEndpoint = requestUrl.includes('login_check') || requestUrl.includes('/logout');

      if (isInternalApi && !isAuthEndpoint) {
        cookieManager.clearAuthCookies();
        handleUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);
