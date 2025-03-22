import { useState, useEffect } from "react";
import {
  FiCreditCard,
  FiPhone,
  FiLoader,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  initiateM_PesaPayment,
  checkPaymentStatus,
} from "../../services/paymentService";

const MakePayment = ({ selectedPlan, frequency }) => {
  let [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [mpesaReceiptNumber, setMpesaReceiptNumber] = useState(null);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Function to check payment status
  const startStatusCheck = (paymentId) => {
    // Clear any existing interval
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }

    // Set up status check every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await checkPaymentStatus(paymentId);

        if (response && response.success) {
          const status = response.data.status;

          // If payment completed, show success
          if (status === "completed") {
            setPaymentStatus("success");
            setMpesaReceiptNumber(response.data.mpesaReceiptNumber);
            clearInterval(interval);
            setStatusCheckInterval(null);

            // Reset form after success (with delay)
            setTimeout(() => {
              setPaymentStatus("idle");
              setPhoneNumber("");
              setCheckoutRequestId(null);
              setPaymentId(null);
              setMpesaReceiptNumber(null);
            }, 10000);
          }
          // If payment failed, show error
          else if (status === "failed") {
            setPaymentStatus("error");
            setErrorMessage(
              response.data.failureReason ||
                "Payment was not completed. Please try again."
            );
            clearInterval(interval);
            setStatusCheckInterval(null);
          }
          // Otherwise continue checking (pending status)
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        // Don't stop the interval on error, continue checking
      }
    }, 5000); // Check every 5 seconds

    setStatusCheckInterval(interval);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setErrorMessage("Please enter your M-Pesa phone number");
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      // Ensure we have a valid amount to send
      const amount = selectedPlan?.premiums?.[frequency];
      if (!amount || isNaN(Number(amount))) {
        throw new Error("Invalid payment amount. Please select a valid plan.");
      }

      // Use the enhanced payment service to initiate M-Pesa payment
      const response = await initiateM_PesaPayment({
        //TODO: uncomment in production to use the actual amount
        // amount: Number(amount),
        amount: 1,
        phoneNumber,
        description: `Payment for ${selectedPlan.name} (${frequency}) medical cover`,
      });

      if (response && response.success) {
        // Store checkout request ID and payment ID for status checking
        if (
          response.data &&
          response.data.payment &&
          response.data.stkResponse
        ) {
          setCheckoutRequestId(response.data.stkResponse.CheckoutRequestID);
          setPaymentId(response.data.payment.id);

          // Start checking status
          startStatusCheck(response.data.payment.id);
        }

        setPaymentStatus("waiting");

        // Set timeout to change status to "timeout" after 2 minutes if no update
        setTimeout(() => {
          setPaymentStatus((currentStatus) => {
            if (currentStatus === "waiting") {
              // If still waiting after 2 minutes, show timeout message
              if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
                setStatusCheckInterval(null);
              }
              return "timeout";
            }
            return currentStatus;
          });
        }, 120000); // 2 minutes timeout
      } else {
        setPaymentStatus("error");
        setErrorMessage(
          response?.message || "Failed to process payment. Please try again."
        );
      }
    } catch (error) {
      console.error("M-Pesa payment error:", error);
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
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  // Safety check for premium amount
  const premiumAmount = selectedPlan?.premiums?.[frequency] || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg py-5 px-2 sm:px-12">
      <h3 className="text-lg font-semibold text-secondary-700 dark:text-white mb-2">
        Make a Payment
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Please enter your M-Pesa phone number to make a payment for your{" "}
        {selectedPlan?.name || "selected"} plan.
      </p>

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
                className="block text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Amount (KES)
              </label>
              <input
                type="text"
                id="amount"
                value={premiumAmount.toLocaleString()}
                disabled
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

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
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  autoComplete="tel"
                />
              </div>
              {errorMessage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter your phone number in the format 07XXXXXXXX or
                +2547XXXXXXXX
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !phoneNumber || !premiumAmount}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
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
              Processing Payment Request
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Please wait while we initiate your payment of KES{" "}
              {premiumAmount.toLocaleString()} via M-Pesa.
            </p>
          </motion.div>
        )}

        {paymentStatus === "waiting" && (
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Payment In Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              An M-Pesa prompt has been sent to your phone ({phoneNumber}).
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              Please enter your M-Pesa PIN when prompted to complete the payment
              of KES {premiumAmount.toLocaleString()}.
            </p>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              Waiting for confirmation... This may take a few moments.
            </p>
          </motion.div>
        )}

        {paymentStatus === "timeout" && (
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Payment Status Unknown
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
              We didn't receive confirmation for your payment request. If you
              completed the payment on your phone, it may still be processing.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
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
              Your payment of KES {premiumAmount.toLocaleString()} has been
              processed successfully.
            </p>
            {mpesaReceiptNumber && (
              <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400 text-center">
                M-Pesa Receipt: {mpesaReceiptNumber}
              </p>
            )}
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              A confirmation message will be sent to your phone shortly.
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
