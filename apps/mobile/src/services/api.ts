import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@cypilot/shared';
import * as SecureStore from 'expo-secure-store';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const tokens = await SecureStore.getItemAsync('tokens');
          if (tokens) {
            const parsedTokens = JSON.parse(tokens);
            config.headers.Authorization = `Bearer ${parsedTokens.accessToken}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = await SecureStore.getItemAsync('tokens');
            if (tokens) {
              const parsedTokens = JSON.parse(tokens);
              // Try to refresh tokens
              const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken: parsedTokens.refreshToken
              });

              if (refreshResponse.data.success) {
                const newTokens = refreshResponse.data.data.tokens;
                await SecureStore.setItemAsync('tokens', JSON.stringify(newTokens));
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                return this.client(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Redirect to login or handle auth failure
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
