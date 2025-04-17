import { useState, useEffect } from "react";
import {
  TbCreditCardFilled,
  TbShieldHalfFilled,
  TbReceiptOff,
  TbReceipt2,
  TbWallet,
} from "react-icons/tb";
import { PiUserDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  initiateM_PesaPayment,
  checkPaymentStatus,
  getPendingPayment,
  clearPendingPayment,
  recoverPaymentProcess,
  verifyMpesaPayment,
} from "../../services/paymentService";
import { formatCurrency } from "../../utils/formatCurrency";

// Import our refactored components
import PaymentForm from "./PaymentForm";
import PaymentStatus from "./PaymentStatus";
import PaymentTypeSelector from "./PaymentTypeSelector";
import { RiCommunityLine, RiUserCommunityLine } from "react-icons/ri";

// Component for handling phone number input and submission
const PaymentFormContainer = ({
  paymentType,
  phoneNumber,
  setPhoneNumber,
  errorMessage,
  isSubmitting,
  getCurrentAmount,
  getPaymentTypeTitle,
  handleSubmit,
  disabled,
}) => {
  return (
    <motion.div
      key="payment-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <PaymentForm
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        paymentType={paymentType}
        errorMessage={errorMessage}
        getCurrentAmount={getCurrentAmount}
        getPaymentTypeTitle={getPaymentTypeTitle}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        disabled={disabled}
      />
    </motion.div>
  );
};

// Main MakePayment component
const MakePayment = ({
  selectedPlan,
  frequency,
  initialPaymentType = "medical",
  activeTab,
  setActiveTab,
  onPaymentComplete,
  fixedPaymentType = false, // prop to indicate if payment type should be fixed
}) => {
  let [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, waiting, timeout, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [mpesaReceiptNumber, setMpesaReceiptNumber] = useState(null);
  const [paymentType, setPaymentType] = useState(initialPaymentType); // medical, membership, loan
  const [unionDuesAmount, setUnionDuesAmount] = useState(500); // Default amount for union dues
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialPaymentType === "medical"
      ? 0
      : initialPaymentType === "membership"
      ? 1
      : 2
  );

  // Helper function to safely get premium amount based on frequency
  const getFrequencyAmount = (plan, frequency) => {
    if (!plan) return 0;

    // Handle plans with premiums object
    if (plan.premiums && plan.premiums[frequency] !== undefined) {
      return plan.premiums[frequency];
    }

    // Handle plans with individual premium fields (e.g., dailyPremium, monthlyPremium)
    const premiumField = `${frequency}Premium`;
    if (plan[premiumField] !== undefined) {
      return plan[premiumField];
    }

    return 0;
  };

  // Set initial payment type based on parent component's active tab
  useEffect(() => {
    if (!fixedPaymentType) {
      setPaymentType(initialPaymentType);
      setActiveTabIndex(
        initialPaymentType === "medical"
          ? 0
          : initialPaymentType === "membership"
          ? 1
          : 2
      );
    }
  }, [initialPaymentType, fixedPaymentType]);

  // Array of payment types for navigation
  const paymentTypes = [
    {
      id: "medical",
      label: "Medical Cover",
      icon: TbShieldHalfFilled,
      color: "primary",
      disabled: false,
      parentTab: "medical",
    },
    {
      id: "membership",
      label: "Union Membership ",
      icon: RiUserCommunityLine,
      color: "green",
      disabled: false,
      parentTab: "union",
    },
    {
      id: "loan",
      label: "Loan Repayment",
      icon: TbCreditCardFilled,
      color: "gray",
      disabled: true,
      soon: true,
      parentTab: null,
    },
  ];

  // Function to navigate tabs on mobile
  const navigateTab = (direction) => {
    if (fixedPaymentType) return; // Don't allow navigation if payment type is fixed

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
    const newPaymentType = paymentTypes[newIndex].id;
    setPaymentType(newPaymentType);

    // Sync with parent tab if applicable
    const parentTab = paymentTypes[newIndex].parentTab;
    if (parentTab && typeof setActiveTab === "function") {
      setActiveTab(parentTab);
    }
  };

  // Enhanced function to handle payment type change (for desktop)
  const handlePaymentTypeChange = (typeId) => {
    if (fixedPaymentType || !typeId) return; // Don't allow changes if payment type is fixed

    setPaymentType(typeId);

    // Find the index of the selected payment type
    const selectedIndex = paymentTypes.findIndex((type) => type.id === typeId);
    if (selectedIndex !== -1) {
      setActiveTabIndex(selectedIndex);

      // Sync with parent tab if applicable
      const parentTab = paymentTypes[selectedIndex].parentTab;
      if (parentTab && typeof setActiveTab === "function") {
        setActiveTab(parentTab);
      }
    }
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
        console.log("Payment status check response:", response); // Debug log

        if (response && response.success) {
          const status = response.data.status;

          // If payment completed, show success
          if (status === "completed") {
            handlePaymentSuccess(response.data.mpesaReceiptNumber, interval);
          }
          // If payment failed, show error
          else if (status === "failed") {
            handlePaymentFailure(response.data.failureReason, interval);
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

  // Handle successful payment completion
  const handlePaymentSuccess = (receiptNumber, interval = null) => {
    setPaymentStatus("success");
    setMpesaReceiptNumber(receiptNumber);

    if (interval) {
      clearInterval(interval);
      setStatusCheckInterval(null);
    }

    // Call onPaymentComplete callback if provided
    if (typeof onPaymentComplete === "function") {
      setTimeout(() => onPaymentComplete(true), 5000);
    }

    // Reset form after success (with delay)
    setTimeout(() => {
      setPaymentStatus("idle");
      setPhoneNumber("");
      setCheckoutRequestId(null);
      setPaymentId(null);
      setMpesaReceiptNumber(null);
    }, 10000);
  };

  // Handle payment failure
  const handlePaymentFailure = (reason, interval = null) => {
    setPaymentStatus("error");
    setErrorMessage(reason || "Payment was not completed. Please try again.");

    if (interval) {
      clearInterval(interval);
      setStatusCheckInterval(null);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    // Always prevent the default form submission to avoid page reload
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!phoneNumber) {
      setErrorMessage("Please enter your M-Pesa phone number");
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      // Determine payment amount and description
      const paymentDetails = getPaymentDetails();

      if (!paymentDetails.amount || isNaN(Number(paymentDetails.amount))) {
        throw new Error(
          "Invalid payment amount. Please select a valid payment type."
        );
      }

      console.log(
        `Initiating payment for ${paymentType}: ${paymentDetails.amount} KES`
      ); // Debug log

      // Initiate payment
      const response = await initiateM_PesaPayment({
        //TODO: uncomment in production to use the actual amount
        // amount: Number(paymentDetails.amount),
        amount: 1, // Using 1 KES for testing
        phoneNumber,
        description: paymentDetails.description,
        paymentType: paymentType, // Add payment type to track in backend
      });

      console.log("Payment response:", response); // Debugging

      if (response && response.success) {
        handlePaymentInitiated(response);
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

  // Get payment details based on payment type
  const getPaymentDetails = () => {
    let amount, description;

    if (paymentType === "medical") {
      amount = getFrequencyAmount(selectedPlan, frequency);
      description = `Payment for ${
        selectedPlan?.name || "Medical"
      } (${frequency}) medical cover`;
    } else if (paymentType === "membership") {
      amount = unionDuesAmount; // Fixed one-time fee
      description = `Payment for union membership`;
    } else if (paymentType === "loan") {
      // Future implementation for loan repayments
      amount = 0; // This would be replaced with actual loan repayment amount
      description = `Payment for loan repayment`;
    }

    return { amount, description };
  };

  // Handle successful payment initiation
  const handlePaymentInitiated = (response) => {
    // Store checkout request ID and payment ID for status checking
    if (response.data && response.data.payment && response.data.stkResponse) {
      setCheckoutRequestId(response.data.stkResponse.CheckoutRequestID);
      setPaymentId(response.data.payment.id);

      // Start checking status
      startStatusCheck(response.data.payment.id);
    }

    setPaymentStatus("waiting");

    // Set timeout to change status to "timeout" after 60 seconds if no update
    setTimeout(() => {
      setPaymentStatus((currentStatus) => {
        if (currentStatus === "waiting") {
          // If still waiting after 60 seconds, show timeout message
          // But don't clear the interval - keep checking in the background
          return "timeout";
        }
        return currentStatus;
      });
    }, 60000); // 60 seconds timeout
  };

  // Try again handler
  const handleTryAgain = () => {
    setPaymentStatus("idle");
    setErrorMessage("");
    // Don't clear the interval if we're in timeout state - keep checking in the background
    // Only clear if we're in error state
    if (statusCheckInterval && paymentStatus === "error") {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  // Manual verification for timeout cases
  const handleManualVerification = async (transactionCode) => {
    if (!transactionCode) {
      setErrorMessage("Please enter a valid M-Pesa transaction code");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the backend endpoint to verify the transaction
      const result = await verifyMpesaPayment(transactionCode);

      if (result.success) {
        setPaymentStatus("success");
        setMpesaReceiptNumber(transactionCode);

        // Store payment details in localStorage for recovery
        if (result.data && result.data.payment) {
          localStorage.setItem(
            "pendingPayment",
            JSON.stringify({
              id: result.data.payment.id,
              amount: result.data.payment.amount,
              status: result.data.payment.status,
              mpesaReceiptNumber: transactionCode,
              paymentType: paymentType,
              timestamp: new Date().toISOString(),
            })
          );
        }

        // Call onPaymentComplete callback if provided
        if (typeof onPaymentComplete === "function") {
          setTimeout(() => onPaymentComplete(true), 2000);
        }
      } else {
        setErrorMessage(
          result.message || "Could not verify transaction. Please try again."
        );
        setPaymentStatus("error");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setErrorMessage("Could not verify transaction. Please try again.");
      setPaymentStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current amount based on payment type
  const getCurrentAmount = () => {
    if (paymentType === "medical") {
      return getFrequencyAmount(selectedPlan, frequency);
    } else if (paymentType === "membership") {
      return unionDuesAmount; // Fixed one-time fee
    } else {
      return 0; // For future loan implementation
    }
  };

  // Get payment type title
  const getPaymentTypeTitle = () => {
    if (paymentType === "medical") {
      return `${selectedPlan?.name || "Medical"} Cover`;
    } else if (paymentType === "membership") {
      return "Union Membership";
    } else {
      return "Loan Repayment";
    }
  };

  // Update success handlers
  useEffect(() => {
    // If payment was successful and we have a completion callback
    if (
      paymentStatus === "success" &&
      typeof onPaymentComplete === "function"
    ) {
      // Wait a moment to show the success message before calling the callback
      const timer = setTimeout(() => {
        onPaymentComplete(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, onPaymentComplete]);

  const getPaymentTypeAccentColor = () => {
    switch (paymentType) {
      case "medical":
        return "from-primary-100 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/20 border-primary-200 dark:border-primary-800/50";
      case "membership":
        return "from-green-100 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-800/50";
      default:
        return "from-gray-100 to-gray-50 dark:from-gray-900/30 dark:to-gray-900/20 border-gray-200 dark:border-gray-800/50";
    }
  };

  return (
    <div className="">
      {/* Payment summary panel */}
      <div
        className={`bg-gradient-to-r ${getPaymentTypeAccentColor()} px-3 sm:px-5 py-4 mb-4 rounded-xl border shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/80 dark:bg-white/10 p-2 rounded-lg shadow-sm mr-3">
              {paymentType === "medical" ? (
                <TbShieldHalfFilled className="h-5 sm:h-7 w-5 sm:w-7 text-primary-600" />
              ) : paymentType === "membership" ? (
                <RiUserCommunityLine className="h-5 sm:h-7 w-5 sm:w-7 text-green-600" />
              ) : (
                <TbCreditCardFilled className="h-5 sm:h-7 w-5 sm:w-7 text-gray-600" />
              )}
            </div>
            <div>
              <p className="text-[0.8rem] sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {getPaymentTypeTitle()}
              </p>
              <p className="text-sm sm:text-base font-semibold text-secondary-700 dark:text-white">
                {formatCurrency(getCurrentAmount())}
              </p>
            </div>
          </div>
          <div>
            {getCurrentAmount() > 0 ? (
              <div className="flex items-center text-[0.8rem] sm:text-sm">
                <TbReceipt2 className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  {paymentType === "membership"
                    ? "One-time payment"
                    : "Recurring payment"}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-sm">
                <TbReceiptOff className="h-4 w-4 text-amber-600 mr-1" />
                <span className="text-amber-600">No active plan</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pb-5">
        <AnimatePresence mode="wait">
          {paymentStatus === "idle" ? (
            <motion.div
              key="payment-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Payment Type Selector */}
              <PaymentTypeSelector
                paymentTypes={paymentTypes}
                paymentType={paymentType}
                activeTabIndex={activeTabIndex}
                navigateTab={navigateTab}
                handlePaymentTypeChange={handlePaymentTypeChange}
                disabled={fixedPaymentType}
              />

              {/* Payment Form */}
              <PaymentForm
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                paymentType={paymentType}
                errorMessage={errorMessage}
                getCurrentAmount={getCurrentAmount}
                getPaymentTypeTitle={getPaymentTypeTitle}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                disabled={paymentType === "loan"}
              />
            </motion.div>
          ) : (
            <PaymentStatus
              status={paymentStatus}
              phoneNumber={phoneNumber}
              getCurrentAmount={getCurrentAmount}
              getPaymentTypeTitle={getPaymentTypeTitle}
              formatCurrency={formatCurrency}
              errorMessage={errorMessage}
              mpesaReceiptNumber={mpesaReceiptNumber}
              handleTryAgain={handleTryAgain}
              handleManualVerification={handleManualVerification}
              paymentId={paymentId}
              paymentType={paymentType}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MakePayment;
