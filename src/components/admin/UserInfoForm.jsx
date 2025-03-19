import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiShield } from "react-icons/fi";
import { TbCreditCard, TbLockFilled } from "react-icons/tb";
import { PiUserDuotone } from "react-icons/pi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserInfoForm = ({ formData, handleChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
        <PiUserDuotone className="mr-2 h-5 w-5 text-admin-500" />
        User Information
      </h2>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            htmlFor="fullName"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PiUserDuotone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.fullName ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="John Doe"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.fullName}
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
              value={formData.email}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.email ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="example@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
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
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.phoneNumber ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="+254700000000"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.phoneNumber}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="nationalId"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            National ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <TbCreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="nationalId"
              name="nationalId"
              type="text"
              value={formData.nationalId}
              onChange={handleChange}
              className={`text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-admin-500 dark:focus:border-admin-500 transition-colors duration-200 ${
                errors.nationalId ? "border-red-300 dark:border-red-500" : ""
              }`}
              placeholder="Enter ID number"
            />
          </div>
          {errors.nationalId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.nationalId}
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
              value={formData.role}
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
              value={formData.password}
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
