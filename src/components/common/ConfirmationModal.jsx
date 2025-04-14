import React from "react";
import { FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";
import { PiWarningDuotone } from "react-icons/pi";
import { motion } from "framer-motion";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "confirmation", // Can be: 'confirmation', 'success', 'error', 'info'
  icon,
  confirmButtonClass,
  isLoading = false,
  showCancelButton = true,
}) => {
  // Define styling based on type
  const getModalStyling = () => {
    switch (type) {
      case "success":
        return {
          icon: icon || (
            <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
          ),
          bgColor:
            "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/20",
          textColor: "text-green-700 dark:text-green-500",
          buttonClass:
            confirmButtonClass ||
            "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
          ringColor: "focus:ring-green-500",
          borderColor: "border-green-200 dark:border-green-800/50",
          mainBg: "bg-white dark:bg-gray-800",
        };
      case "error":
        return {
          icon: icon || (
            <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
          ),
          bgColor:
            "bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/20",
          textColor: "text-red-700 dark:text-red-500",
          buttonClass:
            confirmButtonClass ||
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
          ringColor: "focus:ring-red-500",
          borderColor: "border-red-200 dark:border-red-800/50",
          mainBg: "bg-white dark:bg-gray-800",
        };
      case "info":
        return {
          icon: icon || (
            <FiInfo className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          ),
          bgColor:
            "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/20",
          textColor: "text-blue-700 dark:text-blue-500",
          buttonClass:
            confirmButtonClass ||
            "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
          ringColor: "focus:ring-blue-500",
          borderColor: "border-blue-200 dark:border-blue-800/50",
          mainBg: "bg-white dark:bg-gray-800",
        };
      case "confirmation":
      default:
        return {
          icon: icon || (
            <PiWarningDuotone className="h-8 w-8 text-amber-600 dark:text-amber-500" />
          ),
          bgColor:
            "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/20",
          textColor: "text-amber-700 dark:text-amber-500",
          buttonClass:
            confirmButtonClass ||
            "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800",
          ringColor: "focus:ring-amber-500",
          borderColor: "border-amber-200 dark:border-amber-800/50",
          mainBg: "bg-white dark:bg-gray-800",
        };
    }
  };

  const modalStyle = getModalStyling();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75 backdrop-blur-sm"></div>
        </div>

        {/* Modal panel */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div
            className={`${modalStyle.mainBg} relative z-10 px-4 pt-5 pb-4 sm:p-5 sm:pb-4`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <div
                className={`mx-auto flex-shrink-0 flex items-center h-8 w-8 sm:mx-0`}
              >
                {modalStyle.icon}
              </div>
              <div className="mt-3 justify-center sm:mt-0 sm:ml-5 sm:text-left">
                <h3
                  className={`text-base md:text-lg leading-6 font-semibold ${modalStyle.textColor}`}
                  id="modal-headline"
                >
                  {title}
                </h3>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[0.83rem] md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 px-4 py-4 sm:px-6 flex flex-row-reverse gap-4 sm:gap-2 relative z-10">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-lg border border-transparent px-4 md:px-8 py-2.5 text-[0.83rem] sm:text-sm font-medium text-white focus:outline-none   ${
                modalStyle.ringColor
              } sm:ml-3 sm:w-auto hover:shadow-lg ${modalStyle.buttonClass} ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
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
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
            {showCancelButton && (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 px-3 md:px-6 py-2.5 bg-white dark:bg-gray-800 text-[0.83rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto transition-all duration-200"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
