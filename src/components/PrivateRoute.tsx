import { Navigate } from "react-router-dom";

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects unauthenticated users to /login
 */
interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // Check if user has a valid JWT token in localStorage
  const token = localStorage.getItem("token");

  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists, allow access to protected route
  return <>{children}</>;
};
