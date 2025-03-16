import { useState } from "react";
import { FiX, FiCheck, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import { TbShieldCheckFilled } from "react-icons/tb";

const ChangeFrequencyModal = ({
  isOpen,
  onClose,
  currentPlan,
  currentFrequency,
  onFrequencyChanged,
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState(currentFrequency);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !currentPlan) return null;

  const handleSubmit = async () => {
    if (selectedFrequency === currentFrequency) {
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the frequency in the parent component
      onFrequencyChanged(selectedFrequency);
      setIsSuccess(true);

    //   Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error changing frequency:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
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
                  {currentPlan.name} plan.
                </p>
              </div>
            </div>
          </div>

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
                Your payment frequency has been changed to <span className="text-secondary-700 font-semibold">{selectedFrequency}</span> payments.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mt-4 md:mt-6 space-y-4 px-4 sm:px-0">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {["daily", "monthly", "annual"].map((frequency) => (
                    <div
                      key={frequency}
                      className={`relative rounded-lg border-2 px-5 py-2 sm:p-4 cursor-pointer transition-all duration-200 ${
                        selectedFrequency === frequency
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                      }`}
                      onClick={() => setSelectedFrequency(frequency)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-medium text-gray-900 dark:text-white capitalize">
                            {frequency}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            KES{" "}
                            {currentPlan.premiums[frequency].toLocaleString()}{" "}
                            per{" "}
                            {frequency === "daily"
                              ? "day"
                              : frequency === "monthly"
                              ? "month"
                              : "year"}
                          </p>
                        </div>
                        {selectedFrequency === frequency && (
                          <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <FiCheck className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 sm:ml-3 sm:w-auto md:text-[0.9rem]"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-[0.9rem]"
                  onClick={onClose}
                >
                  Cancel
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
