import api from "./axios";

/**
 * Auth API Functions
 * Handles user authentication with the backend
 */

// Sign up a new user
export const signup = (data) =>
  api.post("/auth/signup", data);

// Login an existing user
export const login = (data) =>
  api.post("/auth/login", data);

// Logout user (clear client-side data). Never throws.
export const logout = () => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch (_) {}
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = () => {
  try {
    const t = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    return !!(t && typeof t === "string" && t.trim());
  } catch {
    return false;
  }
};

// Get currently logged-in user from localStorage. Never throws on invalid JSON or missing localStorage.
export const getCurrentUser = () => {
  try {
    if (typeof localStorage === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const parsed = JSON.parse(userStr);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

