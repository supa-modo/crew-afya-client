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

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link
                to="/"
                className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
              >
                <FiHome className="h-4 w-4 mr-1" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-5 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FiUser className="mr-2 h-5 w-5 text-primary-600" />
                Welcome, {user?.firstName || "User"}
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Here's an overview of your health insurance account
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to="/payments"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FiCreditCard className="mr-2 h-4 w-4" />
                Make a Payment
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              >
                <FiUser className="mr-2 h-4 w-4" />
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <DashboardSummary />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${
                  activeTab === "overview"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <FiActivity className="mr-2 h-5 w-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`${
                  activeTab === "payments"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <FiCreditCard className="mr-2 h-5 w-5" />
                Payments
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`${
                  activeTab === "documents"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <FiFileText className="mr-2 h-5 w-5" />
                Documents
              </button>
              <button
                onClick={() => setActiveTab("coverage")}
                className={`${
                  activeTab === "coverage"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
              >
                <FiShield className="mr-2 h-5 w-5" />
                Coverage
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiBarChart2 className="mr-2 h-5 w-5 text-primary-600" />
                    Recent Payments
                  </h2>
                  <PaymentHistory />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiShield className="mr-2 h-5 w-5 text-primary-600" />
                      Insurance Coverage
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Inpatient
                          </span>
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            75%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Outpatient
                          </span>
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            50%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: "50%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Dental
                          </span>
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            25%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: "25%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiCalendar className="mr-2 h-5 w-5 text-primary-600" />
                      Payment Schedule
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <FiClock className="h-5 w-5 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Next Payment:
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          April 15, 2023
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <FiCreditCard className="h-5 w-5 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Amount:
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          KES 500.00
                        </span>
                      </div>
                      <div className="flex justify-between py-3">
                        <div className="flex items-center">
                          <FiActivity className="h-5 w-5 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Frequency:
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Monthly
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiBarChart2 className="mr-2 h-5 w-5 text-primary-600" />
                  Payment History
                </h2>
                <PaymentHistory />
              </div>
            )}

            {activeTab === "documents" && (
              <div className="bg-white dark:bg-gray-800 rounded-md p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiFileText className="mr-2 h-5 w-5 text-primary-600" />
                  Documents
                </h2>
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
            )}

            {activeTab === "coverage" && (
              <div className="bg-white dark:bg-gray-800 rounded-md p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiShield className="mr-2 h-5 w-5 text-primary-600" />
                  Coverage Details
                </h2>
                <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-900/50 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-center">
                    <FiShield className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Your insurance coverage details will appear here.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-400 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      View Policy Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
