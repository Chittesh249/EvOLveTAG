/**
 * Axios instance with auth interceptor. Use for all API calls.
 */
import axios from "axios";
import { API_BASE_URL } from "../config";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-logout"));
    }
    return Promise.reject(err);
  }
);

export default client;
