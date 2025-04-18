import { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiSave,
  FiPhone,
  FiShield,
  FiLock,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  TbLock,
  TbShieldLock,
  TbDeviceMobile,
  TbAlertCircle,
  TbPhone,
  TbPhoneCall,
} from "react-icons/tb";
import PhoneVerificationModal from "./PhoneVerificationModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaSave } from "react-icons/fa";
import { PiPasswordDuotone } from "react-icons/pi";

const SecurityTab = ({
  formData,
  isSubmitting,
  handleChange,
  handlePasswordSubmit,
  userData,
  refreshUserData,
  errorMessage,
}) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleVerificationComplete = () => {
    refreshUserData();
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    // Basic validation
    if (!formData.currentPassword) {
      setLocalError("Current password is required");
      return;
    }

    if (!formData.newPassword) {
      setLocalError("New password is required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }

    // Password strength validation
    if (formData.newPassword.length < 8) {
      setLocalError("Password must be at least 8 characters long");
      return;
    }

    // If validation passes, proceed with the actual submission
    handlePasswordSubmit(e);
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl font-semibold text-secondary-700 dark:text-secondary-500 flex items-center">
          <PiPasswordDuotone className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3 text-secondary-700 dark:text-secondary-500" />
          Change Account Password
        </h2>
      </div>

      <AnimatePresence>
        {(localError || errorMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <TbAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Password update failed
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{localError || errorMessage}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={validateAndSubmit} className="space-y-6 max-w-lg">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-[0.8rem] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TbLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-secondary-600 focus:border-secondary-600 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-[0.8rem] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TbLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-secondary-600 focus:border-secondary-600 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Password must be at least 6 characters long
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-[0.8rem] sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TbLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-secondary-600 focus:border-secondary-600 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-[0.83rem] sm:text-sm font-medium dark:font-normal text-white bg-secondary-700 dark:bg-secondary-700/80 hover:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                Updating...
              </>
            ) : (
              <>
                <FaSave className="mr-2 -ml-1 h-4 w-4" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Phone Verification Section */}
      <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-5">
          <h2 className="text-base sm:text-lg font-semibold text-secondary-700 dark:text-secondary-500 flex items-center">
            <TbDeviceMobile className="h-5 w-5 mr-2 text-secondary-600" />
            Phone Verification
          </h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 max-w-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="">
                <p className="text-[0.83rem] sm:text-sm font-medium">
                  {userData?.phoneVerified ? (
                    <span className="text-green-600 dark:text-green-400">
                      Your phone number is verified
                    </span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      Your phone number is not verified
                    </span>
                  )}
                </p>
              </div>
              <p className="text-[0.83rem] sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                {`Registered Phone: ${
                  userData?.phoneNumber || "No phone number added"
                }`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVerificationModal(true)}
              disabled={!userData?.phoneNumber || userData?.phoneVerified}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-[0.83rem] sm:text-sm font-medium text-white bg-secondary-700 dark:bg-secondary-700/80 hover:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <div className="flex items-center justify-center">
                <TbPhoneCall className="mr-2 -ml-1 h-5 w-5" />
                <span>
                  {userData?.phoneVerified ? "Phone Verified" : "Verify Phone Number"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        show={showVerificationModal}
        handleClose={() => setShowVerificationModal(false)}
        phone={userData?.phoneNumber}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};

export default SecurityTab;
