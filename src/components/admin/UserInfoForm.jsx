import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiShield } from "react-icons/fi";
import { TbCreditCard, TbLockFilled } from "react-icons/tb";
import { PiUserDuotone } from "react-icons/pi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserInfoForm = ({ formData, handleChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Helper to check if an input has a server error
  const hasServerError = (fieldName) => {
    if (errors.form) {
      const lowerCaseError = errors.form.toLowerCase();
      const lowerCaseField = fieldName.toLowerCase();
      return lowerCaseError.includes(lowerCaseField);
    }
    return false;
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
        <PiUserDuotone className="mr-2 h-5 w-5 text-admin-500" />
        User Information
      </h2>

      <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            htmlFor="firstName"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PiUserDuotone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName || ""}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.firstName ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="John"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PiUserDuotone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName || ""}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.lastName ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="Doe"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="otherNames"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Other Names
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PiUserDuotone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="otherNames"
              name="otherNames"
              type="text"
              value={formData.otherNames || ""}
              onChange={handleChange}
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.otherNames ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="Middle name"
            />
          </div>
          {errors.otherNames && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.otherNames}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border ${
                errors.email || hasServerError("email")
                  ? "border-red-300 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200`}
              placeholder="example@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
          {hasServerError("email") && !errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              This email is already in use
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border ${
                errors.phoneNumber || hasServerError("phone")
                  ? "border-red-300 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200`}
              placeholder="+254700000000"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.phoneNumber}
            </p>
          )}
          {hasServerError("phone") && !errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              This phone number is already in use
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="idNumber"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            National ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <TbCreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="idNumber"
              name="idNumber"
              type="text"
              value={formData.idNumber || ""}
              onChange={handleChange}
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.idNumber ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="Enter ID number"
            />
          </div>
          {errors.idNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.idNumber}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Gender
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.gender ? "border-red-300 dark:border-red-500" : ""
              }`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.gender}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="county"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            County
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="county"
              name="county"
              type="text"
              value={formData.county || ""}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.county ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="Enter county"
            />
          </div>
          {errors.county && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.county}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="sacco"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Sacco
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="sacco"
              name="sacco"
              type="text"
              value={formData.sacco || ""}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.sacco ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="Enter sacco"
            />
          </div>
          {errors.sacco && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.sacco}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="route"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Route
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="route"
              name="route"
              type="text"
              value={formData.route || ""}
              onChange={handleChange}
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.route ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="Enter route"
            />
          </div>
          {errors.route && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.route}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiShield className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="role"
              name="role"
              value={formData.role || "user"}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.role ? "border-red-300 dark:border-red-500" : ""
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.role}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <TbLockFilled className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.password ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Password must be at least 8 characters long
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
