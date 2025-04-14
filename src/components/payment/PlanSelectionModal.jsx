import { useState, useEffect } from "react";
import {
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiLoader,
  FiPhone,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
import { TbCoins, TbShieldCheckFilled, TbExchange } from "react-icons/tb";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { PiWarningDuotone, PiUserCircleFill } from "react-icons/pi";
import {
  initiateM_PesaPayment,
  checkPaymentStatus,
} from "../../services/paymentService";
import insuranceService from "../../services/insuranceService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PlanDetailsModal from "./PlanDetailsModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { getUserSubscription } from "../../services/subscriptionService";

const PlanSelectionModal = ({ isOpen, onClose, onPlanSelected }) => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, waiting, success, error, timeout
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState(null);
  const [showMembershipRequiredModal, setShowMembershipRequiredModal] =
    useState(false);
  const [existingSubscription, setExistingSubscription] = useState(null);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState(false);

  // New state for payment tracking
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [mpesaReceiptNumber, setMpesaReceiptNumber] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isMembershipActive = user && user.membershipStatus === "active";

  // Function to get premium amount based on frequency
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

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await insuranceService.getInsurancePlans();
        if (response.success) {
          // Sort plans by name before setting them
          const sortedPlans = [...(response.data || [])].sort((a, b) => {
            // Function to extract the M+number part from the plan name
            const extractPlanNumber = (name) => {
              if (!name) return -1;

              // Handle "Lite (M)" special case - should be first
              if (name.toLowerCase().includes("lite")) return -1;

              // Extract M+n pattern
              const match = name.match(/M\+(\d+)/i);
              if (match && match[1]) {
                return parseInt(match[1], 10);
              }
              return 999; // Any other format goes to the end
            };

            return extractPlanNumber(a.name) - extractPlanNumber(b.name);
          });

          setPlans(sortedPlans);
        } else {
          throw new Error(response.message || "Failed to fetch plans");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setErrorMessage(
          "Failed to load insurance plans. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;

      // Add styles to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Reset state when modal is opened and check for existing subscriptions
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedPlan(null);
      setSelectedFrequency("daily");
      setPhoneNumber("");
      setPaymentStatus("idle");
      setErrorMessage("");
      setActiveTab(0);

      // Check if user already has an active subscription
      if (user && user.id) {
        checkExistingSubscription();
      }
    }
  }, [isOpen, user]);

  // Function to check if user already has an active subscription
  const checkExistingSubscription = async () => {
    try {
      setLoading(true);
      const response = await getUserSubscription(user.id);

      if (response && response.success && response.data && response.data.id) {
        // User has an existing subscription
        setExistingSubscription({
          id: response.data.id,
          plan: response.data.plan,
          frequency:
            response.data.frequency ||
            response.data.paymentFrequency ||
            "daily",
          status: response.data.status,
        });
      } else {
        setExistingSubscription(null);
      }
    } catch (error) {
      console.error("Error checking existing subscription:", error);
      setExistingSubscription(null);
    } finally {
      setLoading(false);
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

  const handleSelectPlan = (plan) => {
    // Check if user has active membership status
    if (!isMembershipActive) {
      // Close the plan selection modal first, then show the membership required modal
      onClose();
      setTimeout(() => {
        setShowMembershipRequiredModal(true);
      }, 100);
      return;
    }

    // Check if user has an existing subscription
    if (existingSubscription && existingSubscription.id) {
      setSelectedPlan(plan);
      setShowCancelSubscriptionModal(true);
      return;
    }
    setSelectedPlan(plan);
    setStep(2);
  };

  // Handle confirmation to cancel existing subscription and proceed with new plan
  const handleConfirmCancelSubscription = () => {
    setShowCancelSubscriptionModal(false);
    setStep(2); // Proceed to frequency selection
  };

  // Handle rejection of cancellation
  const handleRejectCancelSubscription = () => {
    setShowCancelSubscriptionModal(false);
    setSelectedPlan(null);
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedPlan) {
      return; // Don't proceed if no plan is selected
    }

    if (step === 2 && !phoneNumber) {
      return; // Don't proceed if phone number is empty
    }

    if (step === 2) {
      // If moving from step 2 to 3, initiate payment
      handleInitiatePayment();
      return;
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

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

            // Subscribe to the plan
            try {
              // Ensure we have all required data
              if (!user?.id && !localStorage.getItem("userId")) {
                console.error("No user ID available for subscription");
                throw new Error(
                  "User authentication required for subscription"
                );
              }

              if (!selectedPlan?.id) {
                console.error("No plan ID available for subscription");
                throw new Error("Plan selection required for subscription");
              }

              // Prepare subscription data with consistent structure
              const subscriptionData = {
                userId: user?.id || localStorage.getItem("userId"),
                planId: selectedPlan.id,
                paymentFrequency: selectedFrequency,
                startDate: new Date().toISOString(),
                // Add payment reference for tracking
                paymentReference: response.data.mpesaReceiptNumber || paymentId,
              };

              // Save to localStorage first as a fallback
              const localStorageData = {
                plan: selectedPlan,
                frequency: selectedFrequency,
                startDate: new Date().toISOString(),
                paymentReference: response.data.mpesaReceiptNumber || paymentId,
              };

              localStorage.setItem(
                "userSubscription",
                JSON.stringify(localStorageData)
              );

              // Now try to save to the server
              const subscriptionResponse =
                await insuranceService.subscribeToPlan(subscriptionData);

              if (subscriptionResponse && subscriptionResponse.success) {
                console.log("Subscription successfully saved to server");

                // If the server returns updated subscription data, update localStorage
                if (subscriptionResponse.data) {
                  const updatedLocalData = {
                    ...localStorageData,
                    id: subscriptionResponse.data.id,
                    // Add any other server-provided data
                    nextPaymentDate: subscriptionResponse.data.nextPaymentDate,
                  };

                  localStorage.setItem(
                    "userSubscription",
                    JSON.stringify(updatedLocalData)
                  );
                }

                // Update the user's plan in the parent component
                onPlanSelected(selectedPlan, selectedFrequency);
              } else {
                console.error(
                  "Subscription response error:",
                  subscriptionResponse
                );

                // Log the error but don't show it to the user since payment was successful
                // and we've already saved to localStorage
                console.warn(
                  "Payment successful but subscription may not have been saved on server:",
                  subscriptionResponse?.message || "Unknown error"
                );

                // Still update the parent component since we have localStorage data
                onPlanSelected(selectedPlan, selectedFrequency);
              }
            } catch (error) {
              console.error("Error subscribing to plan:", error);

              // Even if there's an error, we still have the localStorage data
              // so the user can see their plan in the UI
              onPlanSelected(selectedPlan, selectedFrequency);

              // Show a warning to the user that they may need to contact support
              setErrorMessage(
                "Payment successful but there may be an issue with your subscription. If you don't see your plan, please contact support."
              );
            }
          } else if (status === "failed") {
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

  const handleInitiatePayment = async () => {
    if (!phoneNumber) return;

    setIsSubmitting(true);
    setPaymentStatus("processing");
    setStep(3); // Move to step 3 immediately when processing starts

    try {
      // Format phone number to ensure it starts with 254 (Kenya)
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith("0")) {
        formattedPhone = `254${phoneNumber.substring(1)}`;
      } else if (phoneNumber.startsWith("+")) {
        formattedPhone = phoneNumber.substring(1);
      }

      // Use real payment service
      const response = await initiateM_PesaPayment({
        amount: 1,
        //TODO: uncomment this when ready for production
        // process.env.NODE_ENV === "production"
        //   ? getFrequencyAmount(selectedPlan, selectedFrequency)
        //   : 1, // Use 1 KES for testing
        phoneNumber: formattedPhone,
        description: `Payment for ${selectedPlan.name} (${selectedFrequency}) medical cover`,
        paymentType: "medical",
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

        // Set timeout to change status to "timeout" after 90 seconds if no update
        setTimeout(() => {
          setPaymentStatus((currentStatus) => {
            if (currentStatus === "waiting") {
              // If still waiting after 120 seconds - 2 minutes, show timeout message
              if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
                setStatusCheckInterval(null);
              }
              return "timeout";
            }
            return currentStatus;
          });
        }, 120000);
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

  const handleTryAgain = () => {
    setPaymentStatus("idle");
    setErrorMessage("");
    setStep(2); // Go back to the payment details step
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  const handleClose = () => {
    // If payment was successful, refresh the parent component
    if (paymentStatus === "success") {
      onClose(true); // Pass true to indicate successful payment
    } else {
      onClose(false);
    }
  };

  // Handle tab navigation for mobile
  const nextTab = () => {
    if (activeTab < plans.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {showDetailsModal && (
        <PlanDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          plan={selectedPlanForDetails}
        />
      )}
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-80 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          ></div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block w-full sm:max-w-3xl md:max-w-4xl px-5 pt-6 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl dark:bg-gray-800 sm:my-6 sm:align-middle sm:px-10 sm:pb-8 border border-gray-200 dark:border-gray-700">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-gray-400 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Step title */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {step === 1 && "Select Your Health Cover Plan"}
                {step === 2 && "Payment Details"}
                {step === 3 && (
                  <>
                    {paymentStatus === "processing" && "Processing Payment"}
                    {paymentStatus === "success" && "Payment Successful!"}
                    {paymentStatus === "error" && "Payment Failed"}
                  </>
                )}
              </h3>
            </div>

            {/* Step indicator */}
            <div className="mb-6 sm:mb-8 px-4 sm:px-8 md:px-14">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center ${i < 3 ? "w-full" : ""}`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all duration-300 ${
                        step > i
                          ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                          : step === i
                          ? "bg-primary-600 text-white ring-2 ring-primary-200 dark:ring-primary-900"
                          : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                      }`}
                    >
                      {i}
                    </div>
                    {i < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                          step > i
                            ? "bg-gradient-to-r from-primary-600 to-primary-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Select Plan
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Payment Details
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Confirmation
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Plan Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Mobile Tabs */}
                  <div className="md:hidden mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={prevTab}
                        disabled={activeTab === 0}
                        className={`p-2 rounded-full shadow-sm transition-all duration-200 ${
                          activeTab === 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-primary-600 hover:bg-primary-50 hover:shadow"
                        }`}
                      >
                        <FiArrowLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {activeTab + 1} of {plans.length}
                      </span>
                      <button
                        onClick={nextTab}
                        disabled={activeTab === plans.length - 1}
                        className={`p-2 rounded-full shadow-sm transition-all duration-200 ${
                          activeTab === plans.length - 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-primary-600 hover:bg-primary-50 hover:shadow"
                        }`}
                      >
                        <FiArrowRight className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                          transform: `translateX(-${activeTab * 100}%)`,
                        }}
                      >
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            className="w-full flex-shrink-0 px-1"
                          >
                            <div
                              className={`relative p-5 rounded-xl border transition-all duration-200 shadow-md hover:shadow-lg ${
                                selectedPlan?.id === plan.id
                                  ? "border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/10"
                                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300 bg-white dark:bg-gray-800"
                              }`}
                              onClick={() => handleSelectPlan(plan)}
                            >
                              {selectedPlan?.id === plan.id && (
                                <div className="absolute top-4 right-4">
                                  <TbShieldCheckFilled className="h-7 w-7 text-primary-500" />
                                </div>
                              )}
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                {plan.name}
                              </h3>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                                {plan.description}
                              </p>
                              <div className="space-y-3 mb-6">
                                {plan.metadata?.benefits
                                  ?.slice(0, 7)
                                  .map((benefit, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {benefit.name}
                                      </span>
                                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                                        {benefit.limit}
                                      </span>
                                    </div>
                                  ))}
                                {plan.metadata?.benefits?.length > 7 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-primary-600 dark:text-primary-400 mb-2">
                                      +{plan.metadata.benefits.length - 7} more
                                      benefits
                                    </p>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlanForDetails(plan);
                                        setShowDetailsModal(true);
                                      }}
                                      className="text-xs flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md shadow-sm"
                                    >
                                      <FiInfo className="mr-1" /> View full
                                      details
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                  <select
                                    className="block w-1/2 pl-3 pr-10 py-2 font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm dark:bg-gray-700 shadow-sm"
                                    value={selectedFrequency}
                                    onChange={(e) =>
                                      setSelectedFrequency(e.target.value)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="annual">Annual</option>
                                  </select>
                                  <span className="text-xl font-bold text-primary-700 dark:text-primary-400">
                                    KES{" "}
                                    {getFrequencyAmount(
                                      plan,
                                      selectedFrequency
                                    )?.toLocaleString() || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:block">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={prevTab}
                        disabled={activeTab === 0}
                        className={`p-2 rounded-full shadow-sm transition-all duration-200 ${
                          activeTab === 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-primary-600 hover:bg-primary-50 hover:shadow"
                        }`}
                      >
                        <FiArrowLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {Math.floor(activeTab / 2) + 1} of{" "}
                        {Math.ceil(plans.length / 2)}
                      </span>
                      <button
                        onClick={nextTab}
                        disabled={activeTab >= plans.length - 2}
                        className={`p-2 rounded-full shadow-sm transition-all duration-200 ${
                          activeTab >= plans.length - 2
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-primary-600 hover:bg-primary-50 hover:shadow"
                        }`}
                      >
                        <FiArrowRight className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                          transform: `translateX(-${activeTab * 50}%)`,
                        }}
                      >
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            className="w-1/2 flex-shrink-0 px-2"
                          >
                            <div
                              className={`relative p-5 rounded-xl border transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                                selectedPlan?.id === plan.id
                                  ? "border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/10"
                                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300 bg-white dark:bg-gray-800"
                              }`}
                              onClick={() => handleSelectPlan(plan)}
                            >
                              {selectedPlan?.id === plan.id && (
                                <div className="absolute top-4 right-4">
                                  <TbShieldCheckFilled className="h-8 w-8 text-primary-500" />
                                </div>
                              )}
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                {plan.name}
                              </h3>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                                {plan.description}
                              </p>
                              <div className="space-y-3 mb-6">
                                {plan.metadata?.benefits
                                  ?.slice(0, 7)
                                  .map((benefit, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {benefit.name}
                                      </span>
                                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                                        {benefit.limit}
                                      </span>
                                    </div>
                                  ))}
                                {plan.metadata?.benefits?.length > 7 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-primary-600 dark:text-primary-400 mb-2">
                                      +{plan.metadata.benefits.length - 7} more
                                      benefits
                                    </p>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlanForDetails(plan);
                                        setShowDetailsModal(true);
                                      }}
                                      className="text-xs flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md shadow-sm"
                                    >
                                      <FiInfo className="mr-1" /> View full
                                      details
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                  <select
                                    className="block w-1/2 pl-3 pr-10 py-2 font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm dark:bg-gray-700 shadow-sm"
                                    value={selectedFrequency}
                                    onChange={(e) =>
                                      setSelectedFrequency(e.target.value)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="annual">Annual</option>
                                  </select>
                                  <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                                    KES{" "}
                                    {getFrequencyAmount(
                                      plan,
                                      selectedFrequency
                                    )?.toLocaleString() || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedPlan}
                      className={`inline-flex items-center px-7 py-3 border border-transparent rounded-xl shadow-md text-sm md:text-base font-medium text-white transition-all duration-200 ${
                        selectedPlan
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg transform hover:-translate-y-0.5"
                          : "bg-gray-300 cursor-not-allowed"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                    >
                      Continue
                      <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/20 px-6 py-5 rounded-xl border border-primary-200 dark:border-primary-800/50 mb-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-white/80 dark:bg-gray-800 p-2.5 rounded-lg shadow-sm mr-3">
                          <MdOutlineHealthAndSafety className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                            {selectedPlan.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getFrequencyAmount(selectedPlan, selectedFrequency)
                              ? `KES ${getFrequencyAmount(
                                  selectedPlan,
                                  selectedFrequency
                                ).toLocaleString()} / ${selectedFrequency}`
                              : "Not available for this frequency"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
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
                        value={
                          getFrequencyAmount(
                            selectedPlan,
                            selectedFrequency
                          )?.toLocaleString() || "N/A"
                        }
                        disabled
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                          className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Enter the phone number registered with M-Pesa
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 transition-all duration-200"
                    >
                      <FiArrowLeft className="mr-2 -ml-1 h-5 w-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleInitiatePayment}
                      disabled={!phoneNumber || isSubmitting}
                      className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-medium text-white transition-all duration-200 ${
                        phoneNumber && !isSubmitting
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg transform hover:-translate-y-0.5"
                          : "bg-gray-300 cursor-not-allowed"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin mr-2 -ml-1 h-5 w-5" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay with M-Pesa
                          <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center py-8"
                >
                  {paymentStatus === "processing" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/20 shadow-md">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 relative">
                          <div className="absolute inset-0 rounded-full border-t-3 border-primary-500 animate-spin"></div>
                          <FiLoader className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Processing Payment Request
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4">
                        Please wait while we process your payment of KES{" "}
                        <span className="font-semibold">
                          {getFrequencyAmount(
                            selectedPlan,
                            selectedFrequency
                          )?.toLocaleString() || "N/A"}
                        </span>{" "}
                        via M-Pesa...
                      </p>
                    </motion.div>
                  )}

                  {paymentStatus === "waiting" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="sm:w-24 sm:h-24 w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/20 shadow-md">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 relative">
                          <div className="absolute inset-0 rounded-full border-t-3 border-yellow-500 animate-spin"></div>
                          <FiLoader className="h-8 w-8 text-yellow-600 dark:text-yellow-400 animate-spin" />
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Payment In Progress
                      </h3>
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/10 px-6 py-4 rounded-xl border border-yellow-200 dark:border-yellow-800/50 mb-4 shadow-md max-w-md">
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">
                          An M-Pesa prompt has been sent to your phone:
                        </p>
                        <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
                          {phoneNumber}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Please enter your M-Pesa PIN when prompted to complete
                          the payment of KES{" "}
                          <span className="font-semibold">
                            {getFrequencyAmount(
                              selectedPlan,
                              selectedFrequency
                            )?.toLocaleString() || "N/A"}
                          </span>
                        </p>
                      </div>
                      <p className="text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
                        Waiting for confirmation... This may take a few moments.
                      </p>
                    </motion.div>
                  )}

                  {paymentStatus === "timeout" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20 shadow-md">
                        <PiWarningDuotone className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">
                        Payment Status Unknown
                      </h3>
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 px-6 py-4 rounded-xl border border-orange-200 dark:border-orange-800/50 mb-4 shadow-md max-w-md">
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center mb-2">
                          We didn't receive confirmation for your payment
                          request. If you completed the payment on your phone,
                          it may still be processing.
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                          You can check your payment history later to confirm if
                          it was successful.
                        </p>
                      </div>
                      <div className="flex space-x-4 mt-4">
                        <button
                          type="button"
                          onClick={handleTryAgain}
                          className="inline-flex items-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          Try Again
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {paymentStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="sm:w-24 sm:h-24 w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 shadow-md">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-white dark:bg-gray-800">
                          <TbShieldCheckFilled className="h-10 sm:h-12 w-10 sm:w-12 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-xl sm:text-2xl font-semibold mb-2">
                        Payment Successful!
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Your health insurance plan has been activated
                        successfully.
                      </p>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 px-6 py-4 rounded-xl border border-green-200 dark:border-green-800/50 my-4 shadow-md max-w-md">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Amount:
                          <span className="text-green-700 dark:text-green-400 font-semibold ml-2">
                            KES{" "}
                            {getFrequencyAmount(
                              selectedPlan,
                              selectedFrequency
                            )?.toLocaleString() || "N/A"}
                          </span>
                        </p>
                        {mpesaReceiptNumber && (
                          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            M-Pesa Receipt:
                            <span className="text-green-700 dark:text-green-400 font-semibold ml-2">
                              {mpesaReceiptNumber}
                            </span>
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onClose()}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg transition-all duration-200"
                      >
                        <TbCoins className="mr-2 h-5 w-5" />
                        View Payment History
                      </button>
                    </motion.div>
                  )}

                  {paymentStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="sm:w-24 sm:h-24 w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10 shadow-md">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-white dark:bg-gray-800">
                          <PiWarningDuotone className="h-10 sm:h-12 w-10 sm:w-12 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-lg sm:text-xl font-semibold mb-2">
                        Payment Failed
                      </p>
                      <div className="bg-gradient-to-r from-red-50 to-red-50/70 dark:from-red-900/20 dark:to-red-900/10 px-6 py-4 rounded-xl border border-red-200 dark:border-red-800/50 mb-4 shadow-md max-w-md">
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          {errorMessage}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={handleTryAgain}
                          className="inline-flex items-center px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          Try Again
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Existing Subscription */}
      <ConfirmationModal
        isOpen={showCancelSubscriptionModal}
        onClose={handleRejectCancelSubscription}
        onConfirm={handleConfirmCancelSubscription}
        title="Change Subscription Plan"
        message={
          existingSubscription ? (
            <>
              <p className="mb-3">
                You already have an active subscription to the{" "}
                <strong>{existingSubscription.plan?.name || "current"}</strong>{" "}
                plan.
              </p>
              <p className="mb-3">
                Selecting a new plan will cancel your current subscription. You
                will need to make a payment for the new plan.
              </p>
              <p>
                Do you want to proceed with changing your subscription plan?
              </p>
            </>
          ) : (
            "Do you want to change your subscription plan?"
          )
        }
        confirmText="Yes, Change Plan"
        cancelText="Keep Current Plan"
        type="confirmation"
        icon={<TbExchange className="h-8 w-8 text-amber-600" />}
      />
    </>
  );
};

export const MembershipRequiredModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={
        <div className="flex items-center text-amber-600 dark:text-amber-400">
          <span className="text-lg font-bold">Union Membership Required!</span>
        </div>
      }
      message={
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-amber-100 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            You need to complete your union membership registration before
            subscribing to a medical plan.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Would you like to complete your registration now?
          </p>
        </div>
      }
      confirmText={
        <span className="flex items-center">
          <PiUserCircleFill className="mr-2 h-5 w-5" />
          Complete Registration
        </span>
      }
      cancelText="Not Now"
      confirmButtonClass="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg"
      cancelButtonClass="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow transition-all duration-200 rounded-lg"
      icon={
          <PiWarningDuotone className="h-8 w-8 text-amber-600 dark:text-amber-400 animate-pulse" />
       
      }
      containerClass="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      headerClass="p-6 bg-gradient-to-r from-amber-50 to-amber-50/40 dark:from-gray-800 dark:to-gray-700"
      bodyClass="p-6"
      footerClass="px-6 py-4 bg-gray-50 dark:bg-gray-800 "
    />
  );
};
export default PlanSelectionModal;
