import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { getPaymentHistory } from "../../services/paymentService";

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalPaid: 0,
    nextPaymentDate: null,
    nextPaymentAmount: 0,
    coverageStatus: "Active",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        // Get payment history to calculate summary data
        const response = await getPaymentHistory();

        // Check if response has the expected structure
        if (!response || !response.success || !Array.isArray(response.data)) {
          throw new Error("Invalid payment history data format");
        }

        const paymentHistory = response.data;

        // Calculate total paid
        const totalPaid = paymentHistory.reduce((sum, payment) => {
          if (payment.status === "completed") {
            return sum + payment.amount;
          }
          return sum;
        }, 0);

        // Find next payment (first pending payment)
        const nextPayment = paymentHistory.find(
          (payment) => payment.status === "pending"
        );

        // Set next payment date and amount
        const nextPaymentDate = nextPayment
          ? new Date(nextPayment.date)
          : new Date();
        const nextPaymentAmount = nextPayment ? nextPayment.amount : 500;

        setSummaryData({
          totalPaid,
          nextPaymentDate,
          nextPaymentAmount,
          coverageStatus: "Active",
        });
      } catch (err) {
        setError(err.message || "Failed to load summary data");
        console.error("Dashboard summary error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 animate-pulse border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-700 mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md shadow-sm text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
        <h3 className="text-lg font-medium mb-2">Error loading summary data</h3>
        <p>{error}</p>
      </div>
    );
  }

  const summaryItems = [
    {
      title: "Total Paid",
      value: formatCurrency(summaryData.totalPaid),
      icon: <FiDollarSign className="h-5 w-5" />,
      color: "text-primary-600",
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
      trend: "+12% from last month",
      trendUp: true,
    },
    {
      title: "Next Payment Date",
      value: formatDate(summaryData.nextPaymentDate),
      icon: <FiCalendar className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Next Payment Amount",
      value: formatCurrency(summaryData.nextPaymentAmount),
      icon: <FiClock className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Coverage Status",
      value: summaryData.coverageStatus,
      icon: <FiShield className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      badge: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-md ${item.bgColor} ${item.color} mr-4`}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.title}
              </p>
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {item.badge ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                      {item.value}
                    </span>
                  ) : (
                    item.value
                  )}
                </h3>
                {item.trend && (
                  <span
                    className={`ml-2 flex items-center text-xs font-medium ${
                      item.trendUp
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <FiTrendingUp className="h-3 w-3 mr-1" />
                    {item.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
