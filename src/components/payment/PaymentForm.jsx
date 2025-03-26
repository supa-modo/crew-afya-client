import { useState } from "react";
import { FiCreditCard, FiPhone, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

const PaymentForm = ({
  phoneNumber,
  setPhoneNumber,
  paymentType,
  errorMessage,
  getCurrentAmount,
  getPaymentTypeTitle,
  isSubmitting,
  handleSubmit,
  disabled = false,
}) => {
  return (
    <motion.form
      key="payment-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Amount Field */}
      <div>
        <label
          htmlFor="amount"
          className="block text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Amount (KES)
        </label>
        <input
          type="text"
          id="amount"
          value={getCurrentAmount().toLocaleString()}
          disabled
          className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          M-Pesa Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiPhone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.trim())}
            placeholder="07XXXXXXXX"
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            autoComplete="tel"
            disabled={disabled}
          />
        </div>
        {errorMessage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}
        <p className="mt-1 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
          Enter your phone number in the format 07XXXXXXXX or +2547XXXXXXXX
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          isSubmitting || !phoneNumber || !getCurrentAmount() || disabled
        }
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white ${
          paymentType === "membership"
            ? "bg-green-600 hover:bg-green-800 focus:ring-green-600"
            : "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200`}
      >
        Pay {getPaymentTypeTitle()}
        <FiCreditCard className="ml-2 h-5 w-5" />
      </button>
    </motion.form>
  );
};

export default PaymentForm;
