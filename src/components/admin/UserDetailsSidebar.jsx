import React, { useState } from "react";
import { format } from "date-fns";
import {
  FiUser,
  FiCreditCard,
  FiFileText,
  FiActivity,
  FiSettings,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiX,
} from "react-icons/fi";
import { getStatusBadge } from "../../utils/statusBadge";
// Import all tab components
import UserDetailsProfile from "./tabs/UserDetailsProfile";
import UserDetailsPlans from "./tabs/UserDetailsPlans";
import UserDetailsPayments from "./tabs/UserDetailsPayments";
import UserDetailsDocuments from "./tabs/UserDetailsDocuments";
import UserDetailsActivity from "./tabs/UserDetailsActivity";
import UserDetailsSettings from "./tabs/UserDetailsSettings";
import {
  TbActivity,
  TbCalendarDot,
  TbClockCheck,
  TbMailFilled,
  TbPhone,
  TbShieldHalfFilled,
} from "react-icons/tb";
import {
  PiClockUserDuotone,
  PiFileDuotone,
  PiFilesDuotone,
  PiGearDuotone,
  PiMapPinAreaBold,
  PiUserDuotone,
} from "react-icons/pi";
import { FaCreditCard } from "react-icons/fa";
import { HiCreditCard } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const UserDetailsSidebar = ({
  user,
  isOpen,
  onClose,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
}) => {
  // Internal state for active tab if not provided as prop
  const [internalActiveTab, setInternalActiveTab] = useState("profile");

  // Use provided activeTab and setActiveTab if available, otherwise use internal state
  const currentActiveTab = propActiveTab || internalActiveTab;
  const handleTabChange = propSetActiveTab || setInternalActiveTab;

  // If user is not provided or sidebar is not open, return null
  if (!user || !isOpen) return null;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  };

  const sidebarVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1.2,
        duration: 0.4,
      },
    },
    exit: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      console.error("Invalid date format:", error);
      return "N/A";
    }
  };

  const navItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <PiUserDuotone className="h-5 w-5" />,
    },
    {
      id: "plans",
      label: "Insurance Plans",
      icon: <TbShieldHalfFilled className="h-6 w-6" />,
    },
    {
      id: "payments",
      label: "Payments",
      icon: <HiCreditCard className="h-6 w-6" />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <PiFilesDuotone className="h-6 w-6" />,
    },
    {
      id: "activity",
      label: "Activity",
      icon: <TbActivity className="h-6 w-6" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <PiGearDuotone className="h-6 w-6" />,
    },
  ];

  // Make sure required user properties exist
  const userName = user.name || "Unknown User";
  const userRole = user.role || "member";

  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    // Create a wrapper for UserDetailsProfile to ensure plan data is passed
    if (currentActiveTab === "profile") {
      // Make sure the plan data is properly passed
      const userWithVerifiedPlan = {
        ...user,
        // Ensure plan data is explicitly included
        plan: user.plan,
      };

      return <UserDetailsProfile user={userWithVerifiedPlan} />;
    }

    switch (currentActiveTab) {
      case "profile":
        // This will not be reached due to the condition above
        return null;
      case "plans":
        return <UserDetailsPlans user={user} />;
      case "payments":
        return <UserDetailsPayments user={user} />;
      case "documents":
        return <UserDetailsDocuments user={user} />;
      case "activity":
        return <UserDetailsActivity user={user} />;
      case "settings":
        return <UserDetailsSettings user={user} />;
      default:
        return <UserDetailsProfile user={user} />;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop with animation */}
            <motion.div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75"
              onClick={onClose}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
            ></motion.div>

            {/* Sidebar with animation */}
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                className="w-screen max-w-[1400px]"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sidebarVariants}
              >
                <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                  {/* Header with close button */}
                  <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-white">
                      User Information -{" "}
                      <span className="text-admin-600">{user.name}</span>
                    </h2>
                    <motion.button
                      onClick={onClose}
                      className="rounded-md text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-admin-500"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">Close panel</span>
                      <FiX className="h-6 w-6" />
                    </motion.button>
                  </div>

                  {/* User details content */}
                  <div className="relative flex-1 px-4 py-6 overflow-y-auto">
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Sidebar navigation */}
                      <div className="w-full md:w-[25%] md:border-r md:border-gray-200 md:dark:border-gray-700 md:pr-4 mb-6 md:mb-0">
                        <div className="h-full flex flex-col">
                          {/* User Profile Header */}
                          <motion.div
                            className="text-center pb-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                          >
                            <div className="relative inline-block mb-4">
                              <motion.img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  userName
                                )}&background=random`}
                                alt={userName}
                                className="h-24 w-24 rounded-full border-4 border-admin-200 dark:border-gray-600 shadow-md"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  delay: 0.4,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              />
                              <div className="absolute bottom-1 -right-3">
                                {getStatusBadge(user.status)}
                              </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-600 dark:text-white">
                              {userName}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              System {userRole}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                              <PiClockUserDuotone className="mr-1 h-4 w-4 " />
                              Member since {formatDate(user.createdAt)}
                            </p>
                          </motion.div>

                          {/* Contact Information */}
                          <motion.div
                            className="border-t border-b border-gray-200 dark:border-gray-700 py-4 px-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                          >
                            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-400 mb-3">
                              Contact Information
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                <TbMailFilled className="flex-shrink-0 mt-0.5 mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                                <div className="font-medium">
                                  <div className="">Email Address</div>
                                  <Link
                                    to={`mailto:${user.email}`}
                                    className="text-admin-500 hover:text-admin-600 hover:underline"
                                  >
                                    {user.email || "No email provided"}
                                  </Link>
                                </div>
                              </div>
                              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                <TbPhone className="flex-shrink-0 mt-0.5 mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                                <div className="font-medium">
                                  <div className="">Phone Number</div>
                                  <Link
                                    to={`tel:${user.phone}`}
                                    className="text-admin-500 hover:text-admin-600 hover:underline"
                                  >
                                    {user.phone || "N/A"}
                                  </Link>
                                </div>
                              </div>

                              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                <TbCalendarDot className="flex-shrink-0 mt-0.5 mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                                <div>
                                  <div className="font-medium">Last seen</div>
                                  <div className="font-medium text-secondary-700">
                                    {formatDate(user.lastLogin)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Navigation */}
                          <motion.div
                            className="flex-1 py-4 px-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                          >
                            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-400 mb-3 px-2">
                              Full User Details
                            </h3>
                            <nav>
                              <div className="space-y-1">
                                {navItems.map((item, index) => (
                                  <motion.button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                                      currentActiveTab === item.id
                                        ? "bg-admin-100 text-admin-700 dark:bg-admin-900/30 dark:text-admin-400"
                                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                                    }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: 0.7 + index * 0.05,
                                      duration: 0.3,
                                    }}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <span
                                      className={`mr-3 ${
                                        currentActiveTab === item.id
                                          ? "text-admin-500 dark:text-admin-400"
                                          : "text-gray-400 dark:text-gray-400"
                                      }`}
                                    >
                                      {item.icon}
                                    </span>
                                    {item.label}
                                  </motion.button>
                                ))}
                              </div>
                            </nav>
                          </motion.div>
                        </div>
                      </div>

                      {/* Tab Content Area */}
                      <motion.div
                        className="flex-1 md:pl-6 md:w-[75%]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        {renderTabContent()}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDetailsSidebar;
