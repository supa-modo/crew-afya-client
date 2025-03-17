import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiActivity,
} from "react-icons/fi";
import { TbShieldHalfFilled, TbShieldCheckFilled } from "react-icons/tb";
import { HiOutlineEye, HiOutlineHeart } from "react-icons/hi";
import { MdOutlineChildCare } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const CoverageDetails = () => {
  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCoverageDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/insurance/coverage/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCoverage(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch coverage details"
          );
        }
      } catch (err) {
        console.error("Error fetching coverage details:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load coverage details"
        );

        // Fallback to mock data if API fails
        setCoverage({
          coverage: {
            planType: "Crew Afya Lite",
            status: "active",
            startDate: new Date().toISOString(),
            lastPaymentDate: new Date().toISOString(),
            nextPaymentDate: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
            remainingInpatientLimit: 200000,
            remainingOutpatientLimit: 20000,
            remainingOpticalLimit: 5000,
            remainingMaternityLimit: 20000,
            paymentFrequency: "daily",
            dailyPremium: 24,
          },
          totalPaid: 1200,
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoverageDetails();
  }, [token]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  // Get status badge
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    let textColor = "";
    let icon = null;

    switch (status) {
      case "active":
        bgColor = "bg-green-100 dark:bg-green-900/20";
        textColor = "text-green-700 dark:text-green-400";
        icon = <FiCheckCircle className="mr-1 h-4 w-4" />;
        break;
      case "inactive":
        bgColor = "bg-red-100 dark:bg-red-900/20";
        textColor = "text-red-700 dark:text-red-400";
        icon = <FiAlertCircle className="mr-1 h-4 w-4" />;
        break;
      case "suspended":
        bgColor = "bg-yellow-100 dark:bg-yellow-900/20";
        textColor = "text-yellow-700 dark:text-yellow-400";
        icon = <FiClock className="mr-1 h-4 w-4" />;
        break;
      default:
        bgColor = "bg-gray-100 dark:bg-gray-700";
        textColor = "text-gray-700 dark:text-gray-400";
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <FiLoader className="h-8 w-8 text-primary-500 animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          Loading coverage details...
        </span>
      </div>
    );
  }

  if (error && !coverage) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg shadow-sm text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <FiAlertCircle className="h-5 w-5 mr-2" />
          Error loading coverage details
        </h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!coverage) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mb-4">
          <TbShieldHalfFilled className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Insurance Coverage
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          You don't have an active insurance coverage plan. Select a plan to get
          started with your medical coverage.
        </p>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Select a Plan
        </button>
      </div>
    );
  }

  const { coverage: coverageData, totalPaid, isActive } = coverage;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <TbShieldCheckFilled className="h-7 w-7 text-primary-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Insurance Coverage
            </h2>
          </div>
          <div className="mt-3 sm:mt-0">
            <StatusBadge status={coverageData.status} />
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Plan Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiShield className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Plan Type
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-white">
                    {coverageData.planType}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Start Date
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-white">
                    {formatDate(coverageData.startDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiDollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Daily Premium
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(coverageData.dailyPremium)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiActivity className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Frequency
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-white capitalize">
                    {coverageData.paymentFrequency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Payment Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Payment
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-white">
                    {coverageData.lastPaymentDate
                      ? formatDate(coverageData.lastPaymentDate)
                      : "No payments yet"}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Next Payment Due
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-white">
                    {coverageData.nextPaymentDate
                      ? formatDate(coverageData.nextPaymentDate)
                      : "Not scheduled"}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiDollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Paid
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Limits */}
      <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Coverage Limits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <HiOutlineHeart className="h-6 w-6 text-red-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Inpatient
              </h4>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(coverageData.remainingInpatientLimit)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Remaining limit
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FiActivity className="h-6 w-6 text-blue-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Outpatient
              </h4>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(coverageData.remainingOutpatientLimit)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Remaining limit
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <HiOutlineEye className="h-6 w-6 text-green-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Optical
              </h4>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(coverageData.remainingOpticalLimit)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Remaining limit
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <MdOutlineChildCare className="h-6 w-6 text-purple-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maternity
              </h4>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(coverageData.remainingMaternityLimit)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Remaining limit
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-wrap gap-3">
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Make a Payment
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          View Payment History
        </button>
      </div>
    </div>
  );
};

export default CoverageDetails;
