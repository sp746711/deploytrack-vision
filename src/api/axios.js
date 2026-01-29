import axios from "axios";

const API_BASE = "http://localhost:5000/api";

/**
 * Axios instance for DeployTrack API.
 * - Base URL: http://localhost:5000/api
 * - Request: always attach JWT from localStorage as Authorization: Bearer <token>
 * - Response: unwrap { success, data } so callers use response.data as payload
 * - 401: clear token/user, redirect to /login (never redirect if already on /login)
 * - Errors: reject with normalized error; never throw unhandled
 */
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ---------- REQUEST INTERCEPTOR ----------
// Attach JWT to every request when token exists. Skip only for auth routes (no token yet).
api.interceptors.request.use(
  (config) => {
    try {
      const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
      if (token && typeof token === "string" && token.trim()) {
        config.headers.Authorization = `Bearer ${token.trim()}`;
      }
    } catch (_) {}
    return config;
  },
  (err) => Promise.reject(err)
);

// ---------- RESPONSE INTERCEPTOR ----------
// Unwrap { success, data } on success; normalize errors; 401 → clear auth & redirect.
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && body.success === true && "data" in body) {
      response.data = body.data;
    }
    return response;
  },
  (err) => {
    const res = err.response;
    const status = res?.status;
    const path = typeof window !== "undefined" ? window.location?.pathname : "";

    if (status === 401 && path !== "/login" && path !== "/signup") {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (_) {}
      if (typeof window !== "undefined") {
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired"));
      }
    }

    const message = res?.data?.message ?? err.message ?? "Request failed";
    const normalized = new Error(message);
    normalized.response = res;
    normalized.status = status;
    return Promise.reject(normalized);
  }
);

export default api;
