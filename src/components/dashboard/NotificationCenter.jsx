import React from "react";
import { PiUsersDuotone } from "react-icons/pi";
import { TbBell, TbMoneybag, TbCreditCard } from "react-icons/tb";

const NotificationCenter = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="bg-orange-600 p-4">
          <h3 className="text-white font-semibold flex items-center">
            <TbBell className="mr-2 h-5 w-5" />
            Notifications
          </h3>
        </div>
        <div className="p-6 text-center">
          <TbBell className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            No new notifications
          </p>
        </div>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment":
        return <TbMoneybag className="h-6 w-6 text-orange-500" />;
      case "union":
        return <PiUsersDuotone className="h-6 w-6 text-blue-500" />;
      case "loan":
        return <TbCreditCard className="h-6 w-6 text-purple-500" />;
      default:
        return <TbBell className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="bg-orange-600 p-4">
        <h3 className="text-white font-semibold flex items-center">
          <TbBell className="mr-2 h-5 w-5" />
          Notifications
        </h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 ${
              !notification.isRead ? "bg-orange-50 dark:bg-orange-900/10" : ""
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div
                  className={`h-10 w-10 rounded-full ${
                    notification.type === "payment"
                      ? "bg-orange-100 dark:bg-orange-900/30"
                      : notification.type === "union"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-purple-100 dark:bg-purple-900/30"
                  } flex items-center justify-center`}
                >
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(notification.date)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
