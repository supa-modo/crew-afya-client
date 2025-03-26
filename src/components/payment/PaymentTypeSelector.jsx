import React from "react";
import { FiCheck, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const PaymentTypeSelector = ({
  paymentTypes,
  paymentType,
  activeTabIndex,
  navigateTab,
  handlePaymentTypeChange,
  disabled = false,
}) => {
  return (
    <>
      {/* Mobile Payment Type Navigation with Arrows */}
      {!disabled && (
        <div className="md:hidden mb-5">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => navigateTab("prev")}
              disabled={activeTabIndex === 0 || disabled}
              className={`p-2 rounded-full ${
                activeTabIndex === 0 || disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              }`}
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {activeTabIndex + 1} of {paymentTypes.length}
            </span>
            <button
              type="button"
              onClick={() => navigateTab("next")}
              disabled={activeTabIndex === paymentTypes.length - 1 || disabled}
              className={`p-2 rounded-full ${
                activeTabIndex === paymentTypes.length - 1 || disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              }`}
            >
              <FiArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Swipeable Tab Panel */}
          <div className="overflow-hidden relative">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeTabIndex * 100}%)` }}
            >
              {paymentTypes.map((type, index) => (
                <div key={type.id} className="w-full flex-shrink-0">
                  <div
                    className={`relative flex flex-col items-center justify-center px-6 py-3 rounded-xl border-2 
                      ${
                        type.disabled || disabled
                          ? "opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-700"
                          : paymentType === type.id
                          ? `border-${type.color}-500 bg-${type.color}-100 dark:bg-${type.color}-900/30`
                          : "border-gray-200 dark:border-gray-700"
                      } transition-all`}
                  >
                    <div
                      className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center 
                      ${
                        type.disabled || disabled
                          ? "bg-gray-100 dark:bg-gray-700"
                          : paymentType === type.id
                          ? `bg-${type.color}-200 dark:bg-${type.color}-800`
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <type.icon
                        className={`h-7 w-7 
                          ${
                            type.disabled || disabled
                              ? "text-gray-500 dark:text-gray-400"
                              : paymentType === type.id
                              ? `text-${type.color}-600 dark:text-${type.color}-400`
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                      />
                    </div>
                    <span
                      className={`text-sm sm:text-base font-medium 
                      ${
                        type.disabled || disabled
                          ? "text-gray-500 dark:text-gray-400"
                          : paymentType === type.id
                          ? `text-${type.color}-700 dark:text-${type.color}-300`
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {type.label}
                    </span>
                    {type.soon && (
                      <span className="absolute bottom-0 text-[0.65rem] text-gray-500">
                        Coming soon
                      </span>
                    )}
                    {paymentType === type.id && !type.disabled && !disabled && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <FiCheck className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Payment Type Selection */}
      {!disabled && (
        <div className="hidden md:block mb-4">
          <label className="block text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Payment Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {paymentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  !type.disabled &&
                  !disabled &&
                  handlePaymentTypeChange(type.id)
                }
                disabled={type.disabled || disabled}
                className={`relative flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 ${
                  type.disabled || disabled
                    ? "border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
                    : paymentType === type.id
                    ? `border-${type.color}-500 bg-${type.color}-100 dark:bg-${type.color}-900/30`
                    : "border-gray-200 dark:border-gray-700"
                } transition-all hover:shadow-md`}
              >
                <div
                  className={`w-10 h-10 mb-1 rounded-full flex items-center justify-center ${
                    type.disabled || disabled
                      ? "bg-gray-200 dark:bg-gray-700"
                      : paymentType === type.id
                      ? `bg-${type.color}-200 dark:bg-${type.color}-800`
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <type.icon
                    className={`h-5 w-5 ${
                      type.disabled || disabled
                        ? "text-gray-500 dark:text-gray-400"
                        : paymentType === type.id
                        ? `text-${type.color}-600 dark:text-${type.color}-400`
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    type.disabled || disabled
                      ? "text-gray-700 dark:text-gray-300"
                      : paymentType === type.id
                      ? `text-${type.color}-700 dark:text-${type.color}-300`
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {type.label}
                </span>
                {type.soon && (
                  <span className="absolute bottom-0 text-[0.65rem] text-gray-500">
                    Coming soon
                  </span>
                )}
                {paymentType === type.id && !type.disabled && !disabled && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <FiCheck className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentTypeSelector;
