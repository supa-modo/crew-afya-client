// src/components/UnionMembershipModal.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { PiUserDuotone } from "react-icons/pi";
import { motion } from "framer-motion";
import MakePayment from "./payment/MakePayment";
import { TbArrowLeft } from "react-icons/tb";
import { updateMembershipStatus } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const UnionMembershipModal = ({ isOpen, onClose, onPaymentComplete }) => {
  const [step, setStep] = useState(1); // 1 for info, 2 for payment
  const { user, updateUserData } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle payment completion
  const handlePaymentComplete = async (success) => {
    if (success && user) {
      try {
        // Update user membership status to active
        await updateMembershipStatus(user.id, "active");

        // Update user data in context
        if (updateUserData) {
          updateUserData({ ...user, membershipStatus: "active" });
        }

        // Call the parent's onPaymentComplete if provided
        if (onPaymentComplete) {
          onPaymentComplete(success);
        }
      } catch (error) {
        console.error("Error updating membership status:", error);
      }
    } else if (onPaymentComplete) {
      onPaymentComplete(success);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block w-full sm:max-w-xl md:max-w-2xl px-5 pt-6 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl dark:bg-gray-800 sm:my-6 sm:align-middle sm:px-10 sm:pb-8">
          {/* Header */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 bg-white rounded-md hover:text-red-500 dark:bg-gray-800 dark:hover:text-gray-300 focus:outline-none"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-secondary-700 dark:text-secondary-600">
              Union Membership Registration
            </h3>
          </div>

          {/* Step 1: Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/30">
                <PiUserDuotone className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-primary-700 dark:text-white mb-3">
                Welcome to Matatu Workers Union!
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                To activate your membership, a one-time registration fee of KES
                500 is required. This fee grants you lifetime access to all
                union benefits, including:
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <ul className="text-left text-xs sm:text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-secondary-600 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Access to medical insurance plans
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary-600 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Financial services and loan opportunities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary-600 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Advocacy and representation
                    </span>
                  </li>

                  {/* + more benefits */}
                  <li className="flex items-start">
                    <span className="text-secondary-600 mr-2">•</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      + more
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Pay Later
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700"
                >
                  Continue to Payment
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-green-50 dark:bg-green-900/10 px-4 py-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
                <div className="flex items-center">
                  <PiUserDuotone className="h-7 w-7 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      Union Membership Registration
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      One-time payment of KES 500
                    </p>
                  </div>
                </div>
              </div>

              {/* Import your payment component here */}
              <MakePayment
                selectedPlan={{
                  name: "Union Membership Registration",
                  premiums: {
                    daily: 0,
                    monthly: 0,
                    annual: 500, // Use annual for the one-time fee
                  },
                }}
                frequency="annual"
                initialPaymentType="membership"
                fixedPaymentType={true}
                onPaymentComplete={handlePaymentComplete}
              />

              <div className="mt-4 text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-secondary-600 hover:text-secondary-700"
                >
                  <div className="flex items-center justify-center">
                    <TbArrowLeft className="h-4 w-4 mr-2" />
                    <span>Back to information</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnionMembershipModal;
