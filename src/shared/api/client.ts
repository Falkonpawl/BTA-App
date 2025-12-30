import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const BASE_URL = "https://geoblinker.ru/taxi/c/Assist/api/v1";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token, convert data to URLSearchParams, and log curl
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem("auth_token");
        console.log(
          "🔑 Auth token from storage:",
          token ? `${token.substring(0, 20)}...` : "NOT FOUND"
        );

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Convert data to URLSearchParams for form-urlencoded format
        if (
          config.data &&
          !(config.data instanceof URLSearchParams) &&
          !(config.data instanceof FormData) &&
          ["POST", "PUT", "PATCH"].includes((config.method || "").toUpperCase())
        ) {
          const formData = new URLSearchParams();
          Object.entries(config.data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });
          config.data = formData;
        }

        // Generate curl command for debugging (AFTER adding auth header)
        this.logCurlCommand(config, token);

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => {
        console.log("📥 Response:", JSON.stringify(response.data, null, 2));
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          await AsyncStorage.removeItem("auth_token");
          // You can emit an event here to redirect to login
        }
        return Promise.reject(error);
      }
    );
  }

  private logCurlCommand(config: any, token: string | null) {
    const method = (config.method || "GET").toUpperCase();
    const url = `${config.baseURL || ""}${config.url || ""}`;
    const headers = config.headers || {};

    let curlCmd = `curl -X ${method} '${url}'`;

    // Add headers
    Object.keys(headers).forEach((key) => {
      if (headers[key]) {
        curlCmd += ` \\\n  -H '${key}: ${headers[key]}'`;
      }
    });

    // Add data for POST/PUT/PATCH
    if (config.data && ["POST", "PUT", "PATCH"].includes(method)) {
      if (typeof config.data === "string") {
        curlCmd += ` \\\n  -d '${config.data}'`;
      } else if (config.data instanceof URLSearchParams) {
        curlCmd += ` \\\n  -d '${config.data.toString()}'`;
      } else {
        curlCmd += ` \\\n  -d '${JSON.stringify(config.data)}'`;
      }
    }

    console.log("\n🔄 CURL Command:\n" + curlCmd + "\n");
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
