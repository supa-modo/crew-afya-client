import { useState } from "react";
import {
  FiPhone,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { initiateMpesaPayment } from "../../services/paymentService";

const MakePayment = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    amount: 500, // Default amount
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.phoneNumber) {
      setFormError("Please enter your phone number");
      return;
    }

    // Phone validation (simple check for now)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setFormError("Please enter a valid phone number");
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      // Format phone number to ensure it starts with 254 (Kenya)
      let phoneNumber = formData.phoneNumber;
      if (phoneNumber.startsWith("0")) {
        phoneNumber = `254${phoneNumber.substring(1)}`;
      } else if (phoneNumber.startsWith("+")) {
        phoneNumber = phoneNumber.substring(1);
      }

      const response = await initiateMpesaPayment({
        ...formData,
        phoneNumber,
      });

      setIsSuccess(true);
      setTransactionDetails(response);
    } catch (error) {
      setFormError(
        error.message || "Failed to initiate payment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  return (
    <div className="max-w-2xl w-full mx-auto pb-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-700 dark:text-white">
          Make a Payment
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Pay your insurance premium using M-Pesa
        </p>
      </div>

      {formError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start">
          <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Payment Initiated
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please check your phone and enter your M-Pesa PIN to complete the
            payment.
          </p>

          {transactionDetails && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Transaction ID:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {transactionDetails.transactionId || "Pending"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Amount:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(formData.amount)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Phone Number:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formData.phoneNumber}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => {
                setIsSuccess(false);
                setTransactionDetails(null);
              }}
              className="btn btn-primary w-full"
            >
              Make Another Payment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="label">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input pl-10"
                placeholder="+254700000000"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the phone number registered with M-Pesa
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="label">
              Amount (KES)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="1"
                value={formData.amount}
                onChange={handleChange}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Pay Now"}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By clicking "Pay Now", you will receive a prompt on your phone to
              complete the payment.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default MakePayment;
