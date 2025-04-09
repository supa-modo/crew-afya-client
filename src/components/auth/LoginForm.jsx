import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { TbAlertTriangle, TbLockFilled } from "react-icons/tb";
import { PiUserDuotone, PiSignInDuotone } from "react-icons/pi";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, error: authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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

  // Function to format phone number to international format
  const formatPhoneNumber = (phone) => {
    if (!phone) return phone;
    
    // If it's likely an ID number (not a phone), return as is
    if (phone.length > 10 || phone.length < 10 || isNaN(phone.replace(/\D/g, ''))) {
      return phone;
    }
    
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle Kenyan numbers
    if (cleaned.startsWith('0')) {
      // Convert 07xx or 01xx format to +254xxx
      return `+254${cleaned.substring(1)}`;
    } else if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
      // Handle numbers without country code or leading zero (7xx or 1xx)
      return `+254${cleaned}`;
    } else if (cleaned.startsWith('254')) {
      // Already in international format, add + prefix
      return `+${cleaned}`;
    } else if (!cleaned.startsWith('254')) {
      // Any other format, add 254 prefix
      return `+254${cleaned}`;
    }
    
    return phone; // Return original if none of the conditions match
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!identifier || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      clearError();

      // Format phone number if it appears to be a phone number
      const formattedIdentifier = formatPhoneNumber(identifier);
      
      // Attempt to login
      const userData = await login(formattedIdentifier, password, rememberMe);

      // If we get here, login was successful
      console.log("Login successful:", userData);

      // Navigate to the redirect path or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error in form:", error);

      // Display the specific error message from the server
      // Make sure we're getting the most specific error message possible
      setFormError(error.message || "Invalid credentials. Please try again.");

      // Set a timeout to clear the error after 8 seconds
      const timeout = setTimeout(() => {
        setFormError("");
      }, 8000);

      setErrorTimeout(timeout);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-4 overflow-hidden transition-all duration-300">
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
              htmlFor="identifier"
              className="block text-[0.83rem] ml-1 sm:text-sm font-medium  text-gray-500 dark:text-gray-300 mb-1"
            >
              Phone Number or ID Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <PiUserDuotone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-secondary-600 focus:ring-secondary-600 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 dark:focus:ring-secondary-600 dark:focus:border-secondary-600 transition-colors duration-200"
                placeholder="Enter your phone or ID number"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <div className="mb-1">
              <label
                htmlFor="password"
                className="block text-[0.83rem] ml-1 sm:text-sm font-medium  text-gray-500 dark:text-gray-300"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <TbLockFilled className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm text-gray-600/90 sm:text-base  block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-secondary-600 focus:ring-secondary-600 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 dark:focus:ring-secondary-600 dark:focus:border-secondary-600 transition-colors duration-200"
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
          </div>

          <div className="flex justify-between items-center mx-1 font-open">
            <div className="flex items-center ">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3 w-3 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-[0.8rem] sm:text-sm font-bold text-secondary-700 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-600 dark:to-secondary-700 hover:from-secondary-600 hover:to-secondary-700 dark:hover:from-secondary-500 dark:hover:to-secondary-600  focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-600 dark:focus:ring-offset-gray-800 transition-all duration-200 ${
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
                <div className="flex items-center space-x-1">
                  <PiSignInDuotone size={18} />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[0.83rem] sm:text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-secondary-700 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
