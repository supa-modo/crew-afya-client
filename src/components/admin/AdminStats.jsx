import { useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  RefreshIcon,
} from "../../utils/Icons";

const AdminStats = ({ stats, loading }) => {
  const [timeRange, setTimeRange] = useState("week");

  // Mock data for UI development - will be replaced with actual API data
  const mockStats = {
    totalUsers: 1248,
    activeUsers: 1156,
    totalPayments: 3567,
    totalAmount: 8564320,
    pendingPayments: 42,
    failedPayments: 18,
    activeCoverages: 1134,
    expiredCoverages: 22,
    userGrowth: 12.4,
    paymentGrowth: 8.7,
    amountGrowth: 15.2,
    coverageGrowth: 10.5,
  };

  // Use real data if available, otherwise use mock data
  const data = stats || mockStats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const isPositive = value >= 0;
    return (
      <span
        className={`inline-flex items-center ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        )}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  const handleRefresh = () => {
    // This would trigger a refresh of the stats data
    console.log("Refreshing stats...");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
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
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("day")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "day"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "week"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "month"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === "year"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Year
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <RefreshIcon className="h-5 w-5 mr-1" />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <div className="bg-indigo-100 p-2 rounded-md">
              <UsersIcon className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-800">
              {data.totalUsers.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatPercentage(data.userGrowth)} from previous {timeRange}
            </p>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-gray-500">Active</p>
              <p className="font-medium text-gray-800">
                {data.activeUsers.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Inactive</p>
              <p className="font-medium text-gray-800">
                {(data.totalUsers - data.activeUsers).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Payments Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Payments
            </h3>
            <div className="bg-green-100 p-2 rounded-md">
              <CreditCardIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-800">
              {data.totalPayments.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatPercentage(data.paymentGrowth)} from previous {timeRange}
            </p>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-gray-500">Pending</p>
              <p className="font-medium text-gray-800">
                {data.pendingPayments.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Failed</p>
              <p className="font-medium text-gray-800">
                {data.failedPayments.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Amount Collected
            </h3>
            <div className="bg-blue-100 p-2 rounded-md">
              <span className="text-blue-600 font-bold">KES</span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-800">
              {formatCurrency(data.totalAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatPercentage(data.amountGrowth)} from previous {timeRange}
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              85% of target for this {timeRange}
            </p>
          </div>
        </div>

        {/* Insurance Coverage Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">
              Insurance Coverage
            </h3>
            <div className="bg-purple-100 p-2 rounded-md">
              <CheckCircleIcon className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-800">
              {data.activeCoverages.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatPercentage(data.coverageGrowth)} from previous {timeRange}
            </p>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-gray-500">Active</p>
              <p className="font-medium text-gray-800">
                {data.activeCoverages.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Expired</p>
              <p className="font-medium text-gray-800">
                {data.expiredCoverages.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Activity
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
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Mock recent activity data */}
                {[
                  {
                    id: 1,
                    user: "John Doe",
                    activity: "Payment",
                    amount: 2400,
                    status: "success",
                    date: "2023-06-15T10:30:00",
                  },
                  {
                    id: 2,
                    user: "Jane Smith",
                    activity: "Registration",
                    amount: null,
                    status: "success",
                    date: "2023-06-14T14:45:00",
                  },
                  {
                    id: 3,
                    user: "Michael Johnson",
                    activity: "Payment",
                    amount: 1800,
                    status: "pending",
                    date: "2023-06-14T09:15:00",
                  },
                  {
                    id: 4,
                    user: "Sarah Williams",
                    activity: "Payment",
                    amount: 3600,
                    status: "failed",
                    date: "2023-06-13T16:20:00",
                  },
                  {
                    id: 5,
                    user: "Robert Brown",
                    activity: "Coverage Renewal",
                    amount: 4800,
                    status: "success",
                    date: "2023-06-13T11:05:00",
                  },
                ].map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activity.activity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activity.amount
                          ? formatCurrency(activity.amount)
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.status === "success"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-right">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
