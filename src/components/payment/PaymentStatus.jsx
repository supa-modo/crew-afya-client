import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbReceipt,
  TbWallet,
  TbClock,
  TbAlertTriangle,
  TbCheck,
  TbArrowRight,
  TbLoader,
  TbShieldCheck,
  TbRefresh,
  TbProgressCheck,
} from "react-icons/tb";
import { MdSpaceDashboard } from "react-icons/md";

// Add this at the top of your file or in a separate CSS file
const spinnerStyles = `
  @keyframes spinnerRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .spinner-rotate {
    animation: spinnerRotate 1.5s linear infinite;
    transform-origin: center center;
    will-change: transform;
  }

  @keyframes dash {
    0% { stroke-dashoffset: 283; }
    50% { stroke-dashoffset: 140; }
    100% { stroke-dashoffset: 283; }
  }
  
  .spinner-dash {
    animation: dash 4s ease-in-out infinite;
  }

  .gradient-spin-processing {
    --spinner-color: #0284c7;
    --spinner-color-light: #bae6fd;
  }

  .gradient-spin-waiting {
    --spinner-color: #f59e0b;
    --spinner-color-light: rgba(245, 158, 11, 0.2);
  }
`;

const PaymentStatus = ({
  status,
  phoneNumber,
  getCurrentAmount,
  getPaymentTypeTitle,
  formatCurrency,
  errorMessage,
  mpesaReceiptNumber,
  handleTryAgain,
  handleManualVerification,
  paymentId,
  paymentType,
}) => {
  const [transactionCode, setTransactionCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const onManualVerification = async () => {
    setIsVerifying(true);
    try {
      await handleManualVerification(transactionCode);
    } finally {
      setIsVerifying(false);
    }
  };

  // Adding this new component for loading spinner
  const LoadingIconWithSpinner = ({ status }) => {
    const colorTheme = getColorTheme();
    const gradientClass =
      status === "processing"
        ? "gradient-spin-processing"
        : "gradient-spin-waiting";

    return (
      <div
        className={`relative w-14 h-14 sm:w-16 sm:h-16 mb-3 ${gradientClass}`}
      >
        {/* Spinning circle */}
        <div className="spinner-rotate">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--spinner-color-light)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--spinner-color)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="283"
              className="spinner-dash"
            />
          </svg>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: "none" }}
        >
          <StatusIcon className={`h-8 w-8 ${colorTheme.icon}`} />
        </div>
      </div>
    );
  };

  // Get color theme based on status
  const getColorTheme = () => {
    const themes = {
      processing: {
        main: "primary",
        gradient:
          "from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-900/20",
        border: "border-primary-200 dark:border-primary-800/50",
        button:
          "from-primary-700 to-primary-800 hover:from-primary-800 hover:to-primary-900",
        text: "text-primary-600 dark:text-primary-500",
        iconBg: "bg-primary-100 dark:bg-primary-900/40",
        icon: "text-primary-600 dark:text-primary-400",
        bgLight: "bg-primary-50 dark:bg-primary-900/20",
        shadow: "shadow-primary-500/20 dark:shadow-primary-500/10",
      },
      waiting: {
        main: "amber",
        gradient:
          "from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20",
        border: "border-amber-200 dark:border-amber-800/50",
        button:
          "from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800",
        text: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-100 dark:bg-amber-900/40",
        icon: "text-amber-600 dark:text-amber-400",
        bgLight: "bg-amber-50 dark:bg-amber-900/10",
        shadow: "shadow-amber-500/20 dark:shadow-amber-500/10",
      },
      timeout: {
        main: "red",
        gradient:
          "from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/20",
        border: "border-red-200 dark:border-red-800/50",
        button: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
        spinner: "border-red-500",
        text: "text-red-600 dark:text-red-400",
        iconBg: "bg-red-100 dark:bg-red-900/40",
        icon: "text-red-600 dark:text-red-400",
        bgLight: "bg-red-50 dark:bg-red-900/10",
        shadow: "shadow-red-500/20 dark:shadow-red-500/10",
      },
      success: {
        main: "secondary",
        gradient:
          "from-secondary-50 to-secondary-50 dark:from-secondary-900/30 dark:to-secondary-900/20",
        border: "border-secondary-200 dark:border-secondary-800/50",
        button:
          "from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800",
        spinner: "border-secondary-500",
        text: "text-secondary-700 dark:text-secondary-500",
        iconBg: "bg-secondary-200 dark:bg-secondary-900/40",
        icon: "text-secondary-700 dark:text-secondary-400",
        bgLight: "bg-secondary-50 dark:bg-secondary-900/10",
        shadow: "shadow-secondary-500/20 dark:shadow-secondary-500/10",
      },
      error: {
        main: "red",
        gradient:
          "from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/20",
        border: "border-red-200 dark:border-red-800/50",
        button: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
        spinner: "border-red-500",
        text: "text-red-600 dark:text-red-400",
        iconBg: "bg-red-100 dark:bg-red-900/40",
        icon: "text-red-600 dark:text-red-400",
        bgLight: "bg-red-50 dark:bg-red-900/10",
        shadow: "shadow-red-500/20 dark:shadow-red-500/10",
      },
    };

    return themes[status] || themes.error;
  };

  const colorTheme = getColorTheme();

  const iconMap = {
    processing: TbWallet,
    waiting: TbWallet,
    timeout: TbAlertTriangle,
    success: TbCheck,
    error: TbAlertTriangle,
  };

  const StatusIcon = iconMap[status] || TbAlertTriangle;

  // Container variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const renderStatusContent = () => {
    switch (status) {
      case "processing":
        return (
          <motion.div
            key="processing"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center py-4 w-full"
          >
            <style>{spinnerStyles}</style>
            <LoadingIconWithSpinner status={status} />

            <h3
              className={`text-lg sm:text-xl font-semibold ${colorTheme.text} mb-2`}
            >
              Processing Payment
            </h3>

            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center">
              Please wait while we initiate your payment of{" "}
              {formatCurrency(getCurrentAmount())} for {getPaymentTypeTitle()}{" "}
              via M-Pesa.
            </p>
          </motion.div>
        );

      case "waiting":
        return (
          <motion.div
            key="waiting"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center py-4 w-full"
          >
            <style>{spinnerStyles}</style>
            <LoadingIconWithSpinner status={status} />

            <h3
              className={`text-lg sm:text-xl font-semibold ${colorTheme.text} mb-2`}
            >
              Payment In Progress
            </h3>

            <div className="max-w-xl">
              <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 mb-3">
                An M-Pesa prompt has been sent to your phone number -{" "}
                <span
                  className={`font-medium ${colorTheme.text} dark:text-gray-200 text-center`}
                >
                  {phoneNumber}
                </span>
              </p>

              <p className="text-[0.8rem] sm:text-sm text-center text-gray-500 dark:text-gray-400">
                Please enter your M-Pesa PIN when prompted to complete the
                payment of {formatCurrency(getCurrentAmount())} for{" "}
                {getPaymentTypeTitle()}.
              </p>

              <div className="w-full flex items-center justify-center space-x-2 mt-6">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">
                  Waiting for confirmation
                </span>
                <span
                  className={`w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-100`}
                ></span>
                <span
                  className={`w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-300`}
                ></span>
                <span
                  className={`w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-600`}
                ></span>
              </div>
            </div>
          </motion.div>
        );

      case "timeout":
        return (
          <motion.div
            key="timeout"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center pb-3 w-full"
          >
            <div
              className={`relative w-12 sm:w-16 h-12 sm:h-16 mb-2 rounded-full p-1 flex items-center justify-center`}
            >
              <div
                className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center`}
              >
                <StatusIcon
                  className={`h-9 sm:h-14 sm:w-9 w-14 ${colorTheme.icon}`}
                />
              </div>
            </div>

            <h3
              variants={itemVariants}
              className={`text-lg sm:text-xl font-semibold ${colorTheme.text} mb-2`}
            >
              Payment Status Unknown
            </h3>

            <p className=" text-[0.8rem] sm:text-sm text-gray-700 dark:text-gray-300 text-center">
              We didn't receive confirmation for your payment request. If you
              completed the payment on your phone, it may still be processing.
            </p>

            {/* Manual verification section */}
            <div className="w-full sm:w-[85%] my-4 sm:my-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-800">
              <p className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                If you completed the payment and received an M-Pesa confirmation
                message, enter the transaction code below:
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  placeholder="e.g. QJI12345678"
                  className={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-${colorTheme.main}-500 focus:border-${colorTheme.main}-500 dark:bg-gray-700 dark:text-white`}
                />
                <button
                  onClick={onManualVerification}
                  disabled={!transactionCode || isVerifying}
                  className={`px-4 py-2 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition-all duration-200 ${
                    !transactionCode || isVerifying
                      ? "bg-gray-400 cursor-not-allowed"
                      : `bg-gradient-to-r ${colorTheme.button} hover:shadow-lg`
                  }`}
                >
                  {isVerifying ? (
                    <TbLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
              {paymentId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Payment ID: {paymentId}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleTryAgain}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <TbRefresh className="mr-1.5 h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className={`inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r ${colorTheme.button} hover:shadow-lg transition-all duration-200`}
              >
                Go to Dashboard
                <TbArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            key="success"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center py-4 w-full"
          >
            <div
              className={`relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] mb-3 rounded-full flex items-center justify-center ${colorTheme.shadow}`}
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full  flex items-center justify-center`}
              >
                <StatusIcon className={`h-10 w-10 ${colorTheme.icon}`} />
              </div>

              <motion.svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </motion.svg>
            </div>

            <h3
              className={`text-lg md:text-xl font-semibold ${colorTheme.text} mb-2`}
            >
              Payment Successful!
            </h3>

            <p className="w-full sm:w-[90%] text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-4">
              Your payment of {formatCurrency(getCurrentAmount())} for{" "}
              {getPaymentTypeTitle()} has been processed successfully.
            </p>

            <div
              className={`w-full sm:w-[80%] bg-gradient-to-r ${colorTheme.gradient} px-6 py-4 rounded-xl border ${colorTheme.border} ${colorTheme.shadow} mb-6`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className=" mr-3">
                    <TbReceipt className={`h-7 w-7 ${colorTheme.icon}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      M-Pesa Receipt
                    </p>
                    <p className="text-base font-semibold text-secondary-700 dark:text-secondary-500">
                      {mpesaReceiptNumber || "Payment Confirmed"}
                    </p>
                  </div>
                </div>
                <div className={`${colorTheme.iconBg} p-1.5 rounded-full`}>
                  <TbCheck className={`h-4 w-4 ${colorTheme.icon}`} />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <Link
                to="/dashboard"
                className=" px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-semibold text-primary-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <div className="flex items-center justify-center">
                  <MdSpaceDashboard className="text-primary-600  mr-2 h-5 w-5" />
                  Go to Dashboard
                </div>
              </Link>
              <Link
                to="/payments/history"
                className={`w-full px-4 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r ${colorTheme.button} hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center justify-center">
                  <TbReceipt className="mr-2 h-5 w-5" />
                  View Payment History
                </div>
              </Link>
            </div>
          </motion.div>
        );

      default: // Error state
        return (
          <motion.div
            key="error"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center py-4 w-full max-w-xl"
          >
            <div
              className={`relative w-14 sm:w-16 h-14 sm:h-16 mb-0 sm:mb-1 rounded-full flex items-center justify-center`}
            >
              <div
                className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center`}
              >
                <StatusIcon
                  className={`h-10 sm:h-12 w-10 sm:w-12 ${colorTheme.icon}`}
                />
              </div>
            </div>

            <h3
              className={`text-lg sm:text-xl font-semibold ${colorTheme.text} mb-2`}
            >
              Payment Failed
            </h3>

            <div
              className={`w-full bg-gradient-to-r ${colorTheme.gradient} px-6 py-4 rounded-xl border ${colorTheme.border} ${colorTheme.shadow} mb-4`}
            >
              <div className="flex items-center mb-2">
                <div className="mr-2">
                  <TbAlertTriangle className={`h-4 w-4 ${colorTheme.icon}`} />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Error Details
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm pl-1">
                {errorMessage || "There was a problem processing your payment."}
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Please check your M-Pesa details and try again.
            </p>

            <motion.button
              variants={itemVariants}
              onClick={handleTryAgain}
              className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r ${colorTheme.button} hover:shadow-lg transition-all duration-200`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <TbRefresh className="mr-2 h-5 w-5" />
              Try Again
            </motion.button>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full flex justify-center">
      <AnimatePresence mode="wait">{renderStatusContent()}</AnimatePresence>
    </div>
  );
};

export default PaymentStatus;
