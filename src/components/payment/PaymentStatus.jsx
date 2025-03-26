import React from "react";
import { Link } from "react-router-dom";
import { FiLoader, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";

const PaymentStatus = ({
  status,
  phoneNumber,
  getCurrentAmount,
  getPaymentTypeTitle,
  formatCurrency,
  errorMessage,
  mpesaReceiptNumber,
  handleTryAgain,
}) => {
  if (status === "processing") {
    return (
      <motion.div
        key="processing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-8"
      >
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <FiLoader className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
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
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <FiLoader className="h-8 w-8 text-yellow-600 dark:text-yellow-400 animate-spin" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          Payment In Progress
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
          An M-Pesa prompt has been sent to your phone ({phoneNumber}).
        </p>
        <p className="mt-2 text-[0.7rem] sm:text-sm text-gray-500 dark:text-gray-400 text-center">
          Please enter your M-Pesa PIN when prompted to complete the payment of
          KES {getCurrentAmount().toLocaleString()} for {getPaymentTypeTitle()}.
        </p>
        <p className="mt-4 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
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
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
          <FiAlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-red-500/80 dark:text-white mb-2">
          Payment Status Unknown
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
          We didn't receive confirmation for your payment request. If you
          completed the payment on your phone, it may still be processing.
        </p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          You can check your payment history later to confirm if it was
          successful.
        </p>
        <button
          onClick={handleTryAgain}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Try Again
        </button>
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
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
          Your payment for {getPaymentTypeTitle()} has been processed
          successfully.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 my-2 w-full max-w-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Amount: {formatCurrency(getCurrentAmount())}
          </p>
          {mpesaReceiptNumber && (
            <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300">
              M-Pesa Receipt: {mpesaReceiptNumber}
            </p>
          )}
        </div>
        <p className="mt-4 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
          You can download a receipt of this payment from transactions history
          in{" "}
          <Link
            to="/payments"
            className="text-primary-600 hover:text-primary-700"
          >
            Payments page
          </Link>
          .
        </p>
      </motion.div>
    );
  }

  if (status === "error") {
    return (
      <motion.div
        key="error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center py-8"
      >
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          Payment Failed
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          {errorMessage}
        </p>
        <button
          onClick={handleTryAgain}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return null;
};

export default PaymentStatus;
