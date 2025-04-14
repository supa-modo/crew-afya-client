import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TbActivity,
  TbBus,
  TbCalendarEvent,
  TbCreditCardPay,
  TbRoute,
  TbShieldCheckFilled,
  TbHomeDot,
  TbIdBadge2,
  TbChevronRight,
  TbDashboard,
  TbClock,
  TbStarFilled,
} from "react-icons/tb";
import { PiUserCircle, PiUserDuotone, PiUsersDuotone } from "react-icons/pi";
import { MdPayments, MdSpaceDashboard } from "react-icons/md";
import {
  getUserDocuments,
  deleteUserDocument,
} from "../services/documentService";
import ChangeFrequencyModal from "../components/payment/ChangeFrequencyModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import {
  getUserSubscription,
  getCoverageUtilization,
  saveSubscription,
  updateSubscription,
} from "../services/subscriptionService";
import { getUserClaims, getCoverageLimits } from "../services/claimsService";

import UnionMembershipModal from "../components/UnionMembershipModal";
import OverviewTab from "../components/dashboard/OverviewTab";
import MedicalCoverTab from "../components/dashboard/MedicalCoverTab";
import MembershipCard from "../components/dashboard/MembershipCard";

const DashboardPage = () => {
  const { user } = useAuth();
  const [userSubscription, setUserSubscription] = useState(null);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState("April 15, 2025");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [coverageUtilization, setCoverageUtilization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Claims and coverage states
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState(null);
  const [coverageLimits, setCoverageLimits] = useState(null);
  const [limitsLoading, setLimitsLoading] = useState(false);
  const [limitsError, setLimitsError] = useState(null);

  // Document states
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

  // Membership states
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [hasPaidMembership, setHasPaidMembership] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user || !user.id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Get subscription from server
        const response = await getUserSubscription(user.id);

        if (
          response &&
          response.success &&
          response.data &&
          response.data.plan
        ) {
          // Normalize the data structure
          const normalizedSubscription = {
            plan: response.data.plan,
            frequency:
              response.data.frequency ||
              response.data.paymentFrequency ||
              "daily",
            status: response.data.status || "ACTIVE",
            startDate: response.data.startDate,
            endDate: response.data.endDate,
          };

          setUserSubscription(normalizedSubscription);

          // Set next payment date if available
          if (response.data.nextPaymentDate) {
            setNextPaymentDate(new Date(response.data.nextPaymentDate));
          }

          // Load coverage utilization data
          loadCoverageUtilization(user.id);
        } else {
          // No subscription found
          setUserSubscription(null);
          console.warn("No active subscription found for user");
        }
      } catch (error) {
        console.error("Error loading subscription:", error);
        setError("Failed to load subscription data. Please try again later.");
        setUserSubscription(null);
      } finally {
        setIsLoading(false);
      }
    };

    const loadCoverageUtilization = async (userId) => {
      try {
        // Fetch coverage utilization data
        const coverageData = await getCoverageUtilization(userId);
        if (coverageData && coverageData.success && coverageData.data) {
          setCoverageUtilization(coverageData.data);
        } else if (coverageData && !coverageData.success) {
          console.warn(
            "Failed to load coverage utilization:",
            coverageData.message
          );
          // The getCoverageUtilization function now returns default data structure
        }

        // Fetch user claims
        setClaimsLoading(true);
        try {
          const claimsResponse = await getUserClaims(userId);
          if (claimsResponse && claimsResponse.success) {
            setClaims(claimsResponse.data?.claims || []);
          } else {
            setClaimsError(claimsResponse?.message || "Failed to fetch claims");
          }
        } catch (claimsErr) {
          console.error("Error fetching user claims:", claimsErr);
          setClaimsError("An error occurred while fetching claims");
        } finally {
          setClaimsLoading(false);
        }

        // Fetch coverage limits
        setLimitsLoading(true);
        try {
          const limitsResponse = await getCoverageLimits(userId);
          if (limitsResponse && limitsResponse.success) {
            setCoverageLimits(limitsResponse.data);
          } else {
            setLimitsError(
              limitsResponse?.message || "Failed to fetch coverage limits"
            );
          }
        } catch (limitsErr) {
          console.error("Error fetching coverage limits:", limitsErr);
          setLimitsError("An error occurred while fetching coverage limits");
        } finally {
          setLimitsLoading(false);
        }
      } catch (utilError) {
        console.error("Error loading coverage utilization:", utilError);
      }
    };

    loadSubscription();
    fetchDocuments();

    // Check if user has paid membership based on the membershipStatus from user object
    if (user && user.membershipStatus === "active") {
      setHasPaidMembership(true);
    } else if (user && user.membershipStatus === "pending") {
      // If membership status is pending, show the membership modal
      setShowMembershipModal(true);
      setHasPaidMembership(false);
    }
  }, [user]);

  // We've removed the mock data function as we're now using real data from the API

  const fetchDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      const response = await getUserDocuments();

      // Check if response exists and has data
      if (response && response.data) {
        setDocuments(response.data || []);
      } else {
        // Handle case where response structure is different
        setDocuments(response || []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleOpenFrequencyModal = () => {
    setIsFrequencyModalOpen(true);
  };

  const handleCloseFrequencyModal = () => {
    setIsFrequencyModalOpen(false);
  };

  const handleFrequencyChanged = async (newFrequency) => {
    if (!userSubscription || !userSubscription.plan || !user || !user.id)
      return;

    try {
      setIsSubmitting(true);
      console.log("Updating subscription frequency to:", newFrequency);

      // First, get the actual subscription ID from the server
      const subscriptionResponse = await getUserSubscription(user.id);

      if (
        !subscriptionResponse ||
        !subscriptionResponse.success ||
        !subscriptionResponse.data ||
        !subscriptionResponse.data.id
      ) {
        console.error(
          "Failed to get subscription details:",
          subscriptionResponse
        );
        throw new Error(
          "Could not retrieve subscription details. Please refresh and try again."
        );
      }

      const subscriptionId = subscriptionResponse.data.id;
      console.log("Found subscription ID:", subscriptionId);

      // Now update the subscription using the updateSubscription function instead of saveSubscription
      const response = await updateSubscription(subscriptionId, {
        frequency: newFrequency,
      });

      if (response && response.success && response.data) {
        console.log("Subscription updated successfully:", response.data);

        // Update local state with the server response
        const updatedSubscription = {
          ...userSubscription,
          frequency: newFrequency,
          paymentFrequency: newFrequency,
        };

        setUserSubscription(updatedSubscription);

        // Update next payment date if available in the response
        if (response.data.nextPaymentDate) {
          setNextPaymentDate(response.data.nextPaymentDate);
        } else {
          // Calculate next payment date based on frequency if not provided by server
          const today = new Date();
          let nextDate;

          if (newFrequency === "daily") {
            nextDate = new Date(today);
            nextDate.setDate(today.getDate() + 1);
          } else if (newFrequency === "weekly") {
            nextDate = new Date(today);
            nextDate.setDate(today.getDate() + 7);
          } else if (newFrequency === "monthly") {
            nextDate = new Date(today);
            nextDate.setMonth(today.getMonth() + 1);
          } else if (newFrequency === "annual") {
            nextDate = new Date(today);
            nextDate.setFullYear(today.getFullYear() + 1);
          }

          if (nextDate) {
            const options = { year: "numeric", month: "long", day: "numeric" };
            setNextPaymentDate(nextDate.toLocaleDateString("en-US", options));
          }
        }

        // Close the modal
        handleCloseFrequencyModal();
      } else {
        console.error("Failed to update subscription:", response);
        throw new Error(
          response?.message || "Failed to update subscription frequency"
        );
      }
    } catch (error) {
      console.error("Error updating subscription frequency:", error);
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        setIsSubmitting(true);
        await deleteUserDocument(documentToDelete.id);
        await fetchDocuments();
      } catch (error) {
        console.error("Failed to delete document:", error);
      } finally {
        setIsSubmitting(false);
        setShowDeleteModal(false);
        setDocumentToDelete(null);
      }
    }
  };

  const handleDeleteDocument = async (documentId) => {
    const document = documents.find((doc) => doc.id === documentId);
    if (document) {
      handleDeleteClick(document);
    }
  };

  // Handler for membership payment
  const handleMembershipPayment = (success) => {
    if (success) {
      setHasPaidMembership(true);
      localStorage.setItem("unionMembershipPaid", "true");
    }
    setShowMembershipModal(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50/80 to-white/70 dark:from-gray-900/70 dark:to-gray-800/70 min-h-screen pb-10">
      {/* Main dashboard content */}
      <div className="pt-20 sm:pt-24">
        {/* Breadcrumb */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-600 flex items-center transition-colors duration-200"
                >
                  <TbHomeDot className="h-5 w-5 mr-2" />
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <TbChevronRight className="w-4 h-4" />
                <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                  Dashboard
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header section with welcome message and quick actions */}
        <div className="max-w-screen-2xl mx-auto px-0 sm:px-3 lg:px-8 mb-6">
          {/* Header with gradient background */}
          <div className="px-3 py-5 sm:px-4 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-start space-x-3">
              <div className="hidden md:flex h-14 w-14 rounded-full bg-primary-600/20 backdrop-blur-sm items-center justify-center flex-shrink-0">
                <PiUserDuotone className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600 flex items-center">
                  Welcome, {user?.firstName + " " + user?.lastName || "Logged inUser"}!
                </h1>
                <p className="text-gray-500 dark:text-gray-300 font-medium text-sm mt-1 max-w-2xl">
                  Manage your Union membership, medical coverage, and loan
                  applications all in one place.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 flex space-x-3 sm:space-x-4">
              <Link
                to="/payments"
                className="inline-flex items-center px-4 sm:px-5 py-3 bg-secondary-600 border border-secondary-500 rounded-[0.6rem] text-xs sm:text-sm font-medium text-white hover:bg-secondary-700 transition-all duration-200 shadow-sm"
              >
                <TbCreditCardPay className="mr-2 h-5 sm:h-5 w-5 sm:w-5" />
                Make a Payment
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center px-4 sm:px-5 py-3 bg-primary-600 backdrop-blur-sm border border-gray-200 dark:border-primary-700 rounded-[0.6rem] text-xs sm:text-sm font-medium text-white hover:bg-gray-700 transition-all duration-200 shadow-sm"
              >
                <PiUserCircle className="mr-2 h-5 sm:h-5 w-5 sm:w-5" />
                View Profile
              </Link>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl rounded-b-none sm:rounded-b-3xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Cards section */}
            <div className="px-3 sm:px-6 py-5 sm:py-6">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Membership Card section */}
                <div className="lg:w-[55%]">
                  <MembershipCard user={user} />
                </div>

                {/* Stats section */}
                <div className="lg:w-[45%] flex flex-col gap-5">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-sm px-5 py-4 border border-emerald-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-emerald-500/20 transition-all duration-300"></div>
                      <div className="relative flex justify-between z-10">
                        <div>
                          <p className="text-[0.65rem] sm:text-[0.7rem] text-emerald-700 dark:text-emerald-400 font-medium uppercase tracking-wider mb-1">
                            Union Membership
                          </p>
                          <h3 className="text-lg sm:text-xl capitalize font-bold text-emerald-800 dark:text-white flex items-center">
                            {user?.membershipStatus || "Active"}
                            <span className="ml-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          </h3>
                          <p className="text-[0.7rem] sm:text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1 font-medium">
                            Registered:{" "}
                            <span className="font-semibold">
                              {formatDate(user?.membershipDate) || "---------"}
                            </span>
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-emerald-200 dark:bg-emerald-900/70 flex items-center justify-center">
                          <TbIdBadge2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-sm px-5 py-4 border border-blue-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-blue-500/20 transition-all duration-300"></div>
                      <div className="relative flex justify-between z-10">
                        <div>
                          <p className="text-[0.65rem] sm:text-[0.7rem] text-blue-700 dark:text-blue-400 font-medium uppercase tracking-wider mb-1">
                            Medical Cover
                          </p>
                          <h3 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-white">
                            {userSubscription?.plan?.name || "No Active Plan"}
                          </h3>
                          <p className="text-[0.7rem] sm:text-xs text-blue-700/70 dark:text-blue-400/70 mt-1 font-medium">
                            {userSubscription?.startDate
                              ? `Active since ${formatDate(
                                  userSubscription?.startDate
                                )}`
                              : "Not activated"}
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-200 dark:bg-blue-800/70 flex items-center justify-center">
                          <TbShieldCheckFilled className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loan status */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-sm p-4 sm:px-5 border border-gray-200 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-gray-500/10 transition-all duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center">
                          <TbClock className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
                          Upcoming Payments
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {activeLoans.length || 0} Active
                        </span>
                      </div>

                      {activeLoans && activeLoans.length > 0 ? (
                        <div className="space-y-3">
                          {activeLoans.map((loan, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                  <MdPayments className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                                    {loan.type || "Loan Payment"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Due: {formatDate(loan.dueDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                  KES {loan.amount}
                                </p>
                                <p
                                  className={`text-xs ${
                                    loan.status === "overdue"
                                      ? "text-red-500"
                                      : "text-emerald-500"
                                  }`}
                                >
                                  {loan.status === "overdue"
                                    ? "Overdue"
                                    : "On time"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-white/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No active loans or upcoming payments
                          </p>
                        </div>
                      )}

                      <div className="mt-2 text-right">
                        <Link
                          to="/loans"
                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center"
                        >
                          View all loans
                          <TbChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs - Enhanced Design */}
        <div className="max-w-screen-2xl mx-auto px-0 sm:px-3 lg:px-8 mb-8">
          <div className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Tab Navigation - Enhanced */}
            <div className="relative">
              <div className="flex items-center justify-between md:justify-start overflow-x-auto scrollbar-hide">
                {[
                  {
                    id: "overview",
                    label: "Dashboard ",
                    icon: <MdSpaceDashboard className="h-5 w-5" />,
                    color: "from-primary-500/10 to-primary-600/10",
                    activeColor: "bg-primary-600 text-white",
                    iconColor: "text-primary-600 dark:text-primary-400",
                  },
                  {
                    id: "medical",
                    label: "Medical ",
                    icon: <TbShieldCheckFilled className="h-5 w-5" />,
                    color: "from-blue-500/10 to-blue-600/10",
                    activeColor: "bg-blue-600 text-white",
                    iconColor: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    id: "membership",
                    label: " Membership",
                    icon: <PiUsersDuotone className="h-5 w-5" />,
                    color: "from-emerald-500/10 to-emerald-600/10",
                    activeColor: "bg-emerald-600 text-white",
                    iconColor: "text-emerald-600 dark:text-emerald-400",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`group relative min-w-[160px] sm:min-w-[180px] md:min-w-[200px] flex items-center justify-center px-4 py-4 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span
                        className={`flex items-center justify-center h-9 sm:h-11 w-9 sm:w-11 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? tab.activeColor
                            : `bg-gradient-to-br ${tab.color} ${tab.iconColor}`
                        }`}
                      >
                        {tab.icon}
                      </span>
                      <span className="font-medium text-xs sm:text-sm flex flex-col items-center">
                        {(() => {
                          const words = tab.label.split(" ");
                          const firstWord = words[0];
                          const restWords = words.slice(1).join(" ");
                          return (
                            <>
                              <span className="block">{firstWord}</span>
                              <span className="block">{restWords}</span>
                            </>
                          );
                        })()}
                      </span>

                      {/* Glowing Active Indicator */}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-full h-1 rounded-full bg-primary-500 shadow-lg shadow-primary-500/30"></span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Area */}
            <div className="px-4 sm:px-6 py-6">
              <div className="transition-all duration-300 ease-in-out">
                {/* Overview Tab Content */}
                {activeTab === "overview" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-5 rounded-2xl">
                        <h2 className="text-base sm:text-lg md:text-xl text-primary-800 dark:text-white font-bold flex items-center mb-2">
                          <TbStarFilled className="h-5 w-5 mr-2 text-amber-500" />
                          Dashboard Overview
                        </h2>
                        <p className="text-[0.8rem] sm:text-sm text-gray-700 dark:text-gray-300">
                          View and manage your membership details, upcoming
                          payments, and documents.
                        </p>
                      </div>
                    </div>
                    <OverviewTab
                      nextPaymentDate={formatDate(nextPaymentDate)}
                      userSubscription={userSubscription}
                      handleOpenFrequencyModal={handleOpenFrequencyModal}
                      documents={documents}
                      isLoadingDocs={isLoadingDocs}
                      handleDeleteDocument={handleDeleteDocument}
                      isSubmitting={isSubmitting}
                      isLoadingCoverage={isLoading}
                    />
                  </div>
                )}

                {/* Medical Cover Tab Content */}
                {activeTab === "medical" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-5 rounded-2xl">
                        <h2 className="text-xl text-blue-800 dark:text-white font-bold flex items-center mb-2">
                          <TbShieldCheckFilled className="h-5 w-5 mr-2 text-blue-600" />
                          Medical Coverage
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          View and manage your medical coverage plan,
                          dependents, and claims.
                        </p>
                      </div>
                    </div>
                    <MedicalCoverTab
                      userId={user?.id}
                      userSubscription={userSubscription}
                      coverageUtilization={coverageUtilization}
                      isLoading={isLoading}
                      error={error}
                      handleOpenFrequencyModal={() =>
                        setIsFrequencyModalOpen(true)
                      }
                      claims={claims}
                      claimsLoading={claimsLoading}
                      claimsError={claimsError}
                      coverageLimits={coverageLimits}
                      limitsLoading={limitsLoading}
                      limitsError={limitsError}
                    />
                  </div>
                )}

                {/* Membership Tab Content */}
                {activeTab === "membership" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 p-5 rounded-2xl">
                        <h2 className="text-xl text-emerald-800 dark:text-white font-bold flex items-center mb-2">
                          <PiUsersDuotone className="h-5 w-5 mr-2 text-emerald-600" />
                          Union Membership
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Manage your Matatu Workers Union membership details
                          and benefits.
                        </p>
                      </div>
                    </div>
                    <div className="text-center py-8 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                        <PiUsersDuotone className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Membership Status: {user?.membershipStatus || "Active"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                        Your Union membership is currently active. Access
                        exclusive benefits, union services and discounts for
                        Matatu Workers.
                      </p>
                      <button
                        onClick={() => navigate("/payments")}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                      >
                        <TbIdBadge2 className="mr-2 h-5 w-5" />
                        Manage Membership
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Frequency Modal */}
      <ChangeFrequencyModal
        isOpen={isFrequencyModalOpen}
        onClose={handleCloseFrequencyModal}
        onFrequencyChanged={handleFrequencyChanged}
        currentPlan={userSubscription}
        currentFrequency={userSubscription?.frequency || "monthly"}
        isSubmitting={isSubmitting}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Document"
        message={`Are you sure you want to delete "${
          documentToDelete?.name || "this document"
        }"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDocumentToDelete(null);
        }}
        isLoading={isSubmitting}
      />

      {/* Union Membership Modal */}
      <UnionMembershipModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        onPaymentComplete={handleMembershipPayment}
      />
    </div>
  );
};

export default DashboardPage;
