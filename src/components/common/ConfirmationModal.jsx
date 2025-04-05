import React from "react";
import { FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";
import { PiWarningDuotone } from "react-icons/pi";

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
          icon: icon || <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />,
          bgColor: "bg-green-200 dark:bg-green-900/50",
          textColor: "text-green-700 dark:text-green-500",
          buttonClass: confirmButtonClass || "bg-green-600 hover:bg-green-700",
          ringColor: "focus:ring-green-500"
        };
      case "error":
        return {
          icon: icon || <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />,
          bgColor: "bg-red-200 dark:bg-red-900/50",
          textColor: "text-red-700 dark:text-red-500",
          buttonClass: confirmButtonClass || "bg-red-600 hover:bg-red-700",
          ringColor: "focus:ring-red-500"
        };
      case "info":
        return {
          icon: icon || <FiInfo className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
          bgColor: "bg-blue-200 dark:bg-blue-900/50",
          textColor: "text-blue-700 dark:text-blue-500",
          buttonClass: confirmButtonClass || "bg-blue-600 hover:bg-blue-700",
          ringColor: "focus:ring-blue-500"
        };
      case "confirmation":
      default:
        return {
          icon: icon || <PiWarningDuotone className="h-8 w-8 text-amber-600 dark:text-amber-500" />,
          bgColor: "bg-amber-200 dark:bg-amber-900/50",
          textColor: "text-amber-700 dark:text-amber-500",
          buttonClass: confirmButtonClass || "bg-amber-600 hover:bg-amber-700",
          ringColor: "focus:ring-amber-500"
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
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-center">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full ${modalStyle.bgColor} sm:mx-0 sm:h-16 sm:w-16`}>
                {modalStyle.icon}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className={`text-base md:text-lg leading-6 font-semibold ${modalStyle.textColor}`}
                  id="modal-headline"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-[0.83rem] md:text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex flex-row-reverse gap-4 sm:gap-0">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-3 md:px-8 py-2 text-[0.83rem] sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${modalStyle.ringColor} sm:ml-3 sm:w-auto sm:text-sm ${modalStyle.buttonClass} ${
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
                className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-1 md:px-6 py-2 bg-white dark:bg-gray-800 text-[0.83rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto"
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
