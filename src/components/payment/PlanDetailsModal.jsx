import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { TbShieldCheckFilled } from "react-icons/tb";

const PlanDetailsModal = ({ isOpen, onClose, plan }) => {
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

  if (!isOpen || !plan) return null;

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="inline-block w-full relative sm:max-w-6xl px-5 pt-6 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl dark:bg-gray-800 sm:my-6 sm:align-middle sm:px-10 sm:pb-8"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                className="text-gray-400 bg-white rounded-md hover:text-red-500 dark:bg-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <TbShieldCheckFilled className="h-8 w-8 text-primary-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name || "Plan Details"}
                </h3>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {plan.description ||
                  "Comprehensive coverage for your health needs"}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Coverage Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Inpatient Limit
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.inpatientLimit || plan.metadata?.inpatientLimit
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Outpatient Limit
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.outpatientLimit || plan.metadata?.outpatientLimit
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Maternity Limit
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.maternityLimit || plan.metadata?.maternityLimit
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dental Limit
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.dentalLimit || plan.metadata?.dentalLimit
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                All Benefits
              </h4>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                {plan.metadata?.benefits?.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit.name}
                    </span>
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      {benefit.limit}
                    </span>
                  </div>
                ))}
                {(!plan.metadata?.benefits ||
                  plan.metadata.benefits.length === 0) && (
                  <div className="py-2 text-gray-500 dark:text-gray-400 text-center">
                    No detailed benefits information available.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Premium Rates
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Daily
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.dailyPremium ||
                        plan.premiums?.daily ||
                        plan.dailyPrice
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Weekly
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.weeklyPremium ||
                        plan.premiums?.weekly ||
                        (plan.dailyPrice ? plan.dailyPrice * 7 : null)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.monthlyPremium ||
                        plan.premiums?.monthly ||
                        (plan.dailyPrice ? plan.dailyPrice * 30 : null)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Annual
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      plan.annualPremium ||
                        plan.premiums?.annual ||
                        (plan.dailyPrice ? plan.dailyPrice * 365 : null)
                    )}
                  </p>
                </div>
              </div>
            </div>

            {plan.metadata?.terms && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Terms & Conditions
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  {typeof plan.metadata.terms === "string" ? (
                    <p>{plan.metadata.terms}</p>
                  ) : (
                    plan.metadata.terms.map((term, index) => (
                      <p key={index}>{term}</p>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
