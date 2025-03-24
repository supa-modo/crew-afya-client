import { useState } from "react";
import {
  PiMapPinAreaDuotone,
  PiUserCheckBold,
  PiUserDuotone,
} from "react-icons/pi";
import {
  TbEdit,
  TbIdBadge,
  TbIdBadge2,
  TbMail,
  TbPhone,
  TbRosetteDiscountCheck,
} from "react-icons/tb";
import { MdOutlineMore } from "react-icons/md";
import { RiUserCommunityFill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const PersonalInfoTab = ({
  formData,
  isEditing,
  setIsEditing,
  isSubmitting,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Header Section */}
      <div className=" px-8 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <PiUserDuotone className="h-5 w-5 mx-2 text-secondary-700" />
            <span className="text-secondary-800 pl-1 dark:text-secondary-600">
              Personal Information
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 flex items-center ${
              isEditing
                ? "bg-white text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-700"
            }`}
          >
            {isEditing ? (
              <>
                <IoClose className="h-4 w-4 mr-2 stroke-2" />
                Cancel
              </>
            ) : (
              <>
                <TbEdit className="h-4 w-4 mr-2 stroke-2" />
                Edit
              </>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-sm sm:text-lg md:text-xl font-bold text-secondary-600 flex items-center">
            <PiUserDuotone className="h-5 w-5 mr-3 stroke-2" />
            Personal Information
          </h2>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 flex items-center ${
              isEditing
                ? "bg-white text-gray-700 hover:bg-gray-50"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {isEditing ? (
              <>
                <IoClose className="h-4 w-4 mr-2 stroke-2" />
                Cancel
              </>
            ) : (
              <>
                <TbEdit className="h-4 w-4 mr-2 stroke-2" />
                Edit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="px-8 py-6">
        <div className="space-y-8">
          {/* Personal Details Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-5 flex items-center">
              <PiUserCheckBold className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  First Name
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiUserDuotone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Last Name
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiUserDuotone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>

              {/* Other Names */}
              <div className="space-y-2">
                <label
                  htmlFor="otherNames"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Other Names
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiUserDuotone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="otherNames"
                    name="otherNames"
                    value={formData.otherNames || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-5 flex items-center">
              <TbMail className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Address */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbMail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbPhone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-5 flex items-center">
              <MdOutlineMore className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Additional Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Gender
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiUserDuotone className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm appearance-none`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* County */}
              <div className="space-y-2">
                <label
                  htmlFor="county"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  County
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiMapPinAreaDuotone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="county"
                    name="county"
                    value={formData.county || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>

              {/* SACCO */}
              <div className="space-y-2">
                <label
                  htmlFor="sacco"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  SACCO
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiUserCommunityFill className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="sacco"
                    name="sacco"
                    value={formData.sacco || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>

              {/* Route */}
              <div className="space-y-2">
                <label
                  htmlFor="route"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Route
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PiMapPinAreaDuotone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="route"
                    name="route"
                    value={formData.route || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isEditing
                        ? "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    } rounded-lg shadow-sm text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Identification Section - Read Only */}
          <div className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-5 flex items-center">
              <TbIdBadge2 className="h-5 w-5 mr-2 text-indigo-500" />
              <span>Identification</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Number */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="idNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ID Number
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <TbRosetteDiscountCheck className="h-3 w-3 mr-1 text-gray-400" />
                    Verified
                  </span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbIdBadge2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber || ""}
                    disabled={true}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 rounded-lg shadow-sm text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID Number cannot be changed
                </p>
              </div>

              {/* Membership Number */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="membershipNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Membership Number
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <TbRosetteDiscountCheck className="h-3 w-3 mr-1 text-gray-400" />
                    Verified
                  </span>
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbIdBadge className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="membershipNumber"
                    name="membershipNumber"
                    value={formData.membershipNumber || ""}
                    disabled={true}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 rounded-lg shadow-sm text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center items-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                    Processing...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 -ml-1 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoTab;
