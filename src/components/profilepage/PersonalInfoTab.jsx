import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { PiUserDuotone } from "react-icons/pi";
import { TbMailFilled, TbPhone, TbUserEdit } from "react-icons/tb";
const PersonalInfoTab = ({
  formData,
  isEditing,
  setIsEditing,
  isSubmitting,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="px-6 py-6 md:h-[26.5rem]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <PiUserDuotone className="h-5 w-5 mx-2 text-secondary-700" />
          <span className="text-secondary-800 pl-1 dark:text-secondary-600">
            Personal Information
          </span>
        </h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 sm:px-6 py-1 sm:py-1.5 border   flex items-center rounded-lg text-sm font-medium transition-colors duration-200 ${
            isEditing
              ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              : "bg-primary-100 dark:bg-primary-800/50 border-primary-200 dark:border-gray-600 text-primary-700 dark:text-primary-400"
          }`}
        >
            <TbUserEdit className="h-5 w-5 mr-2" />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          

          <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              First Name
            </label>
            <div className="relative">
              <PiUserDuotone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-sm sm:text-base pl-10 pr-4 py-2 border ${
                  isEditing
                    ? "border-gray-300 dark:border-gray-600 text-primary-800 dark:text-primary-800"
                    : "border-transparent bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              Last Name
            </label>
            <div className="relative">
              <PiUserDuotone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-sm sm:text-base pl-10 pr-4 py-2 border ${
                  isEditing
                    ? "border-gray-300 dark:border-gray-600 text-primary-800 dark:text-primary-800"
                    : "border-transparent bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium`}
              />
            </div>
          </div>
          </div>

          <div>
            <label
              htmlFor="otherNames"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              Other Names
            </label>
            <div className="relative">
              <PiUserDuotone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="otherNames"
                name="otherNames"
                value={formData.otherNames || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-sm sm:text-base pl-10 pr-4 py-2 border ${
                  isEditing
                    ? "border-gray-300 dark:border-gray-600 text-primary-800 dark:text-primary-800"
                    : "border-transparent bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <TbMailFilled className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-sm sm:text-base pl-10 pr-4 py-2 border ${
                  isEditing
                    ? "border-gray-300 dark:border-gray-600 text-primary-800 dark:text-primary-800"
                    : "border-transparent bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <TbPhone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full text-sm sm:text-base pl-10 pr-4 py-2 border ${
                  isEditing
                    ? "border-gray-300 dark:border-gray-600 text-primary-800 dark:text-primary-800"
                    : "border-transparent bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
