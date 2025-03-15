import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { PiPasswordDuotone, PiSignInDuotone, PiUserGearDuotone } from "react-icons/pi";
import { TbMailFilled } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState(null);

  const {
    adminLogin,
    error: authError,
    clearError,
    isAuthenticated,
    isAdmin,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to admin dashboard
  const from = location.state?.from || "/admin/dashboard";

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  // Clear form error when component unmounts
  useEffect(() => {
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
      clearError();
    };
  }, [errorTimeout, clearError]);

  // Update form error when auth error changes
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      clearError();

      // Attempt to login as admin
      const userData = await adminLogin(email, password);

      // If we get here, login was successful
      console.log("Admin login successful:", userData);

      // Navigate to the redirect path or admin dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);

      // Set form error with more specific message
      setFormError(
        error.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden transition-all duration-300">
      <div className="flex items-center gap-2 justify-center mb-2">
        <PiUserGearDuotone className="h-8 w-8 text-zinc-500 " />
        <h3 className="text-lg sm:text-xl font-bold font-nunito text-zinc-400 ">
          Admin Login
        </h3>
      </div>

      {formError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-1 sm:mx-3 bg-red-500/10 dark:bg-red-700/20 border border-red-500/30 rounded-lg p-3 mb-6 flex items-center gap-3"
        >
          <TbAlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-500 text-xs sm:text-sm">{formError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="px-1 sm:px-3">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[0.83rem] ml-1 sm:text-sm font-medium font-geist text-gray-500 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <TbMailFilled className="h-6 w-6 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm text-gray-600/90 sm:text-base font-geist block w-full pl-14 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 dark:focus:ring-secondary-500 dark:focus:border-secondary-500 transition-colors duration-200"
                placeholder="admin@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mb-1">
            <label
              htmlFor="password"
              className="block text-[0.83rem] ml-1 sm:text-sm font-medium font-geist text-gray-500 dark:text-gray-300"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PiPasswordDuotone className="h-6 w-6 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm text-gray-600/90 sm:text-base font-geist block w-full pl-14 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 dark:focus:ring-secondary-500 dark:focus:border-secondary-500 transition-colors duration-200"
              placeholder="••••••••••"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-6 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
              )}
            </button>
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-700 hover:to-secondary-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign in as Admin"
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
          >
            Back to User Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginForm;
