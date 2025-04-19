// src/components/UnionMembershipModal.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { PiUserDuotone } from "react-icons/pi";
import { motion } from "framer-motion";
import MakePayment from "./payment/MakePayment";
import { TbArrowLeft } from "react-icons/tb";
import { updateMembershipStatus } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { RiUserCommunityLine } from "react-icons/ri";

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
    <div className="fixed inset-0 z-[100] overflow-y-auto backdrop-blur-[1.5px]">
      <div className="flex items-center justify-center min-h-screen px-3 pt-4 pb-20 text-center sm:block sm:px-5">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block w-full max-w-3xl px-2 md:px-5 pt-6 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl dark:bg-gray-800 sm:my-6 sm:align-middle sm:px-10 sm:pb-8">
          {/* Header */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 bg-white rounded-md hover:text-red-500 dark:bg-gray-800 dark:hover:text-gray-300 focus:outline-none"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Step 1: Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-2 md:mb-4 flex items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/30">
                <RiUserCommunityLine className="h-10 w-10 text-secondary-600 dark:text-secondary-400" />
              </div>

              <div className="text-center mb-2 md:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-secondary-700 dark:text-secondary-600">
              Union Membership Registration
            </h3>
          </div>

              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-5 md:mb-8">
              Welcome to <span className="font-bold text-primary-600">Matatu Workers Union</span>! To activate your membership, a one-time registration fee of KES
                500 is required. This fee grants you access to all
                union benefits.
              </p>

              <div className="w-full flex justify-center space-x-2 md:space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  Pay Later
                </button>
                <button
                  onClick={() => setStep(2)}
                  className=" px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-gradient-to-br from-secondary-600 to-secondary-700 hover:bg-secondary-700"
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
              className="mt-7 sm:mt-10"
            >

              <MakePayment
                selectedPlan={{
                  name: "Union Membership Registration",
                  premiums: {
                    daily: 0,
                    monthly: 0,
                    annual: 500, // Using annual for the one-time fee
                  },
                }}
                frequency="annual"
                initialPaymentType="membership"
                fixedPaymentType={true}
                onPaymentComplete={handlePaymentComplete}
              />

              <div className="text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-[0.83rem] sm:text-sm font-medium text-secondary-600 hover:text-secondary-700"
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
