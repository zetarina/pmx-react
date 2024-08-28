import { store } from "../store";
import axiosInstance from "../api/axiosInstance";
import {
  setToken,
  setRefreshToken,
  logout as logoutAction,
  fetchCsrfToken,
  fetchCurrentUser,
  login,
} from "../store/slices/authSlice";
import { toast } from "react-toastify";
import socketService from "./socketService";
import { AxiosRequestConfig } from "axios";
import unauthenticatedAxiosInstance from "../api/unauthenticatedAxiosInstance";

class Auth {
  private refreshingToken = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  async generateUUID(): Promise<string> {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  async getDeviceId(): Promise<string> {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = await this.generateUUID();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  }

  async getBrowserName(): Promise<string> {
    const userAgent = navigator.userAgent;
    if (
      userAgent.includes("Chrome") &&
      !userAgent.includes("Edge") &&
      !userAgent.includes("OPR")
    ) {
      return "Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      return "Internet Explorer";
    } else if (userAgent.includes("Edge")) {
      return "Edge";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      return "Opera";
    }
    return "Unknown";
  }

  async getDeviceName(): Promise<string> {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      const match = userAgent.match(/Android\s+([\d.]+); ([^;]+)/);
      return match ? match[2] : "Android Device";
    } else if (
      /iPad|iPhone|iPod/.test(userAgent) &&
      !(window as any).MSStream
    ) {
      const match = userAgent.match(/(iPhone|iPad|iPod).*OS\s([\d_]+)/);
      return match ? match[1] : "iOS Device";
    } else if (/Windows NT|Mac OS|Linux/.test(userAgent)) {
      if (/Windows NT/.test(userAgent)) return "Windows PC";
      if (/Mac OS/.test(userAgent)) return "Mac PC";
      if (/Linux/.test(userAgent)) return "Linux PC";
    }
    return "Unknown Device";
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const deviceId = await this.getDeviceId();
      const browser = await this.getBrowserName();
      const deviceName = await this.getDeviceName();
      const loginResult = (await store.dispatch(
        login({ email, password, deviceId, browser, deviceName })
      )) as any;

      if (loginResult.meta.requestStatus !== "fulfilled") {
        const { status, data } = loginResult.payload;

        if (status === 401 || status === 403) {
          toast.error("Login failed. Please check your credentials.");
        } else if (status === 500 && data === "Network Error") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Login failed. Please try again later.");
        }
        return;
      }

      const csrfSuccess = await this.fetchCsrfToken();
      if (csrfSuccess) {
        const userSuccess = await this.fetchCurrentUser();
        if (userSuccess) {
          toast.success("Login successful!");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  }

  async fetchCsrfToken(): Promise<boolean> {
    try {
      const csrfResult = (await store.dispatch(fetchCsrfToken())) as any;
      if (csrfResult.meta.requestStatus !== "fulfilled") {
        const { status, data } = csrfResult.payload;

        if (status === 500 && data === "Network Error") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Failed to fetch CSRF token. Please try again later.");
        }
        return false;
      }

      const csrfToken = csrfResult.payload.data.csrfToken;
      document.cookie = `csrfToken=${csrfToken}; path=/;`;
      return true;
    } catch (error: any) {
      console.error("Failed to fetch CSRF token:", error);
      toast.error(error.message || "An unexpected error occurred.");
      return false;
    }
  }

  async fetchCurrentUser(): Promise<boolean> {
    try {
      const currentUserResult = (await store.dispatch(
        fetchCurrentUser()
      )) as any;
      console.log(currentUserResult);
      if (currentUserResult.meta.requestStatus !== "fulfilled") {
        const { status } = currentUserResult.payload;
        if (status === 401 || status === 403) {
          this.logout("Session expired. Please log in again.");
          return false;
        }
      }
      return true;
    } catch (error: any) {
      console.error("Failed to fetch current user:", error);
      toast.error(error.message || "An unexpected error occurred.");
      return false;
    }
  }

  async refreshAndRetryRequest(
    originalRequest: AxiosRequestConfig
  ): Promise<boolean> {
    if (this.refreshingToken) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(true);
        });
      });
    }

    this.refreshingToken = true;
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;
    const deviceId = await this.getDeviceId();

    if (!refreshToken) {
      console.log("No refresh token available");
      this.logout("No refresh token available");
      return false;
    }

    try {
      console.log("Attempting to refresh token");
      const response = await unauthenticatedAxiosInstance.post(
        "/auth/refreshToken",
        {
          refreshToken,
          deviceId,
        }
      );
      console.log("Token refreshed successfully", response.data);
      store.dispatch(setToken(response.data.accessToken));
      store.dispatch(setRefreshToken(response.data.refreshToken));
      if (!originalRequest.headers) {
        originalRequest.headers = {};
      }

      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
      this.onRefreshed(response.data.accessToken);
      return true;
    } catch (error: any) {
      console.error("Failed to refresh token:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.log("Session expired. Logging out.");
        this.logout("Session expired. Please log in again.");
      } else {
        console.error("Network error during token refresh:", error);
        toast.error("Network error. Please check your connection.");
      }
      return false;
    } finally {
      this.refreshingToken = false;
    }
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  logout(message?: string): void {
    store.dispatch(logoutAction());
    socketService.disconnect();
    toast.info(message || "Logged out successfully.");
  }

  isAuthenticated(): boolean {
    const state = store.getState();
    return !!state.auth.token;
  }
}

export default new Auth();
