/**
 * Base API Client
 * Axios-like wrapper with interceptors, token management, and error handling
 */

import { API_CONFIG } from '../config/api-config';
import {
  parseApiError,
  logError,
  shouldRetry,
  calculateRetryDelay,
} from '../utils/api/error-handler';
import { networkStatusManager } from '../utils/api/network-status';
import { STORAGE_KEYS } from '../utils/auth';

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  skipAuth?: boolean;
  skipRetry?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = <T>(
  response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>;
type ErrorInterceptor = (error: unknown) => unknown;

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private refreshingToken: Promise<string | null> | null = null;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.setupDefaultInterceptors();
  }

  /**
   * Setup default interceptors
   */
  private setupDefaultInterceptors(): void {
    // Request interceptor: Add auth token
    this.addRequestInterceptor(async (config) => {
      if (!config.skipAuth) {
        const token = this.getAccessToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      }
      return config;
    });

    // Response interceptor: Handle token refresh
    this.addResponseInterceptor(async (response) => {
      return response;
    });

    // Error interceptor: Handle 401 and retry
    this.addErrorInterceptor(async (error) => {
      const apiError = parseApiError(error);

      // If token expired, try to refresh
      if (apiError.code === 'TOKEN_EXPIRED' || apiError.statusCode === 401) {
        const newToken = await this.handleTokenRefresh();
        if (newToken) {
          // Retry the original request with new token
          if (isErrorWithConfig(error) && error.config) {
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return this.request(error.config.url, error.config);
          }
        }
      }

      throw apiError;
    });
  }

  /**
   * Add request interceptor
   */
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  public addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Get access token from storage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    return (
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    );
  }

  /**
   * Handle token refresh
   */
  private async handleTokenRefresh(): Promise<string | null> {
    // If already refreshing, wait for that promise
    if (this.refreshingToken) {
      return this.refreshingToken;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    this.refreshingToken = (async () => {
      try {
        const response = await this.post<{ token: string; refreshToken: string }>(
          '/auth/refresh',
          {
            refreshToken,
          },
          { skipAuth: true, skipRetry: true }
        );

        // Store new tokens
        const storage = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)
          ? localStorage
          : sessionStorage;
        storage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        if (response.data.refreshToken) {
          storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        }

        return response.data.token;
      } catch {
        // Refresh failed, clear auth data
        this.clearAuthData();
        return null;
      } finally {
        this.refreshingToken = null;
      }
    })();

    return this.refreshingToken;
  }

  /**
   * Clear auth data from storage
   */
  private clearAuthData(): void {
    const keys = Object.values(STORAGE_KEYS);
    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Execute request interceptors
   */
  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let modifiedConfig = config;

    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Execute response interceptors
   */
  private async executeResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Execute error interceptors
   */
  private async executeErrorInterceptors(error: unknown): Promise<unknown> {
    let modifiedError = error;

    for (const interceptor of this.errorInterceptors) {
      try {
        modifiedError = await interceptor(modifiedError);
      } catch (e) {
        modifiedError = e;
      }
    }

    return modifiedError;
  }

  /**
   * Make HTTP request with retry logic
   */
  public async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = this.defaultTimeout,
      skipRetry = false,
    } = await this.executeRequestInterceptors(config);

    const url = this.buildUrl(endpoint, params);
    const maxRetries = skipRetry ? 0 : API_CONFIG.RETRY.MAX_RETRIES;
    let attemptCount = 0;

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            ...API_CONFIG.REQUEST.HEADERS,
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Parse response
        const contentType = response.headers.get('content-type');
        const data: unknown = contentType?.includes('application/json')
          ? await response.json()
          : await response.text();

        const apiResponse: ApiResponse<T> = {
          data: data as T,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        };

        // Handle error responses
        if (!response.ok) {
          const error = {
            response: {
              status: response.status,
              data: data as T,
            },
          };
          throw error;
        }

        return await this.executeResponseInterceptors(apiResponse);
      } catch (error) {
        clearTimeout(timeoutId);

        const processedError = await this.executeErrorInterceptors(error);
        const apiError = parseApiError(processedError);

        logError(apiError, `${method} ${endpoint}`);

        // Retry logic
        if (shouldRetry(apiError, attemptCount, maxRetries)) {
          attemptCount++;
          const delay = calculateRetryDelay(attemptCount, API_CONFIG.RETRY.RETRY_DELAY);

          // Retry request after delay
          await new Promise((resolve) => setTimeout(resolve, delay));
          return makeRequest();
        }

        throw apiError;
      }
    };

    // Check network status
    if (!networkStatusManager.getStatus()) {
      // Queue request for when network is available
      return networkStatusManager.queueRequest(() => makeRequest()) as Promise<ApiResponse<T>>;
    }

    return makeRequest();
  }

  /**
   * GET request
   */
  public get<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  public post<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  public put<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  public patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  public delete<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

/**
 * Type guard for error with config
 */
interface ErrorWithConfig {
  config?: {
    url: string;
    headers: Record<string, string>;
  };
}

function isErrorWithConfig(error: unknown): error is ErrorWithConfig {
  return typeof error === 'object' && error !== null && 'config' in error;
}

// Create singleton instance
export const apiClient = new ApiClient(String(API_CONFIG.BASE_URL), Number(API_CONFIG.TIMEOUT));

// Export for testing
export { ApiClient };
