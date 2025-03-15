import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { TbAlertTriangle } from "react-icons/tb";
import { motion } from "framer-motion";
import { resetPassword } from "../../services/authService";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Extract token from URL (either from query parameters or route parameters)
  const queryParams = new URLSearchParams(location.search);
  const queryToken = queryParams.get("token");
  const routeToken = params.token;
  const token = queryToken || routeToken;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError(
        "Invalid or expired reset token. Please request a new password reset."
      );
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, formData.password);
      navigate("/login", {
        state: {
          message:
            "Password has been reset successfully! You can now log in with your new password.",
          type: "success",
        },
      });
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        error.message || "Failed to reset password. The link may have expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50/50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
        >
          <TbAlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
        >
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 text-sm rounded-lg border ${
              error && !formData.password
                ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 transition-colors pr-10`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Password must be at least 8 characters
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium  text-gray-500 dark:text-gray-300 mb-1"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 text-sm rounded-lg border ${
              error && formData.password && !formData.confirmPassword
                ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 transition-colors pr-10`}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm  text-white bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Resetting Password...
          </div>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
