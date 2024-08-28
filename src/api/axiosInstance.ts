  import axios, { AxiosError, AxiosRequestConfig } from "axios";
  import { toast } from "react-toastify";
  import { store } from "../store";
  import Auth from "../class/Auth";

  export interface CustomError {
    message: string;
    name: string;
    status?: number;
    code?: string;
  }

  interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
  }

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const state = store.getState();
      const token = state.auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const csrfToken = document.cookie
        .split(";")
        .find((row) => row.trim().startsWith("csrfToken="))
        ?.split("=")[1];

      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;
      let errorMessage = "An error occurred. Please try again.";
      let customError: CustomError = {
        message: errorMessage,
        name: error.name,
        code: error.code,
      };

      if (error.response) {
        customError.status = error.response.status;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["X-Retry"] = "true";
          try {
            const refreshed = await Auth.refreshAndRetryRequest(originalRequest);
            if (refreshed) {
              return axiosInstance(originalRequest);
            }
          } catch (retryError: any) {
            errorMessage = "Session expired. Please log in again.";
            customError = {
              message: errorMessage,
              name: retryError.name,
              code: retryError.code,
              status: 401,
            };
          }
        } else {
          switch (error.response.status) {
            case 401:
              errorMessage = "Session expired. Please log in again.";
              customError.status = 401;
              break;
            case 403:
              errorMessage = "You are not allowed to view this.";
              customError.status = 403;
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              customError.status = 500;
              break;
            default:
              customError.status = error.response.status;
          }
        }

        if (error.response.status === 401 || originalRequest._retry) {
          toast.error(errorMessage);
          Auth.logout(errorMessage);
        }

        return Promise.reject(customError);
      } else {
        errorMessage = "Network error. Please check your connection.";
        toast.error(errorMessage);
        customError.message = errorMessage;
        customError.status = 500;
        return Promise.reject(customError);
      }
    }
  );

  export default axiosInstance;
