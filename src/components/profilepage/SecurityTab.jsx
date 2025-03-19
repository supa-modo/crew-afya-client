import { useState } from "react";
import { FiLock, FiPhone } from "react-icons/fi";
import PhoneVerificationModal from "./PhoneVerificationModal";
import { TbLockFilled } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PiPasswordDuotone, PiPhoneDuotone } from "react-icons/pi";
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
    <div className="px-6 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <TbLockFilled className="h-5 w-5 mx-2 text-secondary-700" />
          <span className="text-secondary-800 pl-1 dark:text-secondary-600">
            Change Your Account Password
          </span>
        </h2>
      </div>

      <form onSubmit={handlePasswordSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Current Password
            </label>
            <div className="relative">
              <TbLockFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <TbLockFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <TbLockFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <PiPasswordDuotone className="mr-3 -ml-1 h-5 w-5" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>

      {/* Phone Verification Section */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-2 sm:mb-3">
          <h2 className="text-lg font-semibold   flex items-center">
            <FiPhone className="h-5 w-5 mr-3 text-secondary-700" />
            <span className="text-secondary-800 pl-1 dark:text-secondary-600">
              Phone Verification
            </span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {userData?.phoneVerified ? (
                <span className="text-green-600 font-medium">
                  Your phone number is verified
                </span>
              ) : (
                <span className="text-yellow-600 dark:text-yellow-700 font-medium">
                  Your phone number is not verified!
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {`Registered Phone:  ${
                userData?.phoneNumber || "No phone number added"
              }`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowVerificationModal(true)}
            disabled={!userData?.phoneNumber || userData?.phoneVerified}
            className=" px-3 sm:px-4 md:px-6 py-2 border border-transparent rounded-lg shadow-sm text-[0.8rem] sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center">
              <PiPhoneDuotone className="mr-1 sm:mr-2 -ml-1 h-5 w-5" />
              <span className="">
                {userData?.phoneVerified ? "Verified" : "Verify Phone"}
              </span>
            </div>
          </button>
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
