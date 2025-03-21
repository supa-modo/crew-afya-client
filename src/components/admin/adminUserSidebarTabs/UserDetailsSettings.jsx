import React, { useState } from "react";
import {
  FiSave,
  FiLock,
  FiAlertTriangle,
  FiMail,
  FiBell,
  FiShield,
} from "react-icons/fi";
import { TbLockFilled } from "react-icons/tb";

const UserDetailsSettings = ({ user }) => {
  // Account settings states
  const [accountSettings, setAccountSettings] = useState({
    
    twoFactorAuth: user?.twoFactorAuth || false,
    emailNotifications: user?.emailNotifications || true,
    smsNotifications: user?.smsNotifications || true,
  });

  // Password states
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleAccountSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountSettings({
      ...accountSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });

    // Clear related errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwords.current) {
      errors.current = "Current password is required";
    }

    if (!passwords.new) {
      errors.new = "New password is required";
    } else if (passwords.new.length < 8) {
      errors.new = "Password must be at least 8 characters";
    }

    if (passwords.new !== passwords.confirm) {
      errors.confirm = "Passwords do not match";
    }

    return errors;
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess("");

    // Simulate API call
    setTimeout(() => {
      console.log("Updated settings:", accountSettings);
      setIsSubmitting(false);
      setSuccess("Account settings updated successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const errors = validatePasswordForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    // Simulate API call
    setTimeout(() => {
      console.log("Password changed");
      setIsSubmitting(false);
      setSuccess("Password changed successfully");

      // Reset form
      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 border shadow overflow-hidden rounded-xl">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 text-amber-800 font-semibold dark:text-white">
              Account Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Manage your account preferences
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 shadow-md px-4 py-5 sm:py-6 flex flex-col sm:flex-row gap-4">
        <div className="sm:w-[55%] border-r pr-3 border-gray-200 dark:border-gray-700">
        <div className="px-2 pb-3">
          <h3 className="text-lg leading-6 font-semibold text-gray-600 dark:text-amber-800 flex items-center">
            <TbLockFilled className="mr-2 h-5 w-5 text-gray-400 dark:text-amber-800" />
            Change Password
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Update your password regularly to keep your account secure
          </p>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className=" px-2 py-3">
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
              {/* Current Password */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="current"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="current"
                    id="current"
                    className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                      formErrors.current ? "border-red-300 dark:border-red-500" : ""
                    }`}
                    
                    value={passwords.current}
                    onChange={handlePasswordChange}
                  />
                  {formErrors.current && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.current}
                    </p>
                  )}
                </div>
              </div>

              {/* New Password */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="new"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <div className="mt-1">
                  
                  <input
                    type="password"
                    name="new"
                    id="new"
                    className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                      formErrors.new ? "border-red-300 dark:border-red-500" : ""
                    }`}
                    value={passwords.new}
                    onChange={handlePasswordChange}
                  />
                  {formErrors.new && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.new}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirm"
                    id="confirm"
                    className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                      formErrors.confirm ? "border-red-300 dark:border-red-500" : ""
                    }`}
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                  />
                  {formErrors.confirm && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formErrors.confirm}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="sm:col-span-6">
                <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertTriangle
                        className="h-5 w-5 text-yellow-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Password Requirements
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>At least 8 characters long</li>
                          <li>Contains at least one uppercase letter</li>
                          <li>Contains at least one number</li>
                          <li>Contains at least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 text-right sm:px-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
        
        <div className="sm:w-[45%]">
        <h3 className="text-lg leading-6 font-semibold text-gray-600 dark:text-amber-800 mb-4">
            
            Account Preferences
          </h3>
          <form onSubmit={handleSaveSettings} >
          
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            

              {/* 2FA Toggle */}
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="twoFactorAuth"
                      name="twoFactorAuth"
                      type="checkbox"
                      className="focus:ring-admin-500 h-4 w-4 text-admin-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      checked={accountSettings.twoFactorAuth}
                      onChange={handleAccountSettingsChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="twoFactorAuth"
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      Enable Two-Factor Authentication
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account by
                      requiring a verification code
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="sm:col-span-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <FiBell className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  Notification Preferences
                </h4>
                <div className="mt-2 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        className="focus:ring-admin-500 h-4 w-4 text-admin-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                        checked={accountSettings.emailNotifications}
                        onChange={handleAccountSettingsChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="emailNotifications"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive email notifications for important account
                        updates and activities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="smsNotifications"
                        name="smsNotifications"
                        type="checkbox"
                        className="focus:ring-admin-500 h-4 w-4 text-admin-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                        checked={accountSettings.smsNotifications}
                        onChange={handleAccountSettingsChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="smsNotifications"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        SMS Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive SMS notifications for critical alerts and
                        time-sensitive information
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-right sm:px-6">
            {success && (
              <div className="inline-flex items-center mr-4 text-sm text-green-600 dark:text-green-400">
                {success}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
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
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiSave className="mr-2 -ml-1 h-4 w-4" />
                  Save Settings
                </span>
              )}
            </button>
          </div>
        </form>
        </div>
        

        
        </div>
      </div>

      {/* Account Deactivation */}
      <div className="bg-white dark:bg-gray-800 border  shadow overflow-hidden rounded-xl">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-amber-800 dark:text-red-500">
            Danger Zone
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-700 dark:text-red-400">
              Deactivate Account
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Deactivating this account will temporarily suspend access to all
              services. The user can be reactivated later if needed.
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Deactivate this Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSettings;
