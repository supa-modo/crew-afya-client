import { useState, useEffect } from "react";
import { TbCreditCardFilled, TbShieldHalfFilled } from "react-icons/tb";
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

// Import our refactored components
import PaymentForm from "./PaymentForm";
import PaymentStatus from "./PaymentStatus";
import PaymentTypeSelector from "./PaymentTypeSelector";
import { RiCommunityLine, RiUserCommunityLine } from "react-icons/ri";

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
  const [isRecovering, setIsRecovering] = useState(false);

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

  // Check for pending payments on component mount
  useEffect(() => {
    const checkForPendingPayments = async () => {
      try {
        setIsRecovering(true);
        const recoveryResult = await recoverPaymentProcess();

        if (recoveryResult && recoveryResult.recovered) {
          // We have recovered a payment, update the UI accordingly
          setPaymentId(recoveryResult.paymentId);
          setCheckoutRequestId(recoveryResult.checkoutRequestId);

          // Set the appropriate status based on the recovered payment
          if (recoveryResult.status === "completed") {
            setPaymentStatus("success");
            setMpesaReceiptNumber(recoveryResult.data.mpesaReceiptNumber);

            // Notify parent component if payment was successful
            if (typeof onPaymentComplete === "function") {
              setTimeout(() => onPaymentComplete(true), 1000);
            }
          } else if (recoveryResult.status === "failed") {
            setPaymentStatus("error");
            setErrorMessage(
              recoveryResult.data.failureReason ||
                "Payment failed. Please try again."
            );
          } else {
            // Payment is still pending, restart status check
            setPaymentStatus("waiting");
            startStatusCheck(recoveryResult.paymentId);
          }
        } else if (
          recoveryResult &&
          !recoveryResult.recovered &&
          recoveryResult.pendingPayment
        ) {
          // We have a pending payment but couldn't get its status
          // Try to extract phone number and other details
          if (recoveryResult.pendingPayment.payload) {
            setPhoneNumber(
              recoveryResult.pendingPayment.payload.phoneNumber || ""
            );
          }

          // If the payment was in error state, show error
          if (recoveryResult.pendingPayment.status === "error") {
            setPaymentStatus("error");
            setErrorMessage(
              recoveryResult.pendingPayment.error ||
                "Payment process was interrupted. Please try again."
            );
          } else {
            // Otherwise, let the user try again
            setPaymentStatus("idle");
            setErrorMessage(
              "We found an incomplete payment. Please try again."
            );
          }
        }
      } catch (error) {
        console.error("Error recovering payment:", error);
      } finally {
        setIsRecovering(false);
      }
    };

    checkForPendingPayments();
  }, [onPaymentComplete]);

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
      label: "Union Membership",
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
            setPaymentStatus("success");
            setMpesaReceiptNumber(response.data.mpesaReceiptNumber);
            clearInterval(interval);
            setStatusCheckInterval(null);

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
      // Determine payment amount based on payment type
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

      if (!amount || isNaN(Number(amount))) {
        throw new Error(
          "Invalid payment amount. Please select a valid payment type."
        );
      }

      console.log(`Initiating payment for ${paymentType}: ${amount} KES`); // Debug log

      // Use the enhanced payment service to initiate M-Pesa payment
      const response = await initiateM_PesaPayment({
        //TODO: uncomment in production to use the actual amount
        // amount: Number(amount),
        amount: 1, // Using 1 KES for testing
        phoneNumber,
        description: description,
        paymentType: paymentType, // Add payment type to track in backend
      });

      console.log("Payment response:", response); // Debugging

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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, onPaymentComplete]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg px-2 sm:px-8 pb-2">
      <h3 className="text-base sm:text-lg font-semibold text-secondary-700 dark:text-white mb-2">
        Make a Payment
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
        {fixedPaymentType
          ? `Please enter your M-Pesa number to complete your payment for ${getPaymentTypeTitle()}.`
          : "Select a payment type and enter your M-Pesa phone number to complete your payment."}
      </p>

      <AnimatePresence mode="wait">
        {isRecovering ? (
          <motion.div
            key="recovering"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-4"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Checking for pending payments...
            </p>
          </motion.div>
        ) : paymentStatus === "idle" ? (
          <motion.div
            key="payment-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
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
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MakePayment;
