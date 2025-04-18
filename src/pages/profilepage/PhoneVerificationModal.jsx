import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiSend, FiPhone, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbDeviceMobile,
  TbShieldLock,
  TbMessage2Code,
  TbAlertCircle,
  TbCheck,
} from "react-icons/tb";

const PhoneVerificationModal = ({
  show,
  handleClose,
  phone,
  onVerificationComplete,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const { token } = useAuth();

  const handleSendCode = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/send-verification-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setCodeSent(true);
      setSuccess("Verification code sent to your phone");
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/verify-phone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phone, verificationCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

      setSuccess("Phone number verified successfully");
      setTimeout(() => {
        handleClose();
        if (onVerificationComplete) onVerificationComplete();
      }, 1500);
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto backdrop-blur-[1px]">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"
          aria-hidden="true"
          onClick={handleClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3 }}
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700 relative z-[10000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 mb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-primary-800 dark:text-primary-500 ">
                <span>Verify Your Phone Number</span>
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <TbAlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <TbCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {success}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center mb-5 text-gray-600 dark:text-gray-300">
              <TbShieldLock className="h-5 w-5 mr-2 text-gray-500" />
              <p className="text-sm">
                We need to verify your phone number:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {phone}
                </span>
              </p>
            </div>

            {!codeSent ? (
              <button
                onClick={handleSendCode}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
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
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2 -ml-1 h-5 w-5" />
                    Send Verification Code
                  </>
                )}
              </button>
            ) : (
              <form onSubmit={handleVerifyCode}>
                <div className="mb-4">
                  <label
                    htmlFor="verificationCode"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center"
                  >
                    <TbMessage2Code className="h-5 w-5 mr-2 text-gray-500" />
                    Enter verification code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" />
                    Resend Code
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !verificationCode}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
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
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck className="mr-2 -ml-1 h-5 w-5" />
                        Verify
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;
