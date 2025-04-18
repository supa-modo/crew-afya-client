import { FiCheck } from "react-icons/fi";
import { PiUserDuotone } from "react-icons/pi";
import {
  TbAlertTriangle,
  TbCheck,
  TbInfoCircle,
  TbInfoTriangle,
} from "react-icons/tb";
import { toast } from "react-toastify";

// Toast configurations
const defaultConfig = {
  position: "top-right",
  autoClose: 8000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    height: "fit-content",
    width: "fit-content",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};

// Success toast with green styling
export const showSuccessToast = (message) => {
  return toast.success(message, {
    ...defaultConfig,
    className:
      "backdrop-blur-sm bg-gradient-to-r from-green-50 via-green-100 to-green-50 dark:from-green-900/50 dark:via-green-900/40 dark:to-green-900/50 text-green-800 dark:text-green-300 text-sm font-medium font-lexend shadow-lg border border-green-200 dark:border-green-800/30",
    progressClassName:
      "bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-500",
    icon: FiCheck,
  });
};

// Error toast with red styling
export const showErrorToast = (message) => {
  return toast.error(message, {
    ...defaultConfig,
    className:
      "backdrop-blur-sm bg-gradient-to-r from-red-50 via-red-100 to-red-50 dark:from-red-900/50 dark:via-red-900/40 dark:to-red-900/50 text-red-800 dark:text-red-300 text-sm font-medium font-lexend shadow-lg border border-red-200 dark:border-red-800/30",
    progressClassName:
      "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-500",
    icon: TbAlertTriangle,
  });
};

// Info toast with primary styling
export const showInfoToast = (message) => {
  return toast.info(message, {
    ...defaultConfig,
    className:
      "backdrop-blur-sm bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 dark:from-primary-900/50 dark:via-primary-900/40 dark:to-primary-900/50 text-primary-800 dark:text-primary-300 text-sm font-medium font-lexend shadow-lg border border-primary-200 dark:border-primary-800/30",
    progressClassName:
      "bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-500",
    icon: TbInfoCircle,
  });
};

// Warning toast with amber styling
export const showWarningToast = (message) => {
  return toast.warning(message, {
    ...defaultConfig,
    className:
      "backdrop-blur-sm bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 dark:from-amber-900/50 dark:via-amber-900/40 dark:to-amber-900/50 text-amber-800 dark:text-amber-300 text-sm font-medium font-lexend shadow-lg border border-amber-200 dark:border-amber-800/30",
    progressClassName:
      "bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-500",
    icon: TbInfoTriangle,
  });
};

// Profile completion warning toast with premium styling
export const showProfileCompletionWarning = (percentage, missingItems) => {
  let message = `Your profile is ${percentage}% complete. `;

  if (missingItems && missingItems.length) {
    message += "Please complete: " + missingItems.join(", ");
  }

  return toast.warning(message, {
    ...defaultConfig,
    className:
      "backdrop-blur-sm bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 dark:from-amber-900/50 dark:via-amber-900/40 dark:to-amber-900/50 text-amber-800 dark:text-amber-300 text-sm font-medium font-lexend shadow-lg border border-amber-200 dark:border-amber-800/30",
    progressClassName:
      "bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-500",
    icon: PiUserDuotone,
    autoClose: 7000,
  });
};
