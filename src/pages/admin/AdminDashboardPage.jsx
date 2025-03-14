import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUsers,
  FiCreditCard,
  FiSettings,
  FiPieChart,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

// Chart components (mock implementation)
const LineChart = ({ data, labels }) => {
  return (
    <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">
        Line Chart: {labels.join(", ")}
      </p>
    </div>
  );
};

const BarChart = ({ data, labels }) => {
  return (
    <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">
        Bar Chart: {labels.join(", ")}
      </p>
    </div>
  );
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPayments: 0,
    pendingPayments: 0,
    recentActivity: [],
    totalRevenue: 0,
    totalAppointments: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [0, 0, 0, 0, 0, 0],
  });

  const [userActivityData, setUserActivityData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [0, 0, 0, 0, 0, 0, 0],
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            totalUsers: 256,
            activeUsers: 187,
            totalPayments: 1243,
            pendingPayments: 32,
            recentActivity: [
              {
                id: 1,
                type: "payment",
                user: "John Doe",
                amount: 5000,
                status: "completed",
                date: "2023-06-15",
              },
              {
                id: 2,
                type: "registration",
                user: "Jane Smith",
                status: "completed",
                date: "2023-06-14",
              },
              {
                id: 3,
                type: "payment",
                user: "Robert Johnson",
                amount: 3500,
                status: "pending",
                date: "2023-06-14",
              },
              {
                id: 4,
                type: "payment",
                user: "Emily Davis",
                amount: 7500,
                status: "completed",
                date: "2023-06-13",
              },
              {
                id: 5,
                type: "registration",
                user: "Michael Brown",
                status: "completed",
                date: "2023-06-12",
              },
            ],
            totalRevenue: 28650,
            totalAppointments: 856,
            growthRate: 12.5,
          });
          setRevenueData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            data: [4500, 5200, 6800, 8900, 9200, 10500],
          });
          setUserActivityData({
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: [120, 132, 101, 134, 90, 70, 85],
          });
          setRecentUsers([
            {
              id: 1,
              name: "John Doe",
              email: "john@example.com",
              joinDate: "2023-06-15",
              avatar: null,
            },
            {
              id: 2,
              name: "Jane Smith",
              email: "jane@example.com",
              joinDate: "2023-06-14",
              avatar: null,
            },
            {
              id: 3,
              name: "Robert Johnson",
              email: "robert@example.com",
              joinDate: "2023-06-13",
              avatar: null,
            },
            {
              id: 4,
              name: "Emily Davis",
              email: "emily@example.com",
              joinDate: "2023-06-12",
              avatar: null,
            },
          ]);
          setRecentTransactions([
            {
              id: 1,
              user: "John Doe",
              amount: 150,
              date: "2023-06-15",
              status: "completed",
            },
            {
              id: 2,
              user: "Jane Smith",
              amount: 200,
              date: "2023-06-14",
              status: "completed",
            },
            {
              id: 3,
              user: "Robert Johnson",
              amount: 100,
              date: "2023-06-13",
              status: "pending",
            },
            {
              id: 4,
              user: "Emily Davis",
              amount: 300,
              date: "2023-06-12",
              status: "completed",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Dashboard" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome message */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Welcome back, {user?.firstName || "Admin"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Here's what's happening with CrewAfya today.
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mr-4">
                  <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.totalUsers}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                    active
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mr-4">
                  <FiCreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Payments
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats.totalPayments}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {stats.pendingPayments} pending
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 mr-4">
                  <FiPieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Coverage Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    73%
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +5% from last month
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3 mr-4">
                  <FiActivity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    System Health
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    98%
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    All systems operational
                  </p>
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.recentActivity.map((activity) => (
                    <li key={activity.id} className="py-3 flex items-start">
                      <div className="mr-4 mt-1">
                        {activity.status === "completed" ? (
                          <FiCheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                        ) : (
                          <FiAlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {activity.type === "payment"
                            ? "Payment"
                            : "Registration"}{" "}
                          - {activity.user}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.type === "payment" &&
                            `KES ${activity.amount.toLocaleString()}`}
                          {activity.status === "pending" && " (Pending)"}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.date}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center">
                  <Link
                    to="/admin/activity"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View all activity
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/admin/users/new"
                    className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-md transition-colors"
                  >
                    Add New User
                  </Link>
                  <Link
                    to="/admin/payments/new"
                    className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-center rounded-md transition-colors"
                  >
                    Record Payment
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
                  >
                    Generate Report
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  System Notifications
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <FiAlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        Payment Gateway Maintenance
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Scheduled maintenance on June 20, 2023 from 2:00 AM to
                        4:00 AM EAT.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <FiCheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        System Update Completed
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The latest system update has been successfully deployed.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Revenue Overview
                </h2>
                <LineChart
                  data={revenueData.data}
                  labels={revenueData.labels}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  User Activity
                </h2>
                <BarChart
                  data={userActivityData.data}
                  labels={userActivityData.labels}
                />
              </div>
            </div>

            {/* Recent Users and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Users
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                {user.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(user.joinDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Transactions
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.user}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
