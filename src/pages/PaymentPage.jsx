import { useState } from "react";
import { FiCreditCard, FiList } from "react-icons/fi";
import PaymentForm from "../components/payment/PaymentForm";
import PaymentHistory from "../components/payment/PaymentHistory";

const PaymentPage = () => {
  const [activeTab, setActiveTab] = useState("payment");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payments
      </h1>

      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("payment")}
              className={`${
                activeTab === "payment"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FiCreditCard className="mr-2 h-5 w-5" />
              Make Payment
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`${
                activeTab === "history"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FiList className="mr-2 h-5 w-5" />
              Payment History
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "payment" ? (
          <div className="max-w-2xl mx-auto">
            <PaymentForm amount={500} plan="Crew Afya Lite" />
          </div>
        ) : (
          <PaymentHistory />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
