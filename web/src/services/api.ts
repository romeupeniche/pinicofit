import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const hadAuthContext = Boolean(
      error.config?.headers?.Authorization || useAuthStore.getState().token,
    );

    if (
      error.response?.status === 401 &&
      hadAuthContext &&
      !requestUrl.includes("/auth/signin")
    ) {
      useAuthStore.getState().logout();

      if (!window.location.pathname.includes("/sign-in")) {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  },
);
