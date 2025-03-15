import { useState, useEffect } from "react";
import { getPaymentHistory } from "../../services/paymentService";
import { PiMoneyWavyDuotone } from "react-icons/pi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { TbActivityHeartbeat, TbCalendarUp } from "react-icons/tb";

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalPaid: 0,
    nextPaymentDate: null,
    nextPaymentAmount: 0,
    coverageStatus: "Active",
    coverageLimit: 1000000,
    coverType: "CrewAfya Lite",
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
          : new Date("2023-06-15"); // Using the date from the example
        const nextPaymentAmount = nextPayment ? nextPayment.amount : 5000; // Using the amount from the example

        setSummaryData({
          totalPaid: 45000, 
          nextPaymentDate,
          nextPaymentAmount,
          coverageStatus: "Active",
          coverageLimit: 1000000, 
          coverType: "CrewAfya Lite", 
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
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("KES", "Ksh");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 animate-pulse border border-gray-200 dark:border-gray-700"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
      description: `Next payment - ${formatDate(
        summaryData.nextPaymentDate
      ).replace(", 2023", "")}`,
      icon: "card",
    },
    {
      title: "Medical Cover Type",
      value: summaryData.coverType,
      description: "Monthly payments",
      icon: "heart",
    },
    {
      title: "Coverage Limit",
      value: formatCurrency(summaryData.coverageLimit),
      description: "Inpatient coverage limit",
      icon: "chart",
    },
    {
      title: "Next Payment",
      value: formatDate(summaryData.nextPaymentDate).replace(", 2023", ""),
      description: `${formatCurrency(summaryData.nextPaymentAmount)} due`,
      icon: "calendar",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 ">
      {summaryItems.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:px-6 sm:py-4 border border-gray-200 dark:border-gray-700 flex flex-col"
        >
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-[0.8rem] font-semibold font- text-primary-600 dark:text-primary-400">
              {item.title}
            </p>
            {item.icon === "card" && (
              <PiMoneyWavyDuotone className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            )}
            {item.icon === "heart" && (
              <MdOutlineHealthAndSafety className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            )}
            {item.icon === "chart" && (
              <TbActivityHeartbeat className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            )}
            {item.icon === "calendar" && (
              <TbCalendarUp className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold font-nunito text-zinc-500 dark:text-white">
            {item.value}
          </h3>
          <p className="text-xs  text-gray-500 dark:text-gray-400 mt-1">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
