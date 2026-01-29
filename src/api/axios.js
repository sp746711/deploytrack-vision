import axios from "axios";

/**
 * Axios instance with base URL for all API calls
 * Automatically attaches JWT token from localStorage
 * Handles 401 errors by redirecting to login
 */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ============ REQUEST INTERCEPTOR ============
// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Add Bearer token to Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============ RESPONSE INTERCEPTOR ============
// Handle 401 errors (unauthorized) globally
api.interceptors.response.use(
  (response) => response, // Success: return response as-is
  (error) => {
    // Handle 401 Unauthorized error
    if (error.response?.status === 401) {
      // Clear stored token and user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Return the error for handling in components
    return Promise.reject(error);
  }
);

export default api;

