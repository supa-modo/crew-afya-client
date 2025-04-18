import React from "react";
import PropTypes from "prop-types";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading,
  confirmButtonClass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto backdrop-blur-[1px]">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3 }}
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-xl w-full border border-gray-200 dark:border-gray-700 relative z-[10000]"
          onClick={(e) => e.stopPropagation()}
        >
         <div className="flex justify-between items-center py-3 px-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-200 ">
               <span>{title}</span>
              </h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <FiX size={24} />
              </button>
            </div>

          <div className="px-3 sm:px-6 py-3 sm:py-5">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-5">
              {message}
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="sm:mt-0 w-full sm:w-auto flex justify-center py-2 px-8 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`mt-3 sm:mt-0 w-full sm:w-auto flex justify-center py-2 px-8 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                  confirmButtonClass || ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
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
                  </div>
                ) : (
                  confirmText || "Confirm"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool,
  confirmButtonClass: PropTypes.string,
};

ConfirmationModal.defaultProps = {
  confirmText: "Confirm",
  cancelText: "Cancel",
  isLoading: false,
};

export default ConfirmationModal;
