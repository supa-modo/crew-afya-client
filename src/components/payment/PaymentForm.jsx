import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiCheck,
} from "react-icons/fi";
import { HiCash } from "react-icons/hi";
import { TbCreditCard } from "react-icons/tb";

const PaymentForm = ({ amount = 500, plan = "Crew Afya Lite" }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (paymentMethod === "mpesa") {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^(?:\+254|0)[17]\d{8}$/.test(formData.phone)) {
        newErrors.phone = "Enter a valid Kenyan phone number";
      }
    } else if (paymentMethod === "card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Use format MM/YY";
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a random reference number
      const reference =
        paymentMethod === "mpesa"
          ? "MP" + Math.floor(100000 + Math.random() * 900000)
          : "CC" + Math.floor(100000 + Math.random() * 900000);

      // Create payment record
      const paymentRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: amount,
        status: "completed", // In a real app, this would depend on the payment gateway response
        method: paymentMethod === "mpesa" ? "M-Pesa" : "Credit Card",
        reference: reference,
        plan: plan,
      };

      // Store in localStorage
      const existingPayments = JSON.parse(
        localStorage.getItem("paymentHistory") || "[]"
      );
      localStorage.setItem(
        "paymentHistory",
        JSON.stringify([...existingPayments, paymentRecord])
      );

      // Show success state
      setIsSuccess(true);

      // Redirect after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({ submit: "Payment failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
            <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Payment Successful
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your payment of {amount.toLocaleString()} KES has been processed
            successfully.
          </p>
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Payment Details
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Complete your payment to activate your {plan} plan.
        </p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Amount
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {amount.toLocaleString()} KES
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Plan
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {plan}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("mpesa")}
            className={`flex-1 py-3 px-4 rounded-lg border ${
              paymentMethod === "mpesa"
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600"
                : "border-gray-300 dark:border-gray-600"
            } flex items-center justify-center space-x-2 transition-colors duration-200`}
          >
            <HiCash
              className={`h-5 w-5 ${
                paymentMethod === "mpesa"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            />
            <span
              className={`font-medium ${
                paymentMethod === "mpesa"
                  ? "text-primary-700 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              M-Pesa
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex-1 py-3 px-4 rounded-lg border ${
              paymentMethod === "card"
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600"
                : "border-gray-300 dark:border-gray-600"
            } flex items-center justify-center space-x-2 transition-colors duration-200`}
          >
            <TbCreditCard
              className={`h-5 w-5 ${
                paymentMethod === "card"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            />
            <span
              className={`font-medium ${
                paymentMethod === "card"
                  ? "text-primary-700 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Card
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.name
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                placeholder="johndoe@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {paymentMethod === "mpesa" && (
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.phone
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  placeholder="0712345678"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>
          )}

          {paymentMethod === "card" && (
            <>
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.cardNumber
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border ${
                      errors.expiryDate
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border ${
                      errors.cvv
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                    placeholder="123"
                    maxLength="4"
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.submit}
            </p>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Pay {amount.toLocaleString()} KES</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
