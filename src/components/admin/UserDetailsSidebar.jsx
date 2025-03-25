import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { getStatusBadge } from "../../utils/statusBadge";
// Import all tab components
import UserDetailsProfile from "./adminUserSidebarTabs/UserDetailsProfile";
import UserDetailsPayments from "./adminUserSidebarTabs/UserDetailsPayments";
import UserDetailsDocuments from "./adminUserSidebarTabs/UserDetailsDocuments";
import UserDetailsActivity from "./adminUserSidebarTabs/UserDetailsActivity";
import UserDetailsSettings from "./adminUserSidebarTabs/UserDetailsSettings";
import {
  TbActivity,
  TbCalendarDot,
  TbMailFilled,
  TbPhone,
} from "react-icons/tb";
import {
  PiClockUserDuotone,
  PiFilesDuotone,
  PiGearDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import { HiCreditCard } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUserById } from "../../services/userService";
import { formatDateWithTime } from "../../utils/formatDate";

const UserDetailsSidebar = ({
  user,
  isOpen,
  onClose,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onUserUpdate,
}) => {
  // Internal state for active tab if not provided as prop
  const [internalActiveTab, setInternalActiveTab] = useState("profile");

  // Use provided activeTab and setActiveTab if available, otherwise use internal state
  const currentActiveTab = propActiveTab || internalActiveTab;
  const handleTabChange = propSetActiveTab || setInternalActiveTab;

  // Fetch user details when sidebar opens - moved before conditional return
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.id && isOpen && !user.insuranceCoverage) {
        try {
          const response = await getUserById(user.id);
          if (response.success && response.data) {
            // Update the user object with full details
            const updatedUser = response.data;
            // If component receives onUserUpdate prop, call it with updated user data
            if (typeof onUserUpdate === "function") {
              onUserUpdate(updatedUser);
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [user?.id, isOpen, onUserUpdate]);

  // Early return after all hooks have been called
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

  const navItems = [
    {
      id: "profile",
      label: "Profile & Insurance Coverage",
      icon: <PiUserDuotone className="h-5 w-5" />,
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

  // Calculate these variables inside the render function so they update when user changes
  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.otherNames ? `${user.otherNames} ` : ""}${
          user.lastName
        }`
      : user?.name || "Unknown User";

  const userRole = user?.role || "member";
  const userPhone = user?.phoneNumber || user?.phone || "N/A";
  const userEmail = user?.email || "No email provided";
  const userStatus = user?.membershipStatus || user?.status || "pending";
  const userCreatedAt = user?.createdAt || new Date();
  const userLastLogin = user?.lastLogin || null;

  const handleUserUpdate = (updatedUser) => {
    // If component receives onUserUpdate prop, call it with updated user data
    if (typeof onUserUpdate === "function") {
      onUserUpdate(updatedUser);
    }
  };

  // Render the appropriate tab content based on the active tab
  const renderTabContent = () => {
    switch (currentActiveTab) {
      case "profile":
        return (
          <UserDetailsProfile user={user} onUserUpdate={handleUserUpdate} />
        );
      case "payments":
        return <UserDetailsPayments user={user} />;
      case "documents":
        return <UserDetailsDocuments user={user} />;
      case "activity":
        return <UserDetailsActivity user={user} />;
      case "settings":
        return (
          <UserDetailsSettings user={user} onUserUpdate={handleUserUpdate} />
        );
      default:
        return (
          <UserDetailsProfile user={user} onUserUpdate={handleUserUpdate} />
        );
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
                className="w-screen max-w-[1450px]"
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
                      <span className="text-amber-800">{userName}</span>
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
                          <motion.div className="text-center pb-5">
                            <div className="relative inline-block mb-4">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  userName
                                )}&background=random`}
                                alt={userName}
                                className="h-24 w-24 rounded-full border-4 border-admin-200 dark:border-gray-600 shadow-md"
                              />
                              <div className="absolute bottom-1 -right-3">
                                {getStatusBadge(
                                  user.isActive ? "active" : "inactive"
                                )}
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
                              Member since {formatDateWithTime(userCreatedAt)}
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
                                    to={`mailto:${userEmail}`}
                                    className="text-admin-500 hover:text-admin-600 hover:underline"
                                  >
                                    {userEmail}
                                  </Link>
                                </div>
                              </div>
                              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                <TbPhone className="flex-shrink-0 mt-0.5 mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                                <div className="font-medium">
                                  <div className="">Phone Number</div>
                                  <Link
                                    to={`tel:${userPhone}`}
                                    className="text-admin-500 hover:text-admin-600 hover:underline"
                                  >
                                    {userPhone}
                                  </Link>
                                </div>
                              </div>

                              <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                                <TbCalendarDot className="flex-shrink-0 mt-0.5 mr-3 h-5 w-5 text-gray-400 dark:text-gray-400" />
                                <div>
                                  <div className="font-medium">Last seen</div>
                                  <div className="font-medium text-secondary-700">
                                    {userLastLogin
                                      ? formatDateWithTime(userLastLogin, true)
                                      : "Never"}
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
                        transition={{ delay: 0.2, duration: 0.3 }}
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
