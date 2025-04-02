import { useState, useEffect } from "react";
import { FiX, FiCheck, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import { TbShieldCheckFilled } from "react-icons/tb";
import { updateSubscription } from "../../services/subscriptionService";

const ChangeFrequencyModal = ({
  isOpen,
  onClose,
  currentPlan,
  currentFrequency,
  onFrequencyChanged,
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState(currentFrequency || "daily");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFrequency(currentFrequency || "daily");
      setIsSuccess(false);
      setError(null);
    }
  }, [isOpen, currentFrequency]);

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

  const handleSubmit = async () => {
    if (selectedFrequency === currentFrequency) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Update payment frequency using the subscription service
      const response = await updateSubscription(currentPlan?.id, {
        frequency: selectedFrequency
      });

      if (response && response.success) {
        setIsSuccess(true);

        // Update the parent component
        onFrequencyChanged(selectedFrequency);

        // Close the modal after a short delay
        setTimeout(() => {
          onClose();
        }, 2000);
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

  const frequencies = [
    {
      id: "daily",
      label: "Daily",
      description: `KES ${getPremiumAmount(currentPlan, "daily").toLocaleString()} per day`,
    },
    {
      id: "weekly",
      label: "Weekly",
      description: `KES ${getPremiumAmount(currentPlan, "weekly").toLocaleString()} per week`,
    },
    {
      id: "monthly",
      label: "Monthly",
      description: `KES ${getPremiumAmount(currentPlan, "monthly").toLocaleString()} per month`,
    },
    {
      id: "annual",
      label: "Annual",
      description: `KES ${getPremiumAmount(currentPlan, "annual").toLocaleString()} per year`,
    },
  ];

  // Get the plan name safely
  const planName = currentPlan?.name || "selected";

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
              <h3 className="text-base md:text-lg font-medium leading-6 text-secondary-700 dark:text-white">
                Change Your Payment Frequency
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select how often you would like to make payments for your{" "}
                  {planName} plan.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {isSuccess ? (
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
                Your payment frequency has been changed to{" "}
                <span className="text-secondary-700 font-semibold">
                  {frequencies.find((f) => f.id === selectedFrequency)?.label}
                </span>{" "}
                payments.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mt-4 md:mt-6 space-y-4 px-4 sm:px-0">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
                          <h4 className="font-medium text-gray-900 dark:text-white">
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
