import React, { useState } from "react";
import {
  FiSave,
  FiLock,
  FiAlertTriangle,
  FiMail,
  FiBell,
  FiShield,
} from "react-icons/fi";

const UserDetailsSettings = ({ user }) => {
  // Account settings states
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || "user@example.com",
    phone: user?.phone || "+2547XXXXXXXX",
    language: user?.language || "english",
    timeZone: user?.timeZone || "East Africa Time (UTC+03:00)",
    twoFactorAuth: user?.twoFactorAuth || false,
    emailNotifications: user?.emailNotifications || true,
    smsNotifications: user?.smsNotifications || true,
    dataPrivacy: user?.dataPrivacy || "standard",
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
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Account Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Manage your account preferences
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Email */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail
                      className="h-5 w-5 text-gray-400 dark:text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="focus:ring-admin-500 focus:border-admin-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={accountSettings.email}
                    onChange={handleAccountSettingsChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={accountSettings.phone}
                    onChange={handleAccountSettingsChange}
                  />
                </div>
              </div>

              {/* Language */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Language
                </label>
                <div className="mt-1">
                  <select
                    id="language"
                    name="language"
                    className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={accountSettings.language}
                    onChange={handleAccountSettingsChange}
                  >
                    <option value="english">English</option>
                    <option value="swahili">Swahili</option>
                    <option value="french">French</option>
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="timeZone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Time Zone
                </label>
                <div className="mt-1">
                  <select
                    id="timeZone"
                    name="timeZone"
                    className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={accountSettings.timeZone}
                    onChange={handleAccountSettingsChange}
                  >
                    <option value="East Africa Time (UTC+03:00)">
                      East Africa Time (UTC+03:00)
                    </option>
                    <option value="Central Africa Time (UTC+02:00)">
                      Central Africa Time (UTC+02:00)
                    </option>
                    <option value="West Africa Time (UTC+01:00)">
                      West Africa Time (UTC+01:00)
                    </option>
                    <option value="Greenwich Mean Time (UTC+00:00)">
                      Greenwich Mean Time (UTC+00:00)
                    </option>
                  </select>
                </div>
              </div>

              {/* Data Privacy */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="dataPrivacy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Data Privacy Level
                </label>
                <div className="mt-1 flex items-center">
                  <FiShield className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <select
                    id="dataPrivacy"
                    name="dataPrivacy"
                    className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={accountSettings.dataPrivacy}
                    onChange={handleAccountSettingsChange}
                  >
                    <option value="standard">Standard</option>
                    <option value="enhanced">Enhanced</option>
                    <option value="maximum">Maximum</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Controls how your data is stored and shared with third parties
                </p>
              </div>

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
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
            {success && (
              <div className="inline-flex items-center mr-4 text-sm text-green-600 dark:text-green-400">
                {success}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <FiLock className="mr-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            Change Password
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Update your password regularly to keep your account secure
          </p>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
                    className={`shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm ${
                      formErrors.current ? "border-red-300" : "border-gray-300"
                    } rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
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
                    className={`shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm ${
                      formErrors.new ? "border-red-300" : "border-gray-300"
                    } rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
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
                    className={`shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm ${
                      formErrors.confirm ? "border-red-300" : "border-gray-300"
                    } rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
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
                <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-4">
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
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Account Deactivation */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
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
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSettings;
