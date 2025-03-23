import { useState, useEffect } from "react";
import {
  FiCreditCard,
  FiPhone,
  FiLoader,
  FiCheck,
  FiAlertTriangle,
  FiUsers,
  FiShield,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { TbCreditCardFilled, TbShieldHalfFilled } from "react-icons/tb";
import { PiUserDuotone } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import {
  initiateM_PesaPayment,
  checkPaymentStatus,
} from "../../services/paymentService";

const MakePayment = ({
  selectedPlan,
  frequency,
  initialPaymentType = "medical",
}) => {
  let [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [mpesaReceiptNumber, setMpesaReceiptNumber] = useState(null);
  const [paymentType, setPaymentType] = useState(initialPaymentType); // medical, dues, loan
  const [unionDuesAmount, setUnionDuesAmount] = useState(500); // Default amount for union dues
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialPaymentType === "medical" ? 0 : initialPaymentType === "dues" ? 1 : 2
  );

  // Set initial payment type based on parent component's active tab
  useEffect(() => {
    setPaymentType(initialPaymentType);
    setActiveTabIndex(
      initialPaymentType === "medical"
        ? 0
        : initialPaymentType === "dues"
        ? 1
        : 2
    );
  }, [initialPaymentType]);

  // Array of payment types for navigation
  const paymentTypes = [
    {
      id: "medical",
      label: "Medical Cover",
      icon: TbShieldHalfFilled,
      color: "primary",
      disabled: false,
    },
    {
      id: "dues",
      label: "Union Dues",
      icon: PiUserDuotone,
      color: "green",
      disabled: false,
    },
    {
      id: "loan",
      label: "Loan Repayment",
      icon: TbCreditCardFilled,
      color: "gray",
      disabled: true,
      soon: true,
    },
  ];

  // Function to navigate tabs on mobile
  const navigateTab = (direction) => {
    let newIndex = activeTabIndex;

    if (direction === "next" && activeTabIndex < paymentTypes.length - 1) {
      newIndex = activeTabIndex + 1;
    } else if (direction === "prev" && activeTabIndex > 0) {
      newIndex = activeTabIndex - 1;
    }

    // Skip disabled tabs
    if (
      paymentTypes[newIndex].disabled &&
      direction === "next" &&
      newIndex < paymentTypes.length - 1
    ) {
      newIndex += 1;
    } else if (
      paymentTypes[newIndex].disabled &&
      direction === "prev" &&
      newIndex > 0
    ) {
      newIndex -= 1;
    }

    setActiveTabIndex(newIndex);
    setPaymentType(paymentTypes[newIndex].id);
  };

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
      // Determine payment amount based on payment type
      let amount, description;

      if (paymentType === "medical") {
        amount = selectedPlan?.premiums?.[frequency];
        description = `Payment for ${selectedPlan.name} (${frequency}) medical cover`;
      } else if (paymentType === "dues") {
        amount = unionDuesAmount;
        description = `Payment for monthly union dues`;
      } else if (paymentType === "loan") {
        // Future implementation for loan repayments
        amount = 0; // This would be replaced with actual loan repayment amount
        description = `Payment for loan repayment`;
      }

      if (!amount || isNaN(Number(amount))) {
        throw new Error(
          "Invalid payment amount. Please select a valid payment type."
        );
      }

      // Use the enhanced payment service to initiate M-Pesa payment
      const response = await initiateM_PesaPayment({
        //TODO: uncomment in production to use the actual amount
        // amount: Number(amount),
        amount: 1,
        phoneNumber,
        description: description,
        paymentType: paymentType, // Add payment type to track in backend
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

  // Get current amount based on payment type
  const getCurrentAmount = () => {
    if (paymentType === "medical") {
      return selectedPlan?.premiums?.[frequency] || 0;
    } else if (paymentType === "dues") {
      return unionDuesAmount;
    } else {
      return 0; // For future loan implementation
    }
  };

  // Get payment type title
  const getPaymentTypeTitle = () => {
    if (paymentType === "medical") {
      return `${selectedPlan?.name || "Medical"} Cover`;
    } else if (paymentType === "dues") {
      return "Union Dues";
    } else {
      return "Loan Repayment";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg px-2 sm:px-12">
      <h3 className="text-lg font-semibold text-secondary-700 dark:text-white mb-2">
        Make a Payment
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Select a payment type and enter your M-Pesa phone number to complete
        your payment.
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
            {/* Mobile Payment Type Navigation with Arrows */}
            <div className="md:hidden mb-5">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => navigateTab("prev")}
                  disabled={activeTabIndex === 0}
                  className={`p-2 rounded-full ${
                    activeTabIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  }`}
                >
                  <FiArrowLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activeTabIndex + 1} of {paymentTypes.length}
                </span>
                <button
                  type="button"
                  onClick={() => navigateTab("next")}
                  disabled={activeTabIndex === paymentTypes.length - 1}
                  className={`p-2 rounded-full ${
                    activeTabIndex === paymentTypes.length - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  }`}
                >
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Swipeable Tab Panel */}
              <div className="overflow-hidden relative">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${activeTabIndex * 100}%)` }}
                >
                  {paymentTypes.map((type, index) => (
                    <div key={type.id} className="w-full flex-shrink-0">
                      <div
                        className={`relative flex flex-col items-center justify-center px-6 py-3 rounded-lg border-2 
                          ${
                            type.disabled
                              ? "opacity-60 cursor-not-allowed border-gray-200 dark:border-gray-700"
                              : paymentType === type.id
                              ? `border-${type.color}-500 bg-${type.color}-100 dark:bg-${type.color}-900/30`
                              : "border-gray-200 dark:border-gray-700"
                          } transition-all`}
                      >
                        <div
                          className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center 
                          ${
                            type.disabled
                              ? "bg-gray-100 dark:bg-gray-700"
                              : paymentType === type.id
                              ? `bg-${type.color}-200 dark:bg-${type.color}-800`
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <type.icon
                            className={`h-7 w-7 
                              ${
                                type.disabled
                                  ? "text-gray-500 dark:text-gray-400"
                                  : paymentType === type.id
                                  ? `text-${type.color}-600 dark:text-${type.color}-400`
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                          />
                        </div>
                        <span
                          className={`text-sm sm:text-base font-medium 
                          ${
                            type.disabled
                              ? "text-gray-500 dark:text-gray-400"
                              : paymentType === type.id
                              ? `text-${type.color}-700 dark:text-${type.color}-300`
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {type.label}
                        </span>
                        {type.soon && (
                          <span className="absolute bottom-0 text-[0.65rem] text-gray-500">
                            Coming soon
                          </span>
                        )}
                        {paymentType === type.id && !type.disabled && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <FiCheck className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Payment Type Selection */}
            <div className="hidden md:block mb-4">
              <label className="block text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Payment Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {paymentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => !type.disabled && setPaymentType(type.id)}
                    disabled={type.disabled}
                    className={`relative flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 ${
                      type.disabled
                        ? "border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
                        : paymentType === type.id
                        ? `border-${type.color}-500 bg-${type.color}-100 dark:bg-${type.color}-900/30`
                        : "border-gray-200 dark:border-gray-700"
                    } transition-all hover:shadow-md`}
                  >
                    <div
                      className={`w-10 h-10 mb-1 rounded-full flex items-center justify-center ${
                        type.disabled
                          ? "bg-gray-200 dark:bg-gray-700"
                          : paymentType === type.id
                          ? `bg-${type.color}-200 dark:bg-${type.color}-800`
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <type.icon
                        className={`h-5 w-5 ${
                          type.disabled
                            ? "text-gray-500 dark:text-gray-400"
                            : paymentType === type.id
                            ? `text-${type.color}-600 dark:text-${type.color}-400`
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        type.disabled
                          ? "text-gray-700 dark:text-gray-300"
                          : paymentType === type.id
                          ? `text-${type.color}-700 dark:text-${type.color}-300`
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {type.label}
                    </span>
                    {type.soon && (
                      <span className="absolute bottom-0 text-[0.65rem] text-gray-500">
                        Coming soon
                      </span>
                    )}
                    {paymentType === type.id && !type.disabled && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <FiCheck className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Field */}
            <div>
              <label
                htmlFor="amount"
                className="block text-[0.8rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Amount (KES)
              </label>
              {paymentType === "dues" ? (
                <input
                  type="number"
                  id="amount"
                  value={unionDuesAmount}
                  onChange={(e) => setUnionDuesAmount(Number(e.target.value))}
                  min="1"
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-md shadow-sm dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              ) : (
                <input
                  type="text"
                  id="amount"
                  value={getCurrentAmount().toLocaleString()}
                  disabled
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              )}
              {paymentType === "dues" && (
                <p className="mt-1 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
                  Monthly union membership fee is KES 500, you can pay for
                  multiple months.
                </p>
              )}
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
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 text-sm sm:text-base rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  autoComplete="tel"
                />
              </div>
              {errorMessage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              )}
              <p className="mt-1 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
                Enter your phone number in the format 07XXXXXXXX or
                +2547XXXXXXXX
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !phoneNumber ||
                !getCurrentAmount() ||
                paymentType === "loan"
              }
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white ${
                paymentType === "dues"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200`}
            >
              Pay {getPaymentTypeTitle()}
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
              Processing Payment Request
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
              Please wait while we initiate your payment of KES{" "}
              {getCurrentAmount().toLocaleString()} for {getPaymentTypeTitle()}{" "}
              via M-Pesa.
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
              Payment In Progress
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
              An M-Pesa prompt has been sent to your phone ({phoneNumber}).
            </p>
            <p className="mt-2 text-[0.7rem] sm:text-sm text-gray-500 dark:text-gray-400 text-center">
              Please enter your M-Pesa PIN when prompted to complete the payment
              of KES {getCurrentAmount().toLocaleString()} for{" "}
              {getPaymentTypeTitle()}.
            </p>
            <p className="mt-4 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
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
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
              Your payment of KES {getCurrentAmount().toLocaleString()} for{" "}
              {getPaymentTypeTitle()} has been processed successfully.
            </p>
            {mpesaReceiptNumber && (
              <p className="mt-2 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 text-center">
                M-Pesa Receipt: {mpesaReceiptNumber}
              </p>
            )}
            <p className="mt-4 text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default MakePayment;
