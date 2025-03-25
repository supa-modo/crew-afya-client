import React from "react";
import { FiArrowLeft, FiArrowRight, FiLoader, FiSearch } from "react-icons/fi";
import {
  TbLockFilled,
  TbPhoneDone,
  TbBuildingStore,
  TbRoute,
  TbArrowRight,
  TbSearch,
} from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PiMapPinAreaDuotone, PiMapPinDuotone } from "react-icons/pi";
import { RiUserCommunityLine } from "react-icons/ri";

const Step3ProfileCompletion = ({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  countyDropdownRef,
  countyDropdownOpen,
  setCountyDropdownOpen,
  countySearchTerm,
  setCountySearchTerm,
  filteredCounties,
  handleCountySelect,
  routeDropdownRef,
  routeDropdownOpen,
  setRouteDropdownOpen,
  routeSearchTerm,
  setRouteSearchTerm,
  filteredRoutes,
  handleRouteSelect,
  handlePrevStep,
  isSubmitting,
}) => {
  return (
    <div className="space-y-3">
      {/* County Selection */}
      <div>
        <label
          htmlFor="county"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
        >
          County of Operation
        </label>
        <div className="relative" ref={countyDropdownRef}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <PiMapPinAreaDuotone className="h-5 w-5 text-gray-400 dark:text-gray-400" />
          </div>
          <div
            className="relative text-sm text-secondary-700/90 font-medium sm:text-base w-full pl-12 pr-10 py-2.5 border border-gray-400/60 dark:border-gray-600 rounded-lg shadow-sm focus-within:ring-1 focus-within:outline-none focus-within:border-secondary-600 focus-within:ring-secondary-600 dark:bg-gray-700 dark:text-white dark:focus-within:ring-secondary-600 dark:focus-within:border-secondary-600 transition-colors duration-200 cursor-pointer"
            onClick={() => setCountyDropdownOpen(!countyDropdownOpen)}
          >
            {formData.county || "Select county"}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <TbArrowRight
                className={`h-5 w-5 text-secondary-600 transition-transform duration-200 ${
                  countyDropdownOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>

          {countyDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
              <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TbSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Search counties..."
                    value={countySearchTerm}
                    onChange={(e) => setCountySearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <ul className="py-1">
                {filteredCounties.map((county) => (
                  <li key={county}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleCountySelect(county)}
                    >
                      {county}
                    </button>
                  </li>
                ))}
                {filteredCounties.length === 0 && (
                  <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No counties found
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SACCO Input */}
      <div>
        <label
          htmlFor="sacco"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
        >
          SACCO Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <RiUserCommunityLine size={22} className="  text-gray-400" />
          </div>
          <input
            id="sacco"
            name="sacco"
            type="text"
            value={formData.sacco}
            onChange={handleChange}
            className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-colors duration-200"
            placeholder="Enter your SACCO name"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Nairobi Route Selection (conditionally rendered) */}
      {formData.county === "Nairobi" && (
        <div>
          <label
            htmlFor="route"
            className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
          >
            Nairobi Route
          </label>
          <div className="relative" ref={routeDropdownRef}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <TbRoute className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            </div>
            <div
              className="relative text-sm text-gray-400 sm:text-base w-full pl-12 pr-10 py-2.5 border border-gray-400/60 dark:border-gray-600 rounded-lg shadow-sm focus-within:ring-1 focus-within:outline-none focus-within:border-secondary-600 focus-within:ring-secondary-600 dark:bg-gray-700 dark:text-white dark:focus-within:ring-secondary-600 dark:focus-within:border-secondary-600 transition-colors duration-200 cursor-pointer"
              onClick={() => setRouteDropdownOpen(!routeDropdownOpen)}
            >
              {formData.route || "Select your route"}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <TbArrowRight
                  className={`h-5 w-5 text-secondary-600 transition-transform duration-200 ${
                    routeDropdownOpen ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>

            {routeDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <TbSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Search routes..."
                      value={routeSearchTerm}
                      onChange={(e) => setRouteSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <ul className="py-1">
                  {filteredRoutes.map((route) => (
                    <li key={route}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleRouteSelect(route)}
                      >
                        {route}
                      </button>
                    </li>
                  ))}
                  {filteredRoutes.length === 0 && (
                    <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No routes found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select the main route you operate on
          </p>
        </div>
      )}

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <TbLockFilled className="h-6 w-6 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-secondary-600 focus:ring-secondary-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-secondary-600 dark:focus:border-secondary-600 transition-colors duration-200"
            placeholder="••••••••"
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Password must be at least 8 characters long
        </p>
      </div>

      {/* Confirm Password Input */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-[0.83rem] ml-1 sm:text-sm font-medium text-gray-500 dark:text-gray-300 mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <TbLockFilled className="h-6 w-6 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="text-sm text-gray-600/90 sm:text-base block w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-secondary-600 focus:ring-secondary-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-secondary-600 dark:focus:border-secondary-600 transition-colors duration-200"
            placeholder="••••••••"
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isSubmitting}
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex-1 flex justify-center items-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-600 dark:focus:ring-offset-gray-800 transition-all duration-200"
          disabled={isSubmitting}
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-600 to-secondary-700 dark:from-secondary-700 dark:to-secondary-800 hover:from-secondary-700 hover:to-secondary-800 dark:hover:from-secondary-600 dark:hover:to-secondary-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-secondary-600 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Creating account...
            </div>
          ) : (
            "Complete Registration"
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3ProfileCompletion;
