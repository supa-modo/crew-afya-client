import { useState } from "react";
import {
  FiCreditCard,
  FiFileText,
  FiShield,
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiUser,
  FiHome,
} from "react-icons/fi";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import PaymentHistory from "../components/payment/PaymentHistory";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  TbCreditCardPay,
  TbHomeDot,
  TbShieldCheckFilled,
} from "react-icons/tb";
import {
  PiClockCountdownDuotone,
  PiFilesDuotone,
  PiMoneyWavy,
  PiUserCircle,
  PiUserDuotone,
} from "react-icons/pi";
import { MdPayments } from "react-icons/md";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-16">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link
                to="/"
                className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
              >
                <TbHomeDot className="h-5 w-5 mr-1" />
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Dashboard
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Welcome section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 font-lexend">
              <PiUserDuotone className="mr-2 h-8 sm:h-10 w-8 sm:w-10 text-primary-600" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-600 dark:text-white flex items-center">
                  Welcome, {user?.firstName || "User"}
                </h1>
                <p className=" text-sm  text-gray-600 dark:text-gray-400">
                  Here's an overview of your health insurance account
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                to="/payments"
                className="inline-flex items-center px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <TbCreditCardPay className="mr-2 h-6 w-6" />
                Make a Payment
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              >
                <PiUserCircle className="mr-2 h-6 w-6" />
                View Profile
              </Link>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-6 mb-3 sm:mb-4 md:mb-6">
            <DashboardSummary />
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 rounded-xl">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-7">
            <h2 className="text-base sm:text-lg font-bold text-primary-600 dark:text-white pl-1 sm:pl-2 mb-4 flex items-center">
              <TbShieldCheckFilled className="mr-2 h-6 w-6 text-primary-600" />
              Your Coverage Details
            </h2>
            {/* Coverage and Payment Schedule Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Insurance Coverage Section */}
              <div className="md:w-[70%] bg-white dark:bg-gray-800 rounded-xl shadow-sm px-5 py-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-600 mb-0.5 dark:text-white flex items-center">
                  Coverage Utilization
                </h3>
                <p className="text-[0.8rem] text-gray-600 dark:text-gray-400 mb-4">
                  Monitor your medical cover usage across different benefits
                </p>
                <div className="space-y-4 sm:space-y-5">
                  {[
                    {
                      name: "Inpatient",
                      used: 250000,
                      total: 1000000,
                      percentage: (250000 / 1000000) * 100,
                    },
                    {
                      name: "Outpatient",
                      used: 85000,
                      total: 150000,
                      percentage: (85000 / 150000) * 100,
                    },
                    {
                      name: "Dental",
                      used: 12000,
                      total: 30000,
                      percentage: (12000 / 30000) * 100,
                    },
                    {
                      name: "Optical",
                      used: 5000,
                      total: 25000,
                      percentage: (5000 / 25000) * 100,
                    },
                  ].map((benefit) => (
                    <div key={benefit.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[0.83rem] sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                          {benefit.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          Ksh. {benefit.used.toLocaleString()} / Ksh{" "}
                          {benefit.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${benefit.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Schedule Section */}
              <div className="md:w-[30%] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-600 mb-0.5 dark:text-white flex items-center">
                  Payment Schedule
                </h3>
                <p className="text-[0.8rem] text-gray-600 dark:text-gray-400 mb-2">
                  Your preferred coverage payment plan
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <PiClockCountdownDuotone className="h-6 w-6 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Next Payment:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      April 15, 2025
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <PiMoneyWavy className="h-6 w-6 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Amount:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      KES 500.00
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <FiActivity className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Frequency:
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Weekly
                    </span>
                  </div>
                  <button className="w-full justify-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500">
                    Change Details
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Payments Section */}
            <div className="mt-8">
              <h3 className="text-base md:text-lg font-semibold text-gray-600 pl-4 mb-1.5 dark:text-white flex items-center">
              <MdPayments className="mr-2 h-6 w-6 text-gray-400" />
                Recent Payments
              </h3>
              <PaymentHistory />
            </div>

            {/* Documents Section */}
            <div className="bg-white mt-10 dark:bg-gray-800 rounded-md">
            <h3 className="text-base md:text-lg font-semibold text-gray-600 pl-4 mb-4 dark:text-white flex items-center">
                
            <PiFilesDuotone className="mr-2 h-7 w-7 text-gray-400" />
                Uploaded Documents
              </h3>
              <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-900/50 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-center">
                  <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Your insurance documents and receipts will appear here.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    Upload Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
