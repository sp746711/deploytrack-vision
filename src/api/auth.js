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

// Logout user (clear client-side data)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get currently logged-in user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

