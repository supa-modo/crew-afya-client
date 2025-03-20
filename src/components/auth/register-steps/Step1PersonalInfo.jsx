import React from "react";
import { FiArrowRight, FiMail } from "react-icons/fi";
import {
  PiIdentificationBadgeDuotone,
  PiPhoneListDuotone,
  PiUserDuotone,
  PiGenderIntersexDuotone,
} from "react-icons/pi";
import { TbGenderMale, TbGenderFemale } from "react-icons/tb";

const Step1PersonalInfo = ({
  formData,
  handleChange,
  handleGenderSelect,
  isSubmitting,
}) => {
  return (
    <div className="space-y-3">
      {/* Gender Selection */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleGenderSelect("Male")}
            className={`flex items-center justify-center py-1.5 sm:py-2 px-4 border ${
              formData.gender === "Male"
                ? "border-primary-500 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            } rounded-lg shadow-sm text-sm font-medium transition-colors duration-200 `}
            disabled={isSubmitting}
          >
            <TbGenderMale
              className={`mr-2 h-5 w-5 ${
                formData.gender === "Male"
                  ? "text-primary-500"
                  : "text-gray-400"
              }`}
            />
            Male
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect("Female")}
            className={`flex items-center justify-center py-1.5 sm:py-2 px-4 border ${
              formData.gender === "Female"
                ? "border-primary-500 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
            } rounded-lg shadow-sm text-sm font-medium transition-colors duration-200 `}
            disabled={isSubmitting}
          >
            <TbGenderFemale
              className={`mr-2 h-5 w-5 ${
                formData.gender === "Female"
                  ? "text-primary-500"
                  : "text-gray-400"
              }`}
            />
            Female
          </button>
        </div>
      </div>

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
            className="text-sm text-gray-600/90 font-medium sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
            placeholder="John Doe"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="idNumber"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
        >
          ID Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <PiIdentificationBadgeDuotone className="h-5 sm:h-6 w-5 sm:w-6 text-gray-400" />
          </div>
          <input
            id="idNumber"
            name="idNumber"
            type="text"
            value={formData.idNumber}
            onChange={handleChange}
            className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
            placeholder="Enter your ID number"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
        >
          Email Address (Optional)
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
            className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
            placeholder="example@email.com"
            disabled={isSubmitting}
          />
        </div>
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
            <PiPhoneListDuotone className="h-5 sm:h-6 w-5 sm:w-6 text-gray-400" />
          </div>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
            placeholder="+254700000000"
            required
            disabled={isSubmitting}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          We'll send a verification code to this number
        </p>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 focus:outline-none focus:border-p focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        <span>Continue</span>
        <FiArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
};

export default Step1PersonalInfo;
