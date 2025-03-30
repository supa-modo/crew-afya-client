import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * AuthRedirect component
 * Redirects authenticated users away from auth pages (login, register, etc.)
 * to the dashboard, but allows viewing the homepage
 */
const AuthRedirect = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // List of auth-related paths that should redirect to dashboard if user is logged in
  // Note: Homepage ('/') is intentionally excluded to allow viewing it while logged in
  const authPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  // Admin-specific paths
  const adminPaths = ["/admin-login"];

  useEffect(() => {
    // Only redirect after auth state is loaded fully and if user is authenticated
    if (!loading && isAuthenticated) {
      // Determine which dashboard to redirect to based on user role
      const dashboardPath = isAdmin ? "/admin/dashboard" : "/dashboard";

      // Check if current path is in the list of auth paths
      const isAuthPath = authPaths.some((path) => {
        // Handle exact matches and paths with parameters
        return location.pathname.startsWith(path);
      });

      // Check if current path is in the list of admin paths
      const isAdminPath = adminPaths.some((path) => {
        return location.pathname.startsWith(path);
      });

      // If user is on an auth path, redirect to appropriate dashboard
      if (isAuthPath || isAdminPath) {
        navigate(dashboardPath, { replace: true });
      }

      // If user is on the regular dashboard but should be on admin dashboard
      if (isAdmin && location.pathname === "/dashboard") {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate, location.pathname]);

  // Return children while the check is happening or if no redirect is needed
  return children;
};

export default AuthRedirect;
