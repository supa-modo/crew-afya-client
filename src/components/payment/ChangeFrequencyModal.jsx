import { useState, useEffect } from "react";
import { FiX, FiCheck, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import { TbShieldCheckFilled } from "react-icons/tb";
import { updateSubscription, getUserSubscription } from "../../services/subscriptionService";
import { apiGet } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ChangeFrequencyModal = ({
  isOpen,
  onClose,
  currentPlan,
  currentFrequency,
  onFrequencyChanged,
}) => {
  const { user } = useAuth();
  const [selectedFrequency, setSelectedFrequency] = useState(currentFrequency || "daily");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFrequency(currentFrequency || "daily");
      setIsSuccess(false);
      setError(null);
      setShowPaymentPrompt(false);
      
      // Load payment history when modal opens
      if (user && user.id) {
        loadPaymentHistory();
      }
    }
  }, [isOpen, currentFrequency, user]);
  
  // Load user's payment history to check if they've already paid for the new frequency
  const loadPaymentHistory = async () => {
    if (!user || !user.id) return;
    
    setIsLoadingPayments(true);
    try {
      const response = await apiGet("/payments/history", {
        limit: 50,
        offset: 0
      });
      
      if (response && response.success && response.data) {
        setPaymentHistory(response.data);
      }
    } catch (error) {
      console.error("Error loading payment history:", error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

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

  if (!isOpen) return null;

  // Helper function to get premium amount based on frequency
  const getPremiumAmount = (plan, frequency) => {
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

  // Check if user has already paid for the selected frequency
  const hasAlreadyPaidForFrequency = () => {
    if (!paymentHistory || paymentHistory.length === 0) return false;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Filter payments to find those matching the selected frequency
    const relevantPayments = paymentHistory.filter(payment => {
      // Check if payment description contains the frequency
      const frequencyPattern = new RegExp(`\\(${selectedFrequency}\\)`, 'i');
      return payment.status === 'completed' && 
             payment.description && 
             frequencyPattern.test(payment.description);
    });
    
    if (relevantPayments.length === 0) return false;
    
    // Check if any payment is recent based on frequency
    return relevantPayments.some(payment => {
      const paymentDate = new Date(payment.paymentDate);
      
      // Calculate if the payment is still valid based on frequency
      switch (selectedFrequency) {
        case 'daily':
          // Valid if paid today
          return paymentDate.getDate() === today.getDate() &&
                 paymentDate.getMonth() === today.getMonth() &&
                 paymentDate.getFullYear() === today.getFullYear();
        
        case 'weekly':
          // Valid if paid within the last 7 days
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return paymentDate >= weekAgo;
        
        case 'monthly':
          // Valid if paid in the current month
          return paymentDate.getMonth() === today.getMonth() &&
                 paymentDate.getFullYear() === today.getFullYear();
        
        case 'annual':
          // Valid if paid in the current year
          return paymentDate.getFullYear() === today.getFullYear();
        
        default:
          return false;
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedFrequency === currentFrequency) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Make sure we have a valid subscription
      if (!currentPlan) {
        throw new Error("No valid subscription found. Please refresh the page and try again.");
      }
      
      // Always fetch the subscription from the server to get the correct ID
      // This ensures we have the most up-to-date subscription data with the proper ID
      console.log("Fetching subscription for user:", user.id);
      const subscriptionResponse = await getUserSubscription(user.id);
      
      if (!subscriptionResponse || !subscriptionResponse.success) {
        console.error("Failed to get subscription:", subscriptionResponse);
        throw new Error("Could not retrieve subscription details. Please refresh and try again.");
      }
      
      if (!subscriptionResponse.data || !subscriptionResponse.data.id) {
        console.error("Invalid subscription data:", subscriptionResponse.data);
        throw new Error("No valid subscription ID found. Please contact support.");
      }
      
      const subscriptionId = subscriptionResponse.data.id;
      console.log("Using subscription ID:", subscriptionId);
      
      // Update payment frequency using the subscription service with the correct subscription ID
      const response = await updateSubscription(subscriptionId, {
        frequency: selectedFrequency
      });

      if (response && response.success) {
        // Check if user needs to make a payment for the new frequency
        const alreadyPaid = hasAlreadyPaidForFrequency();
        
        if (!alreadyPaid) {
          // Show payment prompt instead of success message
          setShowPaymentPrompt(true);
          
          // Update the parent component
          onFrequencyChanged(selectedFrequency);
        } else {
          // If already paid, show success message
          setIsSuccess(true);
          
          // Update the parent component
          onFrequencyChanged(selectedFrequency);
          
          // Close the modal after a short delay
          setTimeout(() => {
            onClose();
          }, 5000);
        }
      } else {
        throw new Error(
          response.message || "Failed to update payment frequency"
        );
      }
    } catch (error) {
      setError(error.message || "Failed to update payment frequency");
      console.error("Error updating frequency:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle payment prompt action
  const handlePaymentPromptAction = (action) => {
    if (action === 'pay') {
      //TODO:Handle redirection to payment
      // Close modal and let parent component handle redirecting to payment
      onClose();
    } else {
      // Just close the modal
      onClose();
    }
  };

  const frequencies = [
    {
      id: "daily",
      label: "Daily",
      description: `KES ${getPremiumAmount(currentPlan.plan, "daily").toLocaleString()} per day`,
    },
    {
      id: "weekly",
      label: "Weekly",
      description: `KES ${getPremiumAmount(currentPlan.plan, "weekly").toLocaleString()} per week`,
    },
    {
      id: "monthly",
      label: "Monthly",
      description: `KES ${getPremiumAmount(currentPlan.plan, "monthly").toLocaleString()} per month`,
    },
    {
      id: "annual",
      label: "Annual",
      description: `KES ${getPremiumAmount(currentPlan.plan, "annual").toLocaleString()} per year`,
    },
  ];

  // Get the plan name safely
  const planName = currentPlan.plan?.name || "selected";

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500/80 backdrop-blur-s"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-lg px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-md hover:text-gray-500 dark:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 pt-4 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-base md:text-lg font-bold leading-6 text-secondary-700 dark:text-white">
                Change Your Payment Frequency
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select how often you would like to make payments for your{" "}
                  <span className="text-primary-600 font-semibold">{planName}</span> plan.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {showPaymentPrompt ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pb-8 pt-6 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <FiAlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="mt-6 text-base font-medium text-primary-600 dark:text-white">
                Payment frequency updated!
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your payment frequency has been changed to{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {selectedFrequency}
                </span>.
              </p>
              <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                You need to make a payment for the new {selectedFrequency} period to maintain your coverage.
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => handlePaymentPromptAction('pay')}
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Make Payment Now
                </button>
                <button
                  onClick={() => handlePaymentPromptAction('later')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Pay Later
                </button>
              </div>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pb-8 pt-6 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <TbShieldCheckFilled className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-6 text-base font-medium text-primary-600 dark:text-white">
                Payment frequency updated!
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your payment frequency has been successfully changed to{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {selectedFrequency}
                </span>.
              </p>
              <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                You've already made a payment for this period. Your coverage is active.
              </p>
            </motion.div>
          ) : (
            <>
          <div className="mt-4 md:mt-6 space-y-3 px-4 sm:px-0">
            <div className="grid grid-cols-1 gap-2">
              {frequencies.map((frequency) => (
                <div
                  key={frequency.id}
                  className={`relative rounded-lg border-2 px-5 py-2 sm:p-4 cursor-pointer transition-all duration-200 ${
                    selectedFrequency === frequency.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                  }`}
                  onClick={() => setSelectedFrequency(frequency.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-primary-600 dark:text-white">
                        {frequency.label}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {frequency.description}
                      </p>
                    </div>
                    {selectedFrequency === frequency.id && (
                      <div className="flex-shrink-0 text-primary-600">
                        <FiCheck className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
                </div>
              </div>

              <div className="mt-8 sm:mt-10 flex justify-end">
                <button
                  type="button"
                  className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    isSubmitting
                      ? "bg-primary-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Frequency"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeFrequencyModal;
