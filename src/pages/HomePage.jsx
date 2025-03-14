import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiShield,
  FiCreditCard,
  FiSmartphone,
  FiBarChart2,
} from "react-icons/fi";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Helper function to handle auth-aware navigation
  const handleAuthAwareNavigation = (e, path) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Streamlined Health Insurance Payments
              </h1>
              <p className="mt-4 text-xl text-white text-opacity-90">
                Manage your insurance premiums, track payments, and monitor your
                coverage all in one place.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="btn bg-white text-primary-700 hover:bg-gray-100 hover:text-primary-800 px-6 py-3 text-base font-medium"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Link>
                {!isAuthenticated && (
                  <button
                    onClick={(e) => handleAuthAwareNavigation(e, "/login")}
                    className="btn bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 text-base font-medium"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
            <div className="hidden md:block md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Health Insurance"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Simplify Your Insurance Payments
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform makes it easy to manage your health insurance
              premiums and track your coverage.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full w-12 h-12 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <FiShield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Insurance Coverage Tracking
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Monitor your insurance coverage limits and usage in real-time.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full w-12 h-12 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <FiCreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Easy Premium Payments
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Pay your premiums easily using M-Pesa and other payment methods.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full w-12 h-12 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <FiSmartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                USSD Access
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Access your account and make payments via USSD on any phone.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full w-12 h-12 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment Analytics
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your payment history and analyze your insurance spending.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 dark:bg-primary-900/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isAuthenticated ? "Welcome back!" : "Ready to get started?"}
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  {isAuthenticated
                    ? "Continue managing your health insurance payments with ease."
                    : "Join thousands of users who are already managing their health insurance payments with ease."}
                </p>
                <div className="mt-8">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="btn btn-primary px-6 py-3 text-base font-medium"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Create an Account"}
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 bg-primary-600 dark:bg-primary-800 p-8 md:p-12 text-white">
                <h3 className="text-2xl font-bold">Benefits</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Easy premium payments via M-Pesa</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Real-time coverage tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Detailed payment history</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-white mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Access via web and USSD</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
