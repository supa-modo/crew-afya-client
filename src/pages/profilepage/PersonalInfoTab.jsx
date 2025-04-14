import { useState } from "react";
import { FaSave } from "react-icons/fa";
import {
  PiMapPinAreaBold,
  PiMapPinAreaDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import { RiUserCommunityFill } from "react-icons/ri";
import {
  TbIdBadge,
  TbIdBadge2,
  TbMailFilled,
  TbPhone,
  TbUserEdit,
} from "react-icons/tb";

const PersonalInfoTab = ({
  formData,
  isEditing,
  setIsEditing,
  isSubmitting,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="bg-gradient-to-r from-primary-600/10 to-primary-600/5 dark:from-primary-900/20 dark:to-primary-900/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-semibold text-primary-800 dark:text-primary-500 flex items-center">
            <PiUserDuotone className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            <span>Personal Information</span>
          </h2>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 border flex items-center rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
              isEditing
                ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                : "bg-primary-100 dark:bg-primary-800/50 border-primary-200 dark:border-primary-700/20 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800/70"
            }`}
          >
            <TbUserEdit className="h-5 w-5 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6">
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* First row: Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                First Name
              </label>
              <div className="relative group">
                <PiUserDuotone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    isEditing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                      : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  } font-medium`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Last Name
              </label>
              <div className="relative group">
                <PiUserDuotone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    isEditing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                      : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  } font-medium`}
                />
              </div>
            </div>
          </div>

          {/* Second row: Other names */}
          <div>
            <label
              htmlFor="otherNames"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Other Names
            </label>
            <div className="relative group">
              <PiUserDuotone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
              <input
                type="text"
                id="otherNames"
                name="otherNames"
                value={formData.otherNames || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                  isEditing
                    ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                    : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                } font-medium`}
              />
            </div>
          </div>

          {/* Third row: Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative group">
                <TbMailFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    isEditing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                      : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  } font-medium`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative group">
                <TbPhone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    isEditing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                      : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  } font-medium`}
                />
              </div>
            </div>
          </div>

          {/* Fourth row: Gender and County */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Gender
              </label>
              <div className="relative group">
                <PiUserDuotone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  disabled={true}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200
                  border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed font-medium`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="county"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                County
              </label>
              <div className="relative group">
                <PiMapPinAreaBold className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type="text"
                  id="county"
                  name="county"
                  value={formData.county || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    isEditing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                      : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  } font-medium`}
                />
              </div>
            </div>
          </div>

          {/* Fifth row: Sacco and Route */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="sacco"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                SACCO
              </label>
              <div className="relative group">
                <RiUserCommunityFill className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type="text"
                  id="sacco"
                  name="sacco"
                  value={formData.sacco || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    isEditing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                      : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  } font-medium`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="route"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Route
              </label>
              <div className="relative group">
                <PiMapPinAreaBold className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
                <input
                  type="text"
                  id="route"
                  name="route"
                  value={formData.route || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                    isEditing
                      ? "border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                      : "border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                  } font-medium`}
                />
              </div>
            </div>
          </div>

          {/* Sixth row: Read-only fields - ID Number and Membership Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="idNumber"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                ID Number
              </label>
              <div className="relative group">
                <TbIdBadge2 className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber || ""}
                  disabled={true}
                  className="w-full text-sm sm:text-base pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg cursor-not-allowed font-medium"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                ID Number cannot be changed
              </p>
            </div>

            <div>
              <label
                htmlFor="membershipNumber"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Membership Number
              </label>
              <div className="relative group">
                <TbIdBadge className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="membershipNumber"
                  name="membershipNumber"
                  value={formData.membershipNumber || ""}
                  disabled={true}
                  className="w-full text-sm sm:text-base pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoTab;
