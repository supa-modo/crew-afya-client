import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiLoader,
  FiCheck,
  FiAlertTriangle,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { TbReceipt, TbWallet } from "react-icons/tb";

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

  // Get color theme based on payment type
  const getColorTheme = () => {
    switch (paymentType) {
      case "medical":
        return {
          main: "primary",
          gradient:
            "from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/20",
          border: "border-primary-200 dark:border-primary-800/50",
          button:
            "from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800",
          ring: "ring-primary-500",
        };
      case "membership":
        return {
          main: "green",
          gradient:
            "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20",
          border: "border-green-200 dark:border-green-800/50",
          button:
            "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
          ring: "ring-green-500",
        };
      default:
        return {
          main: "gray",
          gradient:
            "from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/20",
          border: "border-gray-200 dark:border-gray-800/50",
          button:
            "from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
          ring: "ring-gray-500",
        };
    }
  };

  const colorTheme = getColorTheme();

  if (status === "processing") {
    return (
      <motion.div
        key="processing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-8"
      >
        <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/20 shadow-md">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 relative">
            <div className="absolute inset-0 rounded-full border-t-3 border-primary-500 animate-spin"></div>
            <TbWallet className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          Processing Payment Request
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
          Please wait while we initiate your payment of KES{" "}
          {getCurrentAmount().toLocaleString()} for {getPaymentTypeTitle()} via
          M-Pesa.
        </p>
      </motion.div>
    );
  }

  if (status === "waiting") {
    return (
      <motion.div
        key="waiting"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-8"
      >
        <div className="sm:w-24 sm:h-24 w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/20 shadow-md">
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 relative">
            <div className="absolute inset-0 rounded-full border-t-3 border-yellow-500 animate-spin"></div>
            <FiClock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          Payment In Progress
        </h3>
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/10 px-6 py-4 rounded-xl border border-yellow-200 dark:border-yellow-800/50 mb-4 shadow-md max-w-md">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">
            An M-Pesa prompt has been sent to your phone:
          </p>
          <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
            {phoneNumber}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Please enter your M-Pesa PIN when prompted to complete the payment
            of KES {getCurrentAmount().toLocaleString()} for{" "}
            {getPaymentTypeTitle()}.
          </p>
        </div>
        <p className="mt-2 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
          Waiting for confirmation... This may take a few moments.
        </p>
      </motion.div>
    );
  }

  if (status === "timeout") {
    return (
      <motion.div
        key="timeout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-8"
      >
        <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20 shadow-md">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white dark:bg-gray-800">
            <FiAlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">
          Payment Status Unknown
        </h3>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 px-6 py-4 rounded-xl border border-orange-200 dark:border-orange-800/50 mb-4 shadow-md max-w-md">
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center mb-2">
            We didn't receive confirmation for your payment request. If you
            completed the payment on your phone, it may still be processing.
          </p>
        </div>

        {/* Manual verification section */}
        <div className="w-full max-w-md mt-2 mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            If you completed the payment and received an M-Pesa confirmation
            message, enter the transaction code below:
          </p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              placeholder="e.g. QJI12345678"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
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
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </button>
          </div>
          {paymentId && (
            <p className="text-[0.65rem] text-gray-500 dark:text-gray-400 mt-1">
              Payment ID: {paymentId}
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleTryAgain}
            className="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Try Again
          </button>
          <Link
            to="/dashboard"
            className={`inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r ${colorTheme.button} hover:shadow-lg transition-all duration-200`}
          >
            Go to Dashboard
            <FiArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-8"
      >
        <div className="sm:w-24 sm:h-24 w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 shadow-md">
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-white dark:bg-gray-800">
            <FiCheck className="h-10 sm:h-12 w-10 sm:w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
          Your payment of {formatCurrency(getCurrentAmount())} for{" "}
          {getPaymentTypeTitle()} has been processed successfully.
        </p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 px-6 py-4 rounded-xl border border-green-200 dark:border-green-800/50 my-4 shadow-md max-w-md">
          {mpesaReceiptNumber && (
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              M-Pesa Receipt:
              <span className="text-green-700 dark:text-green-400 font-semibold ml-2">
                {mpesaReceiptNumber}
              </span>
            </p>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <Link
            to="/dashboard"
            className={`inline-flex items-center px-4 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r ${colorTheme.button} hover:shadow-lg transition-all duration-200`}
          >
            <TbReceipt className="mr-2 h-5 w-5" />
            View Payment History
          </Link>
        </div>
      </motion.div>
    );
  }

  // Error state
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center py-8"
    >
      <div className="sm:w-24 sm:h-24 w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10 shadow-md">
        <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-white dark:bg-gray-800">
          <FiAlertTriangle className="h-10 sm:h-12 w-10 sm:w-12 text-red-600 dark:text-red-400" />
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-medium text-red-600 dark:text-red-400 mb-2">
        Payment Failed
      </h3>

      <div className="bg-gradient-to-r from-red-50 to-red-50/70 dark:from-red-900/20 dark:to-red-900/10 px-6 py-4 rounded-xl border border-red-200 dark:border-red-800/50 mb-4 shadow-md max-w-md">
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          {errorMessage || "There was a problem processing your payment."}
        </p>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
        Please check your M-Pesa details and try again.
      </p>

      <button
        onClick={handleTryAgain}
        className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r ${colorTheme.button} hover:shadow-lg transition-all duration-200`}
      >
        Try Again
      </button>
    </motion.div>
  );
};

export default PaymentStatus;
