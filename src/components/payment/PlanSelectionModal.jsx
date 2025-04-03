import { useState, useEffect } from "react";
import {
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiLoader,
  FiPhone,
  FiInfo,
} from "react-icons/fi";
import { TbCoins, TbShieldCheckFilled } from "react-icons/tb";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { PiWarningDuotone } from "react-icons/pi";
import {
  initiateM_PesaPayment,
  checkPaymentStatus,
} from "../../services/paymentService";
import insuranceService from "../../services/insuranceService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PlanDetailsModal from "./PlanDetailsModal";
import ConfirmationModal from "../common/ConfirmationModal";

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
  const [showMembershipRequiredModal, setShowMembershipRequiredModal] = useState(false);

  // New state for payment tracking
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [mpesaReceiptNumber, setMpesaReceiptNumber] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isMembershipActive = user && user.membershipStatus === 'active';

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

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedPlan(null);
      setSelectedFrequency("daily");
      setPhoneNumber("");
      setPaymentStatus("idle");
      setErrorMessage("");
      setActiveTab(0);
    }
  }, [isOpen]);

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
      setShowMembershipRequiredModal(true);
      return;
    }
    setSelectedPlan(plan);
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
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={handleClose}
            aria-hidden="true"
          ></div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block w-full sm:max-w-3xl md:max-w-4xl px-5 pt-6 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl dark:bg-gray-800 sm:my-6 sm:align-middle sm:px-10 sm:pb-8">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-gray-400 bg-white rounded-md hover:text-red-500 dark:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Step title */}
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="text-xl font-semibold text-secondary-700 dark:text-secondary-600">
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
            <div className="mb-5 sm:mb-8 px-4 sm:px-8 md:px-14">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center ${i < 3 ? "w-full" : ""}`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step >= i
                          ? "bg-secondary-600 text-white"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {i}
                    </div>
                    {i < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step > i
                            ? "bg-secondary-600"
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
                  transition={{ duration: 0.3 }}
                >
                  {/* Mobile Tabs */}
                  <div className="md:hidden mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={prevTab}
                        disabled={activeTab === 0}
                        className={`p-2 rounded-full ${
                          activeTab === 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-secondary-700 hover:bg-secondary-100"
                        }`}
                      >
                        <FiArrowLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {activeTab + 1} of {plans.length}
                      </span>
                      <button
                        onClick={nextTab}
                        disabled={activeTab === plans.length - 1}
                        className={`p-2 rounded-full ${
                          activeTab === plans.length - 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-secondary-700 hover:bg-secondary-100"
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
                              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                                selectedPlan?.id === plan.id
                                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                              }`}
                              onClick={() => handleSelectPlan(plan)}
                            >
                              {selectedPlan?.id === plan.id && (
                                <div className="absolute top-4 right-4">
                                  <TbShieldCheckFilled className="h-7 w-7 text-primary-500" />
                                </div>
                              )}
                              <h3 className="text-xl font-bold text-secondary-700 dark:text-white mb-2">
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
                                      <span className="font-semibold text-primary-600 dark:text-primary-500">
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
                                      className="text-xs flex items-center text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors duration-200"
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
                                    className="block w-1/2 pl-3 pr-10 py-2 font-semibold text-gray-600 dark:text-gray-300 border border-gray-400 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm dark:bg-gray-700"
                                    value={selectedFrequency}
                                    onChange={(e) =>
                                      setSelectedFrequency(e.target.value)
                                    }
                                  >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="annual">Annual</option>
                                  </select>
                                  <span className="text-xl font-bold text-secondary-700 dark:text-secondary-500">
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
                        className={`p-2 rounded-full ${
                          activeTab === 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-secondary-700 hover:bg-secondary-100"
                        }`}
                      >
                        <FiArrowLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.floor(activeTab / 2) + 1} of{" "}
                        {Math.ceil(plans.length / 2)}
                      </span>
                      <button
                        onClick={nextTab}
                        disabled={activeTab >= plans.length - 2}
                        className={`p-2 rounded-full ${
                          activeTab >= plans.length - 2
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-secondary-700 hover:bg-secondary-100"
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
                              className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                                selectedPlan?.id === plan.id
                                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                              }`}
                              onClick={() => handleSelectPlan(plan)}
                            >
                              {selectedPlan?.id === plan.id && (
                                <div className="absolute top-4 right-4">
                                  <TbShieldCheckFilled className="h-8 w-8 text-primary-500" />
                                </div>
                              )}
                              <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
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
                                      <span className="font-semibold text-primary-600 dark:text-primary-500">
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
                                      className="text-xs flex items-center text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors duration-200"
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
                                    className="block w-1/2 pl-3 pr-10 py-2 font-semibold text-gray-600 dark:text-gray-300 border border-gray-400 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm dark:bg-gray-700"
                                    value={selectedFrequency}
                                    onChange={(e) =>
                                      setSelectedFrequency(e.target.value)
                                    }
                                  >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="annual">Annual</option>
                                  </select>
                                  <span className="text-2xl font-bold text-secondary-700 dark:text-secondary-500">
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

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedPlan}
                      className={`inline-flex items-center px-7 py-2 border border-transparent rounded-lg shadow-sm text-sm md:text-base font-medium text-white ${
                        selectedPlan
                          ? "bg-secondary-700 hover:bg-secondary-800"
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
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-primary-50 dark:bg-primary-900/10 px-4 py-4 rounded-xl border border-primary-300 dark:border-primary-800 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <MdOutlineHealthAndSafety className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedPlan.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
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

                  <div className="space-y-4">
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
                          className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-secondary-600 focus:border-secondary-600 dark:bg-gray-700 dark:text-white"
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
                      className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-secondary-500"
                    >
                      <FiArrowLeft className="mr-2 -ml-1 h-5 w-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleInitiatePayment}
                      disabled={!phoneNumber || isSubmitting}
                      className={`inline-flex items-center px-6 py-2 sm:py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        phoneNumber && !isSubmitting
                          ? "bg-secondary-600 hover:bg-secondary-700"
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
                  transition={{ duration: 0.3 }}
                  className="text-center py-4"
                >
                  {paymentStatus === "processing" && (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <FiLoader className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
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
                    </div>
                  )}

                  {paymentStatus === "waiting" && (
                    <div className="flex flex-col items-center">
                      <div className="sm:w-20 sm:h-20 w-16 h-16 mb-2 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <FiLoader className="h-8 w-8 text-yellow-600 dark:text-yellow-400 animate-spin" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Payment In Progress
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                        An M-Pesa prompt has been sent to your phone (
                        {phoneNumber}).
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Please enter your M-Pesa PIN when prompted to complete
                        the payment of KES{" "}
                        <span className="font-semibold">
                          {getFrequencyAmount(
                            selectedPlan,
                            selectedFrequency
                          )?.toLocaleString() || "N/A"}
                        </span>
                        .
                      </p>
                      <p className="text-[0.7rem] sm:text-xs text-gray-500 dark:text-gray-400">
                        Waiting for confirmation... This may take a few moments.
                      </p>
                    </div>
                  )}

                  {paymentStatus === "timeout" && (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <PiWarningDuotone className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">
                        Payment Status Unknown
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                        We didn't receive confirmation for your payment request.
                        If you completed the payment on your phone, it may still
                        be processing.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                        You can check your payment history later to confirm if
                        it was successful.
                      </p>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={handleTryAgain}
                          className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-600"
                        >
                          Try Again
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex items-center px-7 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentStatus === "success" && (
                    <div className="flex flex-col items-center">
                      <div className="sm:w-20 sm:h-20 w-16 h-16 mb-2 flex items-center justify-center rounded-full bg-green-200 dark:bg-green-600/40">
                        <TbShieldCheckFilled className="h-8 sm:h-10 w-8 sm:w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl font-semibold mb-2">
                        Payment Successful!
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Your health insurance plan has been activated
                        successfully.
                      </p>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 my-3">
                        <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300">
                          Amount: KES{" "}
                          <span className="font-semibold">
                            {getFrequencyAmount(
                              selectedPlan,
                              selectedFrequency
                            )?.toLocaleString() || "N/A"}
                          </span>
                        </p>
                        {mpesaReceiptNumber && (
                          <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300">
                            M-Pesa Receipt: {mpesaReceiptNumber}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onClose()}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm  font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-1 focus:ring-secondary-600"
                      >
                        <TbCoins className="mr-2 h-5 w-5" />
                        View Payment History
                      </button>
                    </div>
                  )}

                  {paymentStatus === "error" && (
                    <div className="flex flex-col items-center">
                      <div className="sm:w-20 sm:h-20 w-16 h-16 mb-2 flex items-center justify-center rounded-full bg-red-200 dark:bg-red-500/40">
                        <PiWarningDuotone className="h-8 sm:h-10 w-8 sm:w-10 text-red-600 dark:text-red-400" />
                      </div>
                      <p className="text-red-600 dark:text-red-400 text-lg sm:text-xl font-semibold mb-2">
                        Payment Failed
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4">
                        {errorMessage}
                      </p>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={handleTryAgain}
                          className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Try Again
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex items-center px-7 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Membership Required Modal */}
      <ConfirmationModal
        isOpen={showMembershipRequiredModal}
        onClose={() => setShowMembershipRequiredModal(false)}
        onConfirm={() => {
          setShowMembershipRequiredModal(false);
          onClose();
          // Navigate to payments page with union tab active
          navigate('/payments?tab=union');
        }}
        title="Membership Required"
        message="You need to complete your union membership registration before subscribing to a medical plan. Would you like to complete your registration now?"
        confirmText="Complete Registration"
        cancelText="Not Now"
        confirmButtonClass="bg-secondary-600 hover:bg-secondary-700"
        icon={<PiWarningDuotone className="h-8 w-8 text-secondary-600" />}
      />
    </>
  );
};

export default PlanSelectionModal;
