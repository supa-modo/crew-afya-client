import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbX,
  TbArrowRight,
  TbArrowLeft,
  TbLoader,
  TbPhone,
  TbInfoCircle,
  TbAlertTriangle,
  TbCoins,
  TbShieldCheck,
  TbRefresh,
  TbUsers,
  TbUser,
  TbWallet,
  TbReceipt,
  TbCheck,
} from "react-icons/tb";

import insuranceService from "../../services/insuranceService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "../common/ConfirmationModal";
import {
  saveSubscription,
  getUserSubscription,
} from "../../services/subscriptionService";
import PlanList from "./PlanList";
import PlanPaymentStep from "./PlanPaymentStep";
import MembershipRequiredModal from "./MembershipRequiredModal";
import { PiUserDuotone, PiUsersThreeDuotone } from "react-icons/pi";
import PlanDetailsModal from "./PlanDetailsModal";

// Function to determine the z-index for modals based on type
const getZIndex = (modalType) => {
  const zIndices = {
    selectionModal: 100,
    confirmationModal: 300,
    detailsModal: 200,
    membershipModal: 300,
  };

  return zIndices[modalType] || 100;
};

const PlanSelectionModal = ({ isOpen, onClose, onPlanSelected }) => {
  const [planCategory, setPlanCategory] = useState("individual"); // "individual" or "family"
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState("monthly");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, waiting, success, error, timeout
  const [errorMessage, setErrorMessage] = useState("");
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingSubscription, setExistingSubscription] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showMembershipRequiredModal, setShowMembershipRequiredModal] =
    useState(false);
  const [showPlanDetailsModal, setShowPlanDetailsModal] = useState(false);
  const [planDetailsData, setPlanDetailsData] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isMembershipActive = user && user.membershipStatus === "active";

  // Function to format currency
  const formatCurrency = (amount) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await insuranceService.getInsurancePlans();
        if (response.success) {
          // Sort plans by premium amount (lowest to highest)
          const sortedPlans = [...(response.data || [])].sort((a, b) => {
            return a.monthlyPremium - b.monthlyPremium;
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

  // Filter plans based on category (individual or family)
  useEffect(() => {
    if (plans.length > 0) {
      const filtered = plans.filter((plan) => {
        // If individual plan category, show plans with maxDependents = 0
        if (planCategory === "individual") {
          return plan.maxDependents === 0;
        }
        // If family plan category, show plans with maxDependents > 0
        return plan.maxDependents > 0;
      });
      setFilteredPlans(filtered);
    }
  }, [plans, planCategory]);

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

      // Reset state when modal is opened
      setStep(1);
      setSelectedPlan(null);
      setSelectedFrequency("monthly");
      setPhoneNumber("");
      setPaymentStatus("idle");
      setErrorMessage("");
      setPlanCategory("individual");
      setShowPlanDetailsModal(false);
      setPlanDetailsData(null);
      setShowConfirmationModal(false);

      // Check if user already has an active subscription
      if (user && user.id) {
        checkExistingSubscription();
      }

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
            "monthly",
          status: response.data.status,
        });
        console.log("Found existing subscription:", response.data);
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

  // Event Handlers
  const handleSelectPlan = (plan) => {
    console.log("Selecting plan:", plan);
    console.log("Membership active:", isMembershipActive);
    console.log("Existing subscription:", existingSubscription);

    // Check if user has active membership status
    if (!isMembershipActive) {
      onClose();
      setTimeout(() => {
        setShowMembershipRequiredModal(true);
      }, 100);
      return;
    }

    // Check if user has an existing subscription
    if (existingSubscription && existingSubscription.id) {
      setSelectedPlan(plan);
      setShowConfirmationModal(true);
      console.log("Showing confirmation modal");
      return;
    }

    setSelectedPlan(plan);
    setStep(2);
  };

  // Function to open plan details modal
  const openPlanDetails = (plan) => {
    setPlanDetailsData(plan);
    setShowPlanDetailsModal(true);
  };

  // Function to close plan details modal
  const closePlanDetails = () => {
    setShowPlanDetailsModal(false);
    setPlanDetailsData(null);
  };

  // Handle confirmation to cancel existing subscription and proceed with new plan
  const handleConfirmChangeSubscription = () => {
    setShowConfirmationModal(false);
    setStep(2);
  };

  // Handle rejection of cancellation
  const handleRejectChangeSubscription = () => {
    setShowConfirmationModal(false);
    setSelectedPlan(null);
  };

  const handlePlanCategoryChange = (category) => {
    setPlanCategory(category);
    setSelectedPlan(null);
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedPlan) {
      return; // Don't proceed if no plan is selected
    }

    if (step === 2 && !phoneNumber) {
      return; // Don't proceed if phone number is empty
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to handle plan subscription after successful payment
  const handlePaymentComplete = async (success, paymentReference) => {
    if (!success) return;

    try {
      // Ensure we have all required data
      if (!user?.id) {
        console.error("No user ID available for subscription");
        throw new Error("User authentication required for subscription");
      }

      if (!selectedPlan?.id) {
        console.error("No plan ID available for subscription");
        throw new Error("Plan selection required for subscription");
      }

      // Prepare subscription data
      const subscriptionData = {
        userId: user.id,
        planId: selectedPlan.id,
        paymentFrequency: selectedFrequency,
        startDate: new Date().toISOString(),
        paymentReference: paymentReference || "manual-subscription",
      };

      // Save to localStorage first as a fallback
      const localStorageData = {
        plan: selectedPlan,
        frequency: selectedFrequency,
        startDate: new Date().toISOString(),
        paymentReference: paymentReference || "manual-subscription",
      };

      localStorage.setItem(
        "userSubscription",
        JSON.stringify(localStorageData)
      );

      // Now try to save to the server
      const subscriptionResponse = await saveSubscription(subscriptionData);

      if (subscriptionResponse && subscriptionResponse.success) {
        console.log("Subscription successfully saved to server");

        // If the server returns updated subscription data, update localStorage
        if (subscriptionResponse.data) {
          const updatedLocalData = {
            ...localStorageData,
            id: subscriptionResponse.data.id,
            nextPaymentDate: subscriptionResponse.data.nextPaymentDate,
          };

          localStorage.setItem(
            "userSubscription",
            JSON.stringify(updatedLocalData)
          );
        }

        // Update the user's plan in the parent component
        onPlanSelected(selectedPlan, selectedFrequency);

        // Close modal after subscription is saved
        setTimeout(() => {
          onClose(true);
        }, 2000);
      } else {
        console.error("Subscription response error:", subscriptionResponse);
        // Still update the parent component since we have localStorage data
        onPlanSelected(selectedPlan, selectedFrequency);

        // Close modal after subscription is saved
        setTimeout(() => {
          onClose(true);
        }, 2000);
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      // Even if there's an error, we still have the localStorage data
      onPlanSelected(selectedPlan, selectedFrequency);

      // Close modal after subscription is saved
      setTimeout(() => {
        onClose(true);
      }, 2000);
    }
  };


  const handleOpenMembershipPage = () => {
    onClose();
    navigate("/membership");
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <>
      {/* Main Plan Selection Modal */}
      <div
        className={`fixed inset-0 z-[${getZIndex(
          "selectionModal"
        )}] overflow-y-auto`}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Modal Backdrop/Overlay */}
          <div
            className="fixed inset-0 transition-opacity bg-gray-900/80 bg-opacity-75 backdrop-blur-[1.5px]"
            onClick={onClose}
            aria-hidden="true"
          ></div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* Modal Panel */}
          <div className="inline-block w-full md:max-w-4xl px-2 sm:px-5 pt-5 pb-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6 border border-gray-200 dark:border-gray-700">
            {/* Close Button */}
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-gray-400 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <TbX className="w-6 h-6" />
              </button>
            </div>

            {/* Step Title */}
            <div className="mb-6 pl-2">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-white">
                {step === 1 && "Choose Your Health Insurance Plan"}
                {step === 2 && "Complete Your Payment"}
              </h3>
            </div>

            {/* Modal Content */}
            <AnimatePresence mode="wait">
              {/* Step 1: Plan Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Plan Category Tabs */}
                  <div className="mb-6">
                    <div className="flex justify-center text-[0.83rem] sm:text-sm md:text-base bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                      <button
                        onClick={() => setPlanCategory("individual")}
                        className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center transition-all ${
                          planCategory === "individual"
                            ? "bg-white dark:bg-gray-800 shadow-sm text-primary-600 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        <PiUserDuotone className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                        <span className="font-medium">Individual</span>
                      </button>
                      <button
                        onClick={() => setPlanCategory("family")}
                        className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center transition-all ${
                          planCategory === "family"
                            ? "bg-white dark:bg-gray-800 shadow-sm text-primary-600 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        <PiUsersThreeDuotone className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
                        <span className="font-medium">Family</span>
                      </button>
                    </div>
                    <p className="text-[0.8rem] sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
                      {planCategory === "individual"
                        ? "Coverage for yourself only."
                        : "Coverage for you and your family members."}
                    </p>
                  </div>

                  {/* Plans Grid */}
                  <PlanList
                    loading={loading}
                    plans={plans}
                    selectedPlan={selectedPlan}
                    handleSelectPlan={handleSelectPlan}
                    planCategory={planCategory}
                    selectedFrequency={selectedFrequency}
                    setSelectedFrequency={setSelectedFrequency}
                    onViewDetails={openPlanDetails}
                  />

                  {/* Navigation Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!selectedPlan}
                      className={`inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition-all duration-200 ${
                        selectedPlan
                          ? "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Continue to Payment
                      <TbArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <PlanPaymentStep
                  selectedPlan={selectedPlan}
                  selectedFrequency={selectedFrequency}
                  handlePrevStep={handlePrevStep}
                  onPaymentComplete={handlePaymentComplete}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Existing Subscription */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-[300]">
          <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={handleRejectChangeSubscription}
            onConfirm={handleConfirmChangeSubscription}
            title="Change Subscription Plan"
            titleClass="text-amber-700 dark:text-amber-600"
            message={
              <>
                <span className="block mb-3">
                  You already have an active subscription to the{" "}
                  <strong className="text-secondary-700 dark:text-secondary-500">
                    {existingSubscription?.plan?.name || "current"}
                  </strong>{" "}
                  plan.
                </span>
                <span className="block mb-3">
                  Selecting a new plan will cancel your current subscription and you will need to make a payment for the new plan to activate it.
                </span>
                <span className="block">
                  Proceed with changing your subscription plan?
                </span>
              </>
            }
            confirmText="Yes, Change Plan"
            confirmButtonClass="bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-800"
            cancelText="No, Keep Current Plan"
            type="warning"
            icon={<TbRefresh className="h-8 w-8 text-amber-600" />}
          />
        </div>
      )}

      {/* Membership Required Modal */}
      {showMembershipRequiredModal && (
        <div className="fixed inset-0 z-[300]">
          <MembershipRequiredModal
            isOpen={showMembershipRequiredModal}
            onClose={() => setShowMembershipRequiredModal(false)}
            onConfirm={handleOpenMembershipPage}
          />
        </div>
      )}

      {/* Plan Details Modal */}
      {showPlanDetailsModal && (
        <div className="fixed inset-0 z-[200]">
          <PlanDetailsModal
            isOpen={true}
            onClose={closePlanDetails}
            plan={planDetailsData}
          />
        </div>
      )}
    </>
  );
};

export default PlanSelectionModal;
