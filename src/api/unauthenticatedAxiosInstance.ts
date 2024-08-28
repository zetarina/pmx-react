import axios from "axios";
import { store } from "../store";

const unauthenticatedAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

unauthenticatedAxiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth.token;
    const refreshToken = state.auth.refreshToken;

    if (token && config.url?.includes("/auth/logout")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (refreshToken && config.url?.includes("/auth/logout")) {
      config.headers["X-Refresh-Token"] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default unauthenticatedAxiosInstance;
