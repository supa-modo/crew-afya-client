import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  ServerIcon,
  DocumentReportIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "../../utils/Icons";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPayments: 0,
    totalAmount: 0,
    systemHealth: "healthy",
    pendingReports: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1245,
        activeUsers: 876,
        totalPayments: 3567,
        totalAmount: 8564320,
        systemHealth: "healthy",
        pendingReports: 3,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+12.5%",
      increasing: true,
      icon: UsersIcon,
      color: "bg-blue-500",
      link: "/admin/users",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      change: "+8.2%",
      increasing: true,
      icon: UsersIcon,
      color: "bg-green-500",
      link: "/admin/users",
    },
    {
      title: "Total Payments",
      value: stats.totalPayments,
      change: "+15.3%",
      increasing: true,
      icon: CreditCardIcon,
      color: "bg-admin-500",
      link: "/admin/payments",
    },
    {
      title: "Total Amount",
      value: new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
      }).format(stats.totalAmount),
      change: "+18.7%",
      increasing: true,
      icon: ChartBarIcon,
      color: "bg-purple-500",
      link: "/admin/analytics",
    },
    {
      title: "System Health",
      value:
        stats.systemHealth.charAt(0).toUpperCase() +
        stats.systemHealth.slice(1),
      change: "Stable",
      increasing: null,
      icon: ServerIcon,
      color: "bg-teal-500",
      link: "/admin/system-health",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      change: "-2",
      increasing: false,
      icon: DocumentReportIcon,
      color: "bg-amber-500",
      link: "/admin/reports",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of the CrewAfya system
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link
              to={card.link}
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {card.title}
                  </h2>
                  <div className={`p-3 rounded-full ${card.color} text-white`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                  <p
                    className={`ml-2 flex items-center text-sm ${
                      card.increasing === null
                        ? "text-gray-500 dark:text-gray-400"
                        : card.increasing
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {card.increasing !== null &&
                      (card.increasing ? (
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 mr-1" />
                      ))}
                    {card.change}
                  </p>
                </div>
              </div>
              <div className={`h-1 ${card.color}`}></div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Recent Activity
          </h2>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New user registered
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    John Doe created an account
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    5 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-admin-100 dark:bg-admin-900 flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-admin-600 dark:text-admin-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Payment received
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    KES 2,400 from Jane Smith
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    1 hour ago
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Payment failed
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transaction for Michael Johnson failed
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <DocumentReportIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Report generated
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly payment report is ready
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    5 hours ago
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 text-center">
            <Link
              to="/admin/activity"
              className="text-sm font-medium text-admin-600 dark:text-admin-400 hover:text-admin-500"
            >
              View all activity
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/users/new"
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <UsersIcon className="h-8 w-8 text-admin-600 dark:text-admin-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Add User
              </span>
            </Link>
            <Link
              to="/admin/payments/new"
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <CreditCardIcon className="h-8 w-8 text-admin-600 dark:text-admin-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Record Payment
              </span>
            </Link>
            <Link
              to="/admin/reports/generate"
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <DocumentReportIcon className="h-8 w-8 text-admin-600 dark:text-admin-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Generate Report
              </span>
            </Link>
            <Link
              to="/admin/system-health"
              className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <ServerIcon className="h-8 w-8 text-admin-600 dark:text-admin-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                System Status
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
