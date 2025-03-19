import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiActivity,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import { MdPayments } from "react-icons/md";
import {
  TbShieldCheck,
  TbLogin,
  TbLogout,
  TbEdit,
  TbFileUpload,
} from "react-icons/tb";

const UserDetailsActivity = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 10;

  useEffect(() => {
    // In a real implementation, this would call an API to fetch activities
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // Mock API response
        setTimeout(() => {
          const mockActivities = [
            {
              id: "act1",
              type: "login",
              description: "User logged in",
              timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
              ipAddress: "192.168.1.1",
              userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
            {
              id: "act2",
              type: "payment",
              description: "User made a payment of KES 2,500",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 2
              ).toISOString(), // 2 hours ago
              ipAddress: "192.168.1.1",
              paymentDetails: {
                amount: 2500,
                method: "M-Pesa",
                reference: "MPE123456",
              },
            },
            {
              id: "act3",
              type: "profile",
              description: "User updated their profile information",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 5
              ).toISOString(), // 5 hours ago
              ipAddress: "192.168.1.1",
              changes: ["phone number", "address"],
            },
            {
              id: "act4",
              type: "document",
              description: "User uploaded a new document",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 24
              ).toISOString(), // 1 day ago
              ipAddress: "192.168.1.1",
              documentName: "ID Document",
            },
            {
              id: "act5",
              type: "plan",
              description: "User subscribed to Basic Health Cover",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 24 * 2
              ).toISOString(), // 2 days ago
              ipAddress: "192.168.1.1",
              planDetails: {
                name: "Basic Health Cover",
                startDate: new Date().toISOString(),
                monthlyCost: 2500,
              },
            },
            {
              id: "act6",
              type: "login",
              description: "User logged in",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 24 * 3
              ).toISOString(), // 3 days ago
              ipAddress: "192.168.1.2",
              userAgent:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
            },
            {
              id: "act7",
              type: "logout",
              description: "User logged out",
              timestamp: new Date(
                Date.now() - 1000 * 60 * 60 * 24 * 3 - 1000 * 60 * 30
              ).toISOString(), // 3 days and 30 minutes ago
              ipAddress: "192.168.1.2",
            },
          ];

          setActivities(mockActivities);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user.id]);

  // Filter activities based on type
  const filteredActivities = activities.filter(
    (activity) => filterType === "all" || activity.type === filterType
  );

  // Pagination
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = filteredActivities.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  );
  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "Just now";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return <TbLogin className="h-5 w-5 text-blue-500" />;
      case "logout":
        return <TbLogout className="h-5 w-5 text-purple-500" />;
      case "payment":
        return <MdPayments className="h-5 w-5 text-green-500" />;
      case "profile":
        return <TbEdit className="h-5 w-5 text-yellow-500" />;
      case "document":
        return <TbFileUpload className="h-5 w-5 text-pink-500" />;
      case "plan":
        return <TbShieldCheck className="h-5 w-5 text-indigo-500" />;
      default:
        return <FiActivity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Activity Log
        </h3>
        <div className="flex items-center space-x-2">
          <select
            className="shadow-sm focus:ring-admin-500 focus:border-admin-500 block sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="logout">Logouts</option>
            <option value="payment">Payments</option>
            <option value="profile">Profile Updates</option>
            <option value="document">Documents</option>
            <option value="plan">Insurance Plans</option>
          </select>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center p-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            title="Refresh"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-600"></div>
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            Loading activity logs...
          </span>
        </div>
      ) : currentActivities.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentActivities.map((activity) => (
              <li
                key={activity.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-admin-100 text-admin-800 dark:bg-admin-900 dark:text-admin-200 capitalize">
                        {activity.type}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                      {activity.ipAddress && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                          <span>IP: {activity.ipAddress}</span>
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <p>{formatDateTime(activity.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstActivity + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastActivity, filteredActivities.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredActivities.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  } mr-3`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No activity logs found.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetailsActivity;
