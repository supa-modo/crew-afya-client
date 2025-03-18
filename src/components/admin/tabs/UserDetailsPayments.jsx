import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiClock,
  FiDownload,
} from "react-icons/fi";
import { PiSwapDuotone } from "react-icons/pi";
import {
  TbCashBanknote,
  TbCreditCard,
  TbBrandCashapp,
  TbCheck,
  TbX,
  TbClock,
  TbRefresh,
} from "react-icons/tb";
import Pagination from "../../common/Pagination";

const UserDetailsPayments = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 6;

  useEffect(() => {
    // In a real implementation, this would fetch payments from an API
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Mock API response
        setTimeout(() => {
          const mockPayments = [
            {
              id: "pay1",
              reference: "MPE123456",
              amount: 2500,
              method: "M-Pesa",
              status: "completed",
              date: "2023-06-15T14:30:00.000Z",
              planName: "Basic Health Cover",
              description: "Monthly payment for June 2023",
            },
            {
              id: "pay2",
              reference: "MPE789012",
              amount: 5000,
              method: "Card Payment",
              status: "completed",
              date: "2023-05-15T10:20:00.000Z",
              planName: "Family Health Plan",
              description: "Monthly payment for May 2023",
            },
            {
              id: "pay3",
              reference: "MPE345678",
              amount: 2500,
              method: "M-Pesa",
              status: "completed",
              date: "2023-04-15T09:45:00.000Z",
              planName: "Basic Health Cover",
              description: "Monthly payment for April 2023",
            },
            {
              id: "pay4",
              reference: "MPE901234",
              amount: 1200,
              method: "Bank Transfer",
              status: "pending",
              date: "2023-07-01T11:20:00.000Z",
              planName: "Dental Coverage",
              description: "Monthly payment for July 2023",
            },
            {
              id: "pay5",
              reference: "MPE567890",
              amount: 5000,
              method: "Card Payment",
              status: "failed",
              date: "2023-06-01T16:55:00.000Z",
              planName: "Family Health Plan",
              description:
                "Monthly payment for June 2023 - Failed due to insufficient funds",
            },
            {
              id: "pay6",
              reference: "MPE234567",
              amount: 5000,
              method: "Cash",
              status: "completed",
              date: "2023-03-15T13:10:00.000Z",
              planName: "Family Health Plan",
              description: "Monthly payment for March 2023",
            },
            {
              id: "pay7",
              reference: "MPE890123",
              amount: 2500,
              method: "M-Pesa",
              status: "refunded",
              date: "2023-02-15T08:30:00.000Z",
              planName: "Basic Health Cover",
              description:
                "Monthly payment for February 2023 - Refunded due to plan change",
            },
          ];
          setPayments(mockPayments);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user.id]);

  // Filter payments based on search term and status
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <TbCheck className="h-5 w-5 text-green-500" />;
      case "pending":
        return <TbClock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <TbX className="h-5 w-5 text-red-500" />;
      case "refunded":
        return <TbRefresh className="h-5 w-5 text-blue-500" />;
      default:
        return <TbClock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case "m-pesa":
        return <TbBrandCashapp className="h-5 w-5 text-green-500" />;
      case "card payment":
        return <TbCreditCard className="h-5 w-5 text-blue-500" />;
      case "cash":
        return <TbCashBanknote className="h-5 w-5 text-yellow-500" />;
      case "bank transfer":
        return <TbCashBanknote className="h-5 w-5 text-purple-500" />;
      default:
        return <TbCashBanknote className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownloadReceipt = (paymentId) => {
    // In a real app, this would generate and download a receipt
    console.log(`Downloading receipt for payment ${paymentId}`);
    alert(
      `Receipt for payment ${paymentId} would be downloaded in a real application.`
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-secondary-800/90">
          <PiSwapDuotone className="h-6 w-6" />
          <span className="">Payment History</span>
        </h2>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-admin-500 focus:border-admin-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search payments..."
          />
        </div>
        <div className="relative inline-block">
          <div className="flex items-center">
            <FiFilter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-600"></div>
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            Loading payments...
          </span>
        </div>
      ) : currentPayments.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Reference
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Method
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Plan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {formatDate(payment.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="ml-1.5">{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          payment.status
                        )}`}
                      >
                        <span className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.planName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDownloadReceipt(payment.id)}
                        className="text-admin-600 hover:text-admin-900 dark:text-admin-400 dark:hover:text-admin-300"
                        title="Download Receipt"
                      >
                        <FiDownload className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && currentPayments.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPayments.length}
              pageSize={paymentsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterStatus !== "all"
              ? "No payments match your search criteria"
              : "No payment history found"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPayments;
