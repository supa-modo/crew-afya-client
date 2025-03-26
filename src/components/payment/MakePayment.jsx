import { useState, useEffect } from "react";
import { TbCreditCardFilled, TbShieldHalfFilled } from "react-icons/tb";
import { PiUserDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  initiateM_PesaPayment,
  checkPaymentStatus,
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
        amount = selectedPlan?.premiums?.[frequency];
        description = `Payment for ${selectedPlan.name} (${frequency}) medical cover`;
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
              if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
                setStatusCheckInterval(null);
              }
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
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  // Get current amount based on payment type
  const getCurrentAmount = () => {
    if (paymentType === "medical") {
      return selectedPlan?.premiums?.[frequency] || 0;
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
        {paymentStatus === "idle" && (
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
        )}

        {/* Payment Status */}
        {paymentStatus !== "idle" && (
          <PaymentStatus
            status={paymentStatus}
            phoneNumber={phoneNumber}
            getCurrentAmount={getCurrentAmount}
            getPaymentTypeTitle={getPaymentTypeTitle}
            formatCurrency={formatCurrency}
            errorMessage={errorMessage}
            mpesaReceiptNumber={mpesaReceiptNumber}
            handleTryAgain={handleTryAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MakePayment;
