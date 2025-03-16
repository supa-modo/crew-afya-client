import { useState, useEffect } from "react";
import {
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiAlertTriangle,
  FiLoader,
  FiPhone,
} from "react-icons/fi";
import { TbShieldCheckFilled, TbShieldHalfFilled } from "react-icons/tb";
import { MdOutlineHealthAndSafety, MdSpaceDashboard } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { PiWarningDuotone } from "react-icons/pi";

const PlanSelectionModal = ({
  isOpen,
  onClose,
  insurancePlans,
  onPlanSelected,
}) => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSelectPlan = (plan) => {
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

  const handleInitiatePayment = async () => {
    if (!phoneNumber) return;

    setIsSubmitting(true);
    setPaymentStatus("processing");
    setStep(3); // Move to step 3 immediately when processing starts

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Randomly simulate success or failure (80% success rate)
      const isSuccess = Math.random() < 0.8;

      if (isSuccess) {
        setPaymentStatus("success");

        // Add to payment history in localStorage
        const paymentHistory = JSON.parse(
          localStorage.getItem("paymentHistory") || "[]"
        );

        // Format phone number to ensure it starts with 254 (Kenya)
        let formattedPhone = phoneNumber;
        if (phoneNumber.startsWith("0")) {
          formattedPhone = `254${phoneNumber.substring(1)}`;
        } else if (phoneNumber.startsWith("+")) {
          formattedPhone = phoneNumber.substring(1);
        }

        const newPayment = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          amount: selectedPlan.premiums[selectedFrequency],
          status: "completed",
          method: "M-Pesa",
          reference: `MP${Math.floor(Math.random() * 1000000)}`,
          plan: selectedPlan.name,
        };

        paymentHistory.unshift(newPayment);
        localStorage.setItem("paymentHistory", JSON.stringify(paymentHistory));

        // Update the user's plan in the parent component
        onPlanSelected(selectedPlan, selectedFrequency);
      } else {
        setPaymentStatus("error");
        setErrorMessage("Failed to process payment. Please try again.");
      }
    } catch (error) {
      setPaymentStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
    if (activeTab < insurancePlans.length - 1) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
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
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-500">
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
                        ? "bg-primary-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > i
                          ? "bg-primary-500"
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
                          : "text-primary-600 hover:bg-primary-50"
                      }`}
                    >
                      <FiArrowLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {activeTab + 1} of {insurancePlans.length}
                    </span>
                    <button
                      onClick={nextTab}
                      disabled={activeTab === insurancePlans.length - 1}
                      className={`p-2 rounded-full ${
                        activeTab === insurancePlans.length - 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-primary-600 hover:bg-primary-50"
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
                      {insurancePlans.map((plan) => (
                        <div
                          key={plan.name}
                          className="w-full flex-shrink-0 px-1"
                        >
                          <div
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              selectedPlan?.name === plan.name
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                                : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                            }`}
                            onClick={() => handleSelectPlan(plan)}
                          >
                            {selectedPlan?.name === plan.name && (
                              <div className="absolute top-4 right-4">
                                <TbShieldCheckFilled className="h-7 w-7 text-primary-500" />
                              </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
                              {plan.name}
                            </h3>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                              {plan.forWho}
                            </p>
                            <div className="space-y-3 mb-6">
                              {plan.benefits.slice(0, 8).map((benefit) => (
                                <div
                                  key={benefit.name}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {benefit.name}
                                  </span>
                                  <span className="font-semibold text-primary-600 dark:text-primary-500">
                                    ~ {benefit.limit}
                                  </span>
                                </div>
                              ))}
                              {plan.benefits.length > 8 && (
                                <p className="text-xs text-primary-600 dark:text-primary-400">
                                  +{plan.benefits.length - 8} more benefits
                                </p>
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
                                  <option value="monthly">Monthly</option>
                                  <option value="annual">Annual</option>
                                </select>
                                <span className="text-xl font-bold text-secondary-700 dark:text-secondary-500">
                                  KES{" "}
                                  {plan.premiums[
                                    selectedFrequency
                                  ].toLocaleString()}
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
                <div className="hidden md:grid md:grid-cols-2 gap-6">
                  {insurancePlans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                        selectedPlan?.name === plan.name
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                      }`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {selectedPlan?.name === plan.name && (
                        <div className="absolute top-4 right-4">
                          <TbShieldCheckFilled className="h-8 w-8 text-primary-500" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                        {plan.forWho}
                      </p>
                      <div className="space-y-3 mb-6">
                        {plan.benefits.map((benefit) => (
                          <div
                            key={benefit.name}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600 dark:text-gray-400">
                              {benefit.name}
                            </span>
                            <span className="font-semibold text-primary-600 dark:text-primary-500">
                              ~ {benefit.limit}
                            </span>
                          </div>
                        ))}
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
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                          </select>
                          <span className="text-2xl font-bold text-secondary-700 dark:text-secondary-500">
                            KES{" "}
                            {plan.premiums[selectedFrequency].toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!selectedPlan}
                    className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white ${
                      selectedPlan
                        ? "bg-primary-600 hover:bg-primary-700"
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
                <div className="bg-primary-50 dark:bg-primary-900/10 px-4 py-4 rounded-lg border border-primary-200 dark:border-primary-800 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MdOutlineHealthAndSafety className="h-6 w-6 text-primary-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {selectedPlan.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedFrequency.charAt(0).toUpperCase() +
                            selectedFrequency.slice(1)}{" "}
                          payment of KES{" "}
                          {selectedPlan.premiums[
                            selectedFrequency
                          ].toLocaleString()}
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
                      value={selectedPlan.premiums[
                        selectedFrequency
                      ].toLocaleString()}
                      disabled
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
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
                    className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
                        ? "bg-primary-600 hover:bg-primary-700"
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
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Please wait while we process your payment of KES{" "}
                      {selectedPlan.premiums[
                        selectedFrequency
                      ].toLocaleString()}{" "}
                      via M-Pesa...
                    </p>
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
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Your health insurance plan has been activated successfully.
                    </p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <MdSpaceDashboard  className="mr-2 h-5 w-5" />
                      Go to Dashboard
                      
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
                        onClick={handlePrevStep}
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
  );
};

export default PlanSelectionModal;
