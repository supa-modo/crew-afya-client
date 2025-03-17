import { useState, useEffect } from "react";
import {
  getPaymentAnalytics,
  getTransactions,
} from "../../services/adminService";
import {
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  RefreshIcon,
  SearchIcon,
} from "../../utils/Icons";

const PaymentAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [groupBy, setGroupBy] = useState("day");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data for UI development - will be replaced with actual API data
  const mockAnalyticsData = {
    totalAmount: 8564320,
    totalTransactions: 3567,
    successfulTransactions: 3507,
    failedTransactions: 60,
    averageAmount: 2400,
    timeSeriesData: [
      { date: "2023-06-01", amount: 240000, count: 100 },
      { date: "2023-06-02", amount: 264000, count: 110 },
      { date: "2023-06-03", amount: 288000, count: 120 },
      { date: "2023-06-04", amount: 312000, count: 130 },
      { date: "2023-06-05", amount: 336000, count: 140 },
      { date: "2023-06-06", amount: 360000, count: 150 },
      { date: "2023-06-07", amount: 384000, count: 160 },
      { date: "2023-06-08", amount: 408000, count: 170 },
      { date: "2023-06-09", amount: 432000, count: 180 },
      { date: "2023-06-10", amount: 456000, count: 190 },
      { date: "2023-06-11", amount: 480000, count: 200 },
      { date: "2023-06-12", amount: 456000, count: 190 },
      { date: "2023-06-13", amount: 432000, count: 180 },
      { date: "2023-06-14", amount: 408000, count: 170 },
      { date: "2023-06-15", amount: 384000, count: 160 },
    ],
    paymentMethods: [
      { method: "M-Pesa", count: 3200, amount: 7680000 },
      { method: "Bank Transfer", count: 300, amount: 720000 },
      { method: "Cash", count: 67, amount: 164320 },
    ],
    coverageTypes: [
      { type: "Crew Afya Lite", count: 2500, amount: 5000000 },
      { type: "Crew Afya (Up to M+3)", count: 1067, amount: 3564320 },
    ],
  };

  // Mock transactions data
  const mockTransactions = [
    {
      id: "tx123456",
      userId: "user123",
      userName: "John Doe",
      amount: 2400,
      paymentMethod: "M-Pesa",
      status: "success",
      coverageType: "Crew Afya Lite",
      transactionDate: "2023-06-15T10:30:00Z",
      mpesaReference: "QWE123456",
    },
    {
      id: "tx123457",
      userId: "user124",
      userName: "Jane Smith",
      amount: 5500,
      paymentMethod: "M-Pesa",
      status: "success",
      coverageType: "Crew Afya (Up to M+3)",
      transactionDate: "2023-06-15T11:45:00Z",
      mpesaReference: "QWE123457",
    },
    {
      id: "tx123458",
      userId: "user125",
      userName: "Michael Johnson",
      amount: 2400,
      paymentMethod: "Bank Transfer",
      status: "pending",
      coverageType: "Crew Afya Lite",
      transactionDate: "2023-06-14T09:15:00Z",
      reference: "BT987654",
    },
    {
      id: "tx123459",
      userId: "user126",
      userName: "Sarah Williams",
      amount: 5500,
      paymentMethod: "M-Pesa",
      status: "failed",
      coverageType: "Crew Afya (Up to M+3)",
      transactionDate: "2023-06-14T14:20:00Z",
      mpesaReference: "QWE123459",
    },
    {
      id: "tx123460",
      userId: "user127",
      userName: "Robert Brown",
      amount: 2400,
      paymentMethod: "Cash",
      status: "success",
      coverageType: "Crew Afya Lite",
      transactionDate: "2023-06-13T16:10:00Z",
      reference: "CASH001234",
    },
  ];

  useEffect(() => {
    fetchAnalyticsData();
    fetchTransactions();
  }, [dateRange, groupBy]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call the API
      // const response = await getPaymentAnalytics({
      //   startDate: dateRange.startDate,
      //   endDate: dateRange.endDate,
      //   groupBy,
      // });

      // Mock API response
      setTimeout(() => {
        setAnalyticsData(mockAnalyticsData);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err.message || "Failed to load analytics data");
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // In a real implementation, this would call the API
      // const response = await getTransactions({
      //   page: currentPage,
      //   limit: 10,
      //   search: searchTerm,
      //   startDate: dateRange.startDate,
      //   endDate: dateRange.endDate,
      // });

      // Mock API response
      setTimeout(() => {
        let filteredTransactions = [...mockTransactions];

        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          filteredTransactions = filteredTransactions.filter(
            (tx) =>
              tx.userName.toLowerCase().includes(search) ||
              tx.mpesaReference?.toLowerCase().includes(search) ||
              tx.reference?.toLowerCase().includes(search) ||
              tx.id.toLowerCase().includes(search)
          );
        }

        setTransactions(filteredTransactions);
        setTotalPages(Math.ceil(filteredTransactions.length / 10));
      }, 300);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions");
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
    fetchTransactions();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to generate chart bars
  const renderChartBars = () => {
    if (!analyticsData || !analyticsData.timeSeriesData) return null;

    const data = analyticsData.timeSeriesData;
    const maxAmount = Math.max(...data.map((item) => item.amount));

    return (
      <div className="flex items-end h-64 space-x-2 mt-4">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-indigo-500 rounded-t hover:bg-indigo-600 transition-all cursor-pointer relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(item.amount)} ({item.count} transactions)
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left h-8">
                {formatDate(item.date)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Payment Analytics
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="day">Group by Day</option>
            <option value="week">Group by Week</option>
            <option value="month">Group by Month</option>
          </select>
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <RefreshIcon className="h-5 w-5 mr-1 text-gray-500" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Amount Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Amount</h3>
            <p className="text-3xl font-semibold text-gray-800 mt-2">
              {formatCurrency(analyticsData?.totalAmount || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              From {analyticsData?.totalTransactions || 0} transactions
            </p>
          </div>

          {/* Successful Transactions Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Successful Payments
            </h3>
            <p className="text-3xl font-semibold text-green-600 mt-2">
              {analyticsData?.successfulTransactions || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {analyticsData?.totalTransactions
                ? (
                    (analyticsData.successfulTransactions /
                      analyticsData.totalTransactions) *
                    100
                  ).toFixed(1)
                : 0}
              % success rate
            </p>
          </div>

          {/* Failed Transactions Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Failed Payments
            </h3>
            <p className="text-3xl font-semibold text-red-600 mt-2">
              {analyticsData?.failedTransactions || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {analyticsData?.totalTransactions
                ? (
                    (analyticsData.failedTransactions /
                      analyticsData.totalTransactions) *
                    100
                  ).toFixed(1)
                : 0}
              % failure rate
            </p>
          </div>

          {/* Average Amount Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">
              Average Payment
            </h3>
            <p className="text-3xl font-semibold text-gray-800 mt-2">
              {formatCurrency(analyticsData?.averageAmount || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Per transaction</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Time Series Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-gray-800 font-medium mb-4">Payment Trends</h3>
          {loading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ) : (
            renderChartBars()
          )}
        </div>

        {/* Distribution Charts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-800 font-medium mb-4">
            Payment Distribution
          </h3>

          {loading ? (
            <div className="space-y-4">
              <div className="h-32 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-32 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <h4 className="text-sm text-gray-500 mb-2">
                  By Payment Method
                </h4>
                <div className="space-y-2">
                  {analyticsData?.paymentMethods.map((method, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{method.method}</span>
                        <span className="font-medium">
                          {formatCurrency(method.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (method.amount / analyticsData.totalAmount) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coverage Types */}
              <div>
                <h4 className="text-sm text-gray-500 mb-2">By Coverage Type</h4>
                <div className="space-y-2">
                  {analyticsData?.coverageTypes.map((type, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{type.type}</span>
                        <span className="font-medium">
                          {formatCurrency(type.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (type.amount / analyticsData.totalAmount) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Recent Transactions
          </h3>
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            </form>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <DownloadIcon className="h-5 w-5 mr-1 text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Method
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Coverage
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.coverageType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === "success"
                            ? "bg-green-100 text-green-800"
                            : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(tx.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.mpesaReference || tx.reference || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {transactions.length} of {transactions.length} transactions
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;
