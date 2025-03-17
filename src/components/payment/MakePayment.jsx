import { useState } from "react";
import {
  FiCreditCard,
  FiPhone,
  FiLoader,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { apiPost } from "../../services/api";

const MakePayment = ({ selectedPlan, frequency }) => {
  let [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setErrorMessage("Please enter your M-Pesa phone number");
      return;
    }

    // Phone validation (simple check for now)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("processing");

    try {
      // Format phone number to ensure it starts with 254 (Kenya)
      if (phoneNumber.startsWith("0")) {
        phoneNumber = `254${phoneNumber.substring(1)}`;
      } else if (phoneNumber.startsWith("+")) {
        phoneNumber = phoneNumber.substring(1);
      }

      // Make API call to initiate payment using our apiPost helper
      const response = await apiPost("/payments/mpesa", {
        amount: selectedPlan.premiums[frequency],
        phoneNumber,
        description: `Payment for ${selectedPlan.name} (${frequency}) medical cover`,
      });

      if (response.success) {
        setPaymentStatus("success");

        // Reset form after success
        setTimeout(() => {
          setPaymentStatus("idle");
          setPhoneNumber("");
        }, 3000);
      } else {
        setPaymentStatus("error");
        setErrorMessage(
          response.message || "Failed to process payment. Please try again."
        );
      }
    } catch (error) {
      setPaymentStatus("error");
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const handleTryAgain = () => {
    setPaymentStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Make a Payment
      </h3>

      <AnimatePresence mode="wait">
        {paymentStatus === "idle" && (
          <motion.form
            key="payment-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Amount (KES)
              </label>
              <input
                type="text"
                id="amount"
                value={selectedPlan.premiums[frequency].toLocaleString()}
                disabled
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254700000000"
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              {errorMessage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Pay with M-Pesa
              <FiCreditCard className="ml-2 h-5 w-5" />
            </button>
          </motion.form>
        )}

        {paymentStatus === "processing" && (
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Processing Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Please wait while we process your payment of KES{" "}
              {selectedPlan.premiums[frequency].toLocaleString()} via M-Pesa.
            </p>
          </motion.div>
        )}

        {paymentStatus === "success" && (
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
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Your payment of KES{" "}
              {selectedPlan.premiums[frequency].toLocaleString()} has been
              processed successfully.
            </p>
          </motion.div>
        )}

        {paymentStatus === "error" && (
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default MakePayment;
