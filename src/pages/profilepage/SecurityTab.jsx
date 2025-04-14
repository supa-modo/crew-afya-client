import { useState } from "react";
import { FiLock, FiPhone } from "react-icons/fi";
import PhoneVerificationModal from "./PhoneVerificationModal";
import { TbLockFilled, TbShieldCheck, TbShieldLock } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  PiPasswordDuotone,
  PiPhoneDuotone,
  PiShieldCheckDuotone,
} from "react-icons/pi";

const SecurityTab = ({
  formData,
  isSubmitting,
  handleChange,
  handlePasswordSubmit,
  userData,
  refreshUserData,
}) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerificationComplete = () => {
    refreshUserData();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="bg-gradient-to-r from-primary-600/10 to-primary-600/5 dark:from-primary-900/20 dark:to-primary-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-semibold text-primary-800 dark:text-primary-500 flex items-center">
            <TbShieldLock className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            <span>Security Settings</span>
          </h2>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-4">
            <TbLockFilled className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
            <span>Change Your Account Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Current Password
              </label>
              <div className="relative group">
                <TbLockFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                New Password
              </label>
              <div className="relative group">
                <TbLockFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative group">
                <TbLockFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-200"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <PiPasswordDuotone className="mr-2 -ml-1 h-5 w-5" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Phone Verification Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <PiPhoneDuotone className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              <span>Phone Verification</span>
            </h3>
          </div>

          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center">
                  {userData?.phoneVerified ? (
                    <TbShieldCheck className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <TbShieldLock className="h-5 w-5 mr-2 text-yellow-500" />
                  )}
                  <p className="text-sm font-medium">
                    {userData?.phoneVerified ? (
                      <span className="text-green-600 dark:text-green-500">
                        Your phone number is verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-500">
                        Your phone number is not verified!
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 ml-7">
                  {`Registered Phone: ${
                    userData?.phoneNumber || "No phone number added"
                  }`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVerificationModal(true)}
                disabled={!userData?.phoneNumber || userData?.phoneVerified}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <PiPhoneDuotone className="mr-2 -ml-1 h-5 w-5" />
                <span>
                  {userData?.phoneVerified ? "Verified" : "Verify Phone"}
                </span>
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
    </div>
  );
};

export default SecurityTab;
