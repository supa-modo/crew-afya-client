import React, { useState } from "react";
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
  handleManualVerification,
  paymentId
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
        <h3 className="text-base sm:text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">
          Payment Status Unknown
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
          We didn't receive confirmation for your payment request. If you
          completed the payment on your phone, it may still be processing.
        </p>
        
        {/* Manual verification section */}
        <div className="w-full max-w-md mt-2 mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            If you completed the payment and received an M-Pesa confirmation message, 
            enter the transaction code below:
          </p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              placeholder="e.g. QJI12345678"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={onManualVerification}
              disabled={!transactionCode || isVerifying}
              className={`px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !transactionCode || isVerifying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Try Again
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Dashboard
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
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          Payment Successful!
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
          Your payment of {formatCurrency(getCurrentAmount())} for{" "}
          {getPaymentTypeTitle()} has been processed successfully.
        </p>
        {mpesaReceiptNumber && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
            M-Pesa Receipt Number: <strong>{mpesaReceiptNumber}</strong>
          </p>
        )}
        <div className="mt-6 flex space-x-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Dashboard
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
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-red-600 dark:text-red-400 mb-2">
        Payment Failed
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-2">
        {errorMessage || "There was a problem processing your payment."}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
        Please check your M-Pesa details and try again.
      </p>
      <button
        onClick={handleTryAgain}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Try Again
      </button>
    </motion.div>
  );
};

export default PaymentStatus;
