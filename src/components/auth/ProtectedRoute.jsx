import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute component
 * Ensures that only authenticated users can access certain routes
 * Redirects unauthenticated users to the login page
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Store the current location to redirect after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not an admin but trying to access admin routes
  if (adminOnly && user?.role !== "admin" && user?.role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
