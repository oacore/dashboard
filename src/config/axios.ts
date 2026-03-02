import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
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
      secure: import.meta.env.NODE_ENV === 'production', // Only secure in production
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
const V3_API_KEY = import.meta.env.VITE_API_KEY;

// Request interceptor - add cookies as headers if needed
API.interceptors.request.use((config) => {
  const requestUrl = config.url ?? config.baseURL ?? '';
  const useV3Auth = String(requestUrl).includes('/v3/');

  // /v3 endpoints require API key (Bearer), not JWT - CORE API v3 expects API key auth
  if (useV3Auth) {
    config.headers.Authorization = `Bearer ${V3_API_KEY}`;
    return config;
  }

  // /internal and other endpoints use session auth
  const authToken = cookieManager.get('AUTH_TOKEN_DEV');
  const sessionId = cookieManager.get('API_SESSION_ID_DEV');

  if (authToken) {
    config.headers['X-Auth-Token'] = authToken;
  }
  if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }

  if (!authToken && !sessionId) {
    const accessToken = localStorage.getItem('auth-token') || V3_API_KEY;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear all authentication data
      cookieManager.clearAuthCookies();
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth-token");

      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
