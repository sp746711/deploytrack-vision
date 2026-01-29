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
  let token: string | null = null;
  try {
    token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  } catch {
    token = null;
  }

  if (!token || (typeof token === "string" && !token.trim())) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
