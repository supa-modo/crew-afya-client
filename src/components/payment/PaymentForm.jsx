import { useState } from "react";
import { FiCreditCard, FiPhone, FiCheck, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  TbCash,
  TbDeviceMobile,
  TbAlertTriangle,
  TbBrandCashapp,
} from "react-icons/tb";
import { MpesaIcon } from "../common/icons";

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
  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  // Handle phone number change with validation
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers, +, and no more than 13 characters
    if (/^[0-9+]*$/.test(value) && value.length <= 13) {
      setPhoneNumber(value);
    }
  };

  // Get button gradient based on payment type
  const getButtonGradient = () => {
    switch (paymentType) {
      case "medical":
        return "from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800";
      case "membership":
        return "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800";
      default:
        return "from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800";
    }
  };

  return (
    <motion.form
      key="payment-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={onSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5"
    >
      {/* Amount Field */}
      <div>
        <label
          htmlFor="amount"
          className=" text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center"
        >
          
          Amount (Kshs.)
        </label>
        <input
          type="text"
          id="amount"
          value={getCurrentAmount().toLocaleString()}
          disabled
          className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-medium"
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          M-Pesa Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="07XX XXX XXX"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="block w-full px-4 py-2.5 text-sm sm:text-base text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800"
            disabled={isSubmitting || disabled}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <TbDeviceMobile className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="mt-1 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
          Enter your phone number registered with M-Pesa
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800/30">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TbAlertTriangle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm md:text-[0.95rem] font-medium text-white bg-gradient-to-r from-secondary-700/90 via-secondary-800/90 to-secondary-700 hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          paymentType === "membership"
            ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
            : ""
        }`}
        disabled={isSubmitting || disabled}
      >
        {isSubmitting ? (
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
          <>
            Pay with
            <MpesaIcon variant="white" width={64} height={22} className="ml-1 mt-0.5" />
          </>
        )}
      </button>

      <p className="text-[0.7rem] sm:text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
        You will receive an M-Pesa STK push prompt on your phone
      </p>
    </motion.form>
  );
};

export default PaymentForm;
