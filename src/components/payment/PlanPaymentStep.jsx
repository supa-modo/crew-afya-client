import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TbShieldHalfFilled, TbArrowLeft } from "react-icons/tb";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import MakePayment from "./MakePayment";

const PlanPaymentStep = ({
  selectedPlan,
  selectedFrequency,
  handlePrevStep,
  onPaymentComplete,
  formatCurrency,
}) => {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Function to handle payment completion
  const handlePaymentComplete = (success) => {
    if (success) {
      setIsPaymentProcessing(false);
      if (onPaymentComplete) {
        onPaymentComplete(success);
      }
    }
  };

  // Calculate premium amount based on frequency
  const getFrequencyAmount = (plan, frequency) => {
    if (!plan) return 0;

    const premiumField = `${frequency}Premium`;
    if (plan[premiumField] !== undefined) {
      return plan[premiumField];
    }
    return 0;
  };

  return (
    <motion.div
      key="payment-step"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >

     <div className="p-0 pb-3 sm:px-4">
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Activate your selected plan by completing the payment below</p>
     </div>
        <div className="p-0 sm:p-4">
          <MakePayment
            selectedPlan={selectedPlan}
            frequency={selectedFrequency}
            initialPaymentType="medical"
            fixedPaymentType={true}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>

      {/* Navigation Button */}
      <div className="mt-2 flex justify-start">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={isPaymentProcessing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TbArrowLeft className="mr-2 h-5 w-5" />
          Back to Plan Selection
        </button>
      </div>
    </motion.div>
  );
};

export default PlanPaymentStep;
