import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";

export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
  errors?: string;
  meta?: {
    [key: string]: any;
  };
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface TokenManager {
  getAccessToken: () => string | undefined;
  getRefreshToken: () => string | undefined;
  setTokens: (tokens: TokenResponse) => void;
  clearTokens: () => void;
}

interface ApiServiceOptions {
  baseURL?: string;
  timeout?: number;
  tokenManager?: TokenManager;
  onAuthError?: () => void;
  onTokenRefreshed?: () => void;
}

// Token Manager - được đơn giản hóa
const createCookieTokenManager = (): TokenManager => ({
  getAccessToken: () => Cookies.get("access_token"),
  getRefreshToken: () => Cookies.get("refresh_token"),
  setTokens: (tokens: TokenResponse) => {
    Cookies.set("access_token", tokens.access_token, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refresh_token", tokens.refresh_token, {
      secure: true,
      sameSite: "strict",
    });
  },
  clearTokens: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  },
});

const createHttpMethod = <T>(
  apiInstance: AxiosInstance,
  API_PREFIX: string,
  handleResponse: (response: AxiosResponse<T>) => ApiResponse<T>,
  method: "get" | "post" | "put" | "delete"
) => {
  return async (
    endpoint: string,
    dataOrParams?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      let response;
      const url = `${API_PREFIX}${endpoint}`;

      switch (method) {
        case "get":
          response = await apiInstance.get<T>(url, {
            ...config,
            params: dataOrParams,
          });
          break;
        case "delete":
          response = await apiInstance.delete<T>(url, config);
          break;
        case "post":
          response = await apiInstance.post<T>(url, dataOrParams, config);
          break;
        case "put":
          response = await apiInstance.put<T>(url, dataOrParams, config);
          break;
      }

      return handleResponse(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        // Đảm bảo lỗi được định dạng theo cấu trúc API phản hồi
        const errorResponse: ApiResponse = {
          code: error.response?.status || 500,
          message: error.message || "Network error",
          data: null,
          errors: error.response?.data?.errors || error.message,
          meta: error.response?.data?.meta || {},
        };
        throw errorResponse;
      }
      throw error;
    }
  };
};

export const useApi = (options?: ApiServiceOptions) => {
  // Config
  const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
  const baseURL =
    options?.baseURL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8000";
  const timeout = options?.timeout || 5*60*1000;
  const tokenManager = options?.tokenManager || createCookieTokenManager();
  const onAuthError =
    options?.onAuthError ||
    (() => {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    });

  // State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshSubscribers = useMemo<((token: string) => void)[]>(() => [], []);

  // API Instance creation
  const apiInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      timeout,
      headers: { "Content-Type": "application/json" },
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        const token = tokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [baseURL, timeout, tokenManager]);

  // Handle refresh token
  const refreshToken = useCallback(async (): Promise<string> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${baseURL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      const { access_token, refresh_token } = response.data;
      if (access_token && refresh_token) {
        tokenManager.setTokens(response.data);
        return access_token;
      }

      throw new Error("Failed to refresh token");
    } catch (error) {
      throw error;
    }
  }, [baseURL, tokenManager]);

  // Handle token refresh callbacks
  const onRefreshSuccess = useCallback(
    (token: string): void => {
      refreshSubscribers.forEach((callback) => callback(token));
      refreshSubscribers.length = 0;
    },
    [refreshSubscribers]
  );

  const onRefreshFailure = useCallback((): void => {
    refreshSubscribers.forEach((callback) => callback(""));
    refreshSubscribers.length = 0;
    tokenManager.clearTokens();
    onAuthError();
  }, [refreshSubscribers, tokenManager, onAuthError]);

  // Response interceptor
  useEffect(() => {
    const responseInterceptor = apiInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data && 
            ('code' in response.data) && 
            ('message' in response.data) && 
            ('data' in response.data)) {
          return response;
        }
        
        const formattedResponse = { ...response };
        formattedResponse.data = {
          code: response.status,
          message: response.statusText || 'Success',
          data: response.data,
          meta: {}
        };
        return formattedResponse;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 errors for token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // If already refreshing, queue this request
            try {
              const token = await new Promise<string>((resolve) => {
                refreshSubscribers.push(resolve);
              });

              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiInstance(originalRequest);
              }
              return Promise.reject(error);
            } catch (err) {
              return Promise.reject(err);
            }
          }

          // Mark this request as retried
          originalRequest._retry = true;
          setIsRefreshing(true);

          try {
            const newToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            onRefreshSuccess(newToken);
            setIsRefreshing(false);
            // Thông báo token đã được refresh
            options?.onTokenRefreshed?.();
            return apiInstance(originalRequest);
          } catch (refreshError) {
            setIsRefreshing(false);
            onRefreshFailure();
            return Promise.reject(refreshError);
          }
        }

        // Format the error response
        const errorResponse: ApiResponse = {
          code: error.response?.status || 500,
          message: error.message || 'Network error',
          data: null,
          errors: (error.response?.data as any)?.errors || error.message,
          meta: (error.response?.data as any)?.meta || {}
        };

        return Promise.reject(errorResponse);
      }
    );

    // Cleanup function to remove interceptor when component unmounts
    return () => {
      apiInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [
    apiInstance,
    isRefreshing,
    refreshToken,
    onRefreshSuccess,
    onRefreshFailure,
    refreshSubscribers,
  ]);

  // Helper method to handle responses
  const handleResponse = useCallback(<T>(response: AxiosResponse): ApiResponse<T> => {
    // Nếu response.data đã có cấu trúc như mong muốn thì trả về trực tiếp
    if (response.data && 
        ('code' in response.data) && 
        ('message' in response.data) && 
        ('data' in response.data)) {
      return response.data as ApiResponse<T>;
    }

    // Nếu không, định dạng lại theo cấu trúc mong muốn
    return {
      code: response.status,
      message: response.statusText || 'Success',
      data: response.data,
      meta: {}
    };
  }, []);

  // HTTP Methods - sử dụng hàm factory để tạo các phương thức
  const get = useCallback(
    <T = any>(
      endpoint: string,
      params?: Record<string, any>,
      config?: AxiosRequestConfig
    ) =>
      createHttpMethod<T>(
        apiInstance,
        API_PREFIX,
        handleResponse,
        "get"
      )(endpoint, params, config),
    [apiInstance, API_PREFIX, handleResponse]
  );

  const post = useCallback(
    <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
      createHttpMethod<T>(
        apiInstance,
        API_PREFIX,
        handleResponse,
        "post"
      )(endpoint, data, config),
    [apiInstance, API_PREFIX, handleResponse]
  );

  const put = useCallback(
    <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
      createHttpMethod<T>(
        apiInstance,
        API_PREFIX,
        handleResponse,
        "put"
      )(endpoint, data, config),
    [apiInstance, API_PREFIX, handleResponse]
  );

  const del = useCallback(
    <T = any>(endpoint: string, config?: AxiosRequestConfig) =>
      createHttpMethod<T>(
        apiInstance,
        API_PREFIX,
        handleResponse,
        "delete"
      )(endpoint, undefined, config),
    [apiInstance, API_PREFIX, handleResponse]
  );

  return {
    get,
    post,
    put,
    delete: del,
    isRefreshing,
    refreshToken,
    clearTokens: tokenManager.clearTokens,
  };
};
