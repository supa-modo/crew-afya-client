import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../common/PageLoader";

/**
 * AdminRoute component
 *
 * Ensures that only authenticated admin users can access admin routes
 * If authCheckComplete is false, shows a loading spinner
 * If user is not authenticated, redirects to admin login
 * If user is authenticated but not an admin, redirects to user dashboard
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, authCheckComplete } = useAuth();
  const location = useLocation();

  // If auth check is still in progress, show a loading spinner
  if (loading || !authCheckComplete) {
    return <PageLoader fullScreen />;
  }

  // If user is not authenticated, redirect to admin login
  if (!isAuthenticated) {
    // Store the current location to redirect after successful login
    return (
      <Navigate
        to="/admin-login"
        state={{ returnUrl: location.pathname }}
        replace
      />
    );
  }

  // If user is authenticated but not an admin, redirect to normal dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the admin content
  return children;
};

export default AdminRoute;
