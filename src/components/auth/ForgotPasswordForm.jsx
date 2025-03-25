import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiAlertCircle, FiCheckCircle, FiPhone } from "react-icons/fi";
import { forgotPassword } from "../../services/authService";
import { TbAlertTriangle, TbMailFilled, TbPhone } from "react-icons/tb";

const ForgotPasswordForm = ({ onSubmitSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState("email"); // "phone" or "email"
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState(null);

  // Clear error timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [errorTimeout]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!identifier) {
      setFormError(
        `Please enter your ${
          identifierType === "email" ? "email address" : "phone number"
        }`
      );
      return;
    }

    // Validation based on identifier type
    if (identifierType === "email") {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setFormError("Please enter a valid email address");
        return;
      }
    } else {
      // Phone validation (simple check for now)
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(identifier)) {
        setFormError("Please enter a valid phone number");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      await forgotPassword(identifier);
      setIsSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(identifier);
      }
    } catch (error) {
      setFormError(
        error.message || "Failed to send reset link. Please try again."
      );

      // Keep the error visible for at least 5 seconds
      const timeout = setTimeout(() => {
        setFormError("");
      }, 5000);

      setErrorTimeout(timeout);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleIdentifierType = () => {
    setIdentifierType(identifierType === "email" ? "phone" : "email");
    setIdentifier("");
    setFormError("");
  };

  if (isSuccess && !onSubmitSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 dark:bg-secondary-900/20 mb-4">
          <FiCheckCircle className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
        </div>
        <h3 className="text-lg font-medium text-secondary-700 dark:text-white">
          {identifierType === "email" ? "Check your email" : "Check your phone"}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a password reset{" "}
          {identifierType === "email" ? "link to " : "code to "}
          {identifier}
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-secondary-600 transition-all duration-300"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {formError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className=" bg-red-500/10 dark:bg-red-700/20 border border-red-500/30 rounded-lg p-3 mb-6 flex items-center gap-3"
        >
          <TbAlertTriangle className="text-red-500 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-500 text-xs sm:text-sm">{formError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 ">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="identifier"
              className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300"
            >
              {identifierType === "email" ? "Email Address" : "Phone Number"}
            </label>
            <button
              type="button"
              onClick={toggleIdentifierType}
              className="text-[0.82rem] text-secondary-700 hover:text-secondary-600 dark:text-secondary-600 dark:hover:text-secondary-500"
            >
              Use {identifierType === "email" ? "phone number" : "email"}{" "}
              instead
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {identifierType === "email" ? (
                <TbMailFilled className="h-6 w-6 text-gray-400" />
              ) : (
                <TbPhone className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <input
              id="identifier"
              type={identifierType === "email" ? "email" : "tel"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="text-sm text-gray-600/90 sm:text-base  block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-secondary-600 focus:ring-secondary-600 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 dark:focus:ring-secondary-600 dark:focus:border-secondary-600 transition-colors duration-200"
              placeholder={
                identifierType === "email" ? "you@example.com" : "+254700000000"
              }
              required
              disabled={isSubmitting}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            We'll send a {identifierType === "email" ? "link" : "code"} to reset
            your password to this{" "}
            {identifierType === "email" ? "email address" : "phone number"}.
          </p>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-700 dark:to-secondary-800 hover:from-secondary-700 hover:to-secondary-800 dark:hover:from-secondary-600 dark:hover:to-secondary-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-secondary-600 dark:focus:ring-offset-gray-800 transition-all duration-200"
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
              Sending...
            </div>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
