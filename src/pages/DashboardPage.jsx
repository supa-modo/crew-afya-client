import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TbShieldCheckFilled,
  TbHomeDot,
  TbIdBadge2,
  TbChevronRight,
  TbClock,
  TbStarFilled,
  TbArrowRight,
} from "react-icons/tb";
import { PiUserDuotone, PiUsersDuotone, PiUsersThreeDuotone } from "react-icons/pi";
import { MdPayments } from "react-icons/md";
import { BsFillCreditCardFill } from "react-icons/bs";
import {
  getUserDocuments,
  deleteUserDocument,
} from "../services/documentService";
import ChangeFrequencyModal from "../components/payment/ChangeFrequencyModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import PaymentReceiptModal from "../components/admin/adminPaymentsPageComponents/PaymentReceiptModal";
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
import { MpesaIcon } from "../components/common/icons";

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

  // Receipt modal states
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || !user.id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Create a batch load function to fetch multiple resources in parallel
        const [subscriptionResponse, documentsResponse] = await Promise.all([
          getUserSubscription(user.id),
          getUserDocuments(),
        ]);

        // Process subscription data
        if (
          subscriptionResponse &&
          subscriptionResponse.success &&
          subscriptionResponse.data &&
          subscriptionResponse.data.plan
        ) {
          // Normalize the data structure
          const normalizedSubscription = {
            id: subscriptionResponse.data.id,
            plan: subscriptionResponse.data.plan,
            frequency:
              subscriptionResponse.data.frequency ||
              subscriptionResponse.data.paymentFrequency ||
              "daily",
            status: subscriptionResponse.data.status || "ACTIVE",
            startDate: subscriptionResponse.data.startDate,
            nextPaymentDate: subscriptionResponse.data.nextPaymentDate,
            endDate: subscriptionResponse.data.endDate,
          };

          setUserSubscription(normalizedSubscription);

          // Set next payment date if available
          if (subscriptionResponse.data.nextPaymentDate) {
            setNextPaymentDate(
              new Date(subscriptionResponse.data.nextPaymentDate)
            );
          }

          // Load coverage utilization data and related information in parallel
          const [coverageData, claimsResponse, limitsResponse] =
            await Promise.all([
              getCoverageUtilization(user.id),
              getUserClaims(user.id),
              getCoverageLimits(user.id),
            ]);

          // Process coverage utilization data
          if (coverageData && coverageData.success && coverageData.data) {
            setCoverageUtilization(coverageData.data);
          } else if (coverageData && !coverageData.success) {
            console.warn(
              "Failed to load coverage utilization:",
              coverageData.message
            );
          }

          // Process claims data
          if (claimsResponse && claimsResponse.success) {
            setClaims(claimsResponse.data?.claims || []);
          } else {
            setClaimsError(claimsResponse?.message || "Failed to fetch claims");
          }

          // Process coverage limits data
          if (limitsResponse && limitsResponse.success) {
            setCoverageLimits(limitsResponse.data);
          } else {
            setLimitsError(
              limitsResponse?.message || "Failed to fetch coverage limits"
            );
          }
        } else {
          // No subscription found
          setUserSubscription(null);
          console.warn("No active subscription found for user");
        }

        // Process documents data
        if (documentsResponse && documentsResponse.data) {
          setDocuments(documentsResponse.data || []);
        } else {
          // Handle case where response structure is different
          setDocuments(documentsResponse || []);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
        setClaimsLoading(false);
        setLimitsLoading(false);
        setIsLoadingDocs(false);
      }
    };

    loadDashboardData();

    // Check if user has paid membership based on the membershipStatus from user object
    if (user && user.membershipStatus === "active") {
      setHasPaidMembership(true);
    } else if (user && user.membershipStatus === "pending") {
      // If membership status is pending, show the membership modal
      setShowMembershipModal(true);
      setHasPaidMembership(false);
    }
  }, [user]);

  const handleOpenFrequencyModal = () => {
    setIsFrequencyModalOpen(true);
  };

  const handleCloseFrequencyModal = () => {
    setIsFrequencyModalOpen(false);
  };

  const handleFrequencyChanged = async (newFrequency) => {
    if (!userSubscription || !user || !user.id) return;

    try {
      setIsSubmitting(true);
      console.log("Updating subscription frequency to:", newFrequency);

      // Already have the subscription ID from the loadDashboardData function
      const subscriptionId = userSubscription.id;

      if (!subscriptionId) {
        throw new Error("Subscription ID not found");
      }

      // Call the API to update the subscription
      const response = await updateSubscription(subscriptionId, {
        frequency: newFrequency,
      });

      // Update state with the new frequency
      if (response && response.success) {
        setUserSubscription((prev) => ({
          ...prev,
          frequency: newFrequency,
        }));

        handleCloseFrequencyModal();
        // Success toast
        showSuccessToast("Payment frequency updated successfully");
      } else {
        throw new Error(
          response?.message || "Failed to update payment frequency"
        );
      }
    } catch (error) {
      console.error("Error updating frequency:", error);
      showErrorToast(
        error.message || "Failed to update payment frequency. Please try again."
      );
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

  // Handler for membership payment
  const handleMembershipPayment = (success) => {
    if (success) {
      setHasPaidMembership(true);
      localStorage.setItem("unionMembershipPaid", "true");
    }
    setShowMembershipModal(false);
  };

  // Handle viewing payment receipt
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
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
          <div className="px-3 py-5 sm:px-4 sm:py-6 flex flex-col lg:flex-row lg:items-center md:justify-between">
            <div className="flex items-start space-x-3">
              <div className="hidden md:flex h-14 w-14 rounded-full bg-primary-600/20 backdrop-blur-sm items-center justify-center flex-shrink-0">
                <PiUserDuotone className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600 flex items-center">
                  Welcome,{" "}
                  {user?.firstName + " " + user?.lastName || "Logged inUser"}!
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm md:text-base mt-1 max-w-3xl">
                  Manage your Union membership, medical coverage, and loan
                  applications all in one place.
                </p>
              </div>
            </div>
            <div className="mt-5 lg:mt-0 flex space-x-3 sm:space-x-4">
              <Link
                to="/payments"
                className="w-full  px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-secondary-700/90 to-secondary-700 dark:from-secondary-700/90 dark:to-secondary-800 rounded-lg text-[0.8rem] sm:text-sm font-medium text-white hover:bg-secondary-700 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center justify-center">
                  <BsFillCreditCardFill className="mr-2 h-5 sm:h-5 w-5 sm:w-5" />
                  Make a Payment
                  <TbArrowRight className="ml-2 h-3.5 w-3.5" />
                </div>
              </Link>
              {/* <Link
                to="/profile"
                className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-3 bg-primary-600 backdrop-blur-sm border border-gray-200 dark:border-primary-700 rounded-lg text-xs sm:text-sm font-medium text-white hover:bg-gray-700 transition-all duration-200 shadow-sm"
              >
                <PiUserDuotone className="mr-2 h-5 sm:h-5 w-5 sm:w-5" />
                View Profile
              </Link> */}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl rounded-b-none sm:rounded-b-3xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Cards section */}
            <div className="px-2 sm:px-4 md:px-6 py-5 sm:py-6">
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
                    label: "Overview ",
                    color: "from-primary-500/10 to-primary-600/10",
                    activeColor:
                      "bg-gradient-to-r from-primary-600/15 via-primary-600/10 to-white dark:from-primary-900/80 dark:via-primary-900/50 dark:to-gray-800",
                  },
                  {
                    id: "medical",
                    label: "Medical ",
                    color: "from-blue-500/10 to-blue-600/10",
                    activeColor:
                      "bg-gradient-to-r from-white via-primary-600/20 to-white dark:from-gray-800 dark:via-primary-900/80 dark:to-gray-800",
                  },
                  {
                    id: "membership",
                    label: " Membership",
                    color: "from-emerald-500/10 to-emerald-600/10",
                    activeColor:
                      "bg-gradient-to-r from-white via-primary-600/10 to-primary-600/20 dark:from-gray-800 dark:via-primary-900/50 dark:to-primary-900/80",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`group relative w-full min-w-[110px] sm:min-w-[180px] md:min-w-[200px] flex items-center justify-center px-4 py-6 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? `text-primary-600 dark:text-white ${tab.activeColor}`
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="">
                      <span className="font-medium text-sm md:text-base">
                        {tab.label}
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
            <div className="px-2 sm:px-6 py-6">
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
                      isSubmitting={isSubmitting}
                      isLoadingCoverage={isLoading}
                      onViewReceipt={handleViewReceipt}
                      coverageUtilizationData={coverageUtilization}
                    />
                  </div>
                )}

                {/* Medical Cover Tab Content */}
                {activeTab === "medical" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 sm:p-5 rounded-2xl">
                        <h2 className="text-base sm:text-lg md:text-xl text-primary-700 dark:text-white font-bold flex items-center mb-1 sm:mb-2">
                          <TbShieldCheckFilled className="h-5 w-5 mr-2 text-primary-600" />
                          Medical Coverage
                        </h2>
                        <p className="text-[0.8rem] sm:text-sm text-gray-700 dark:text-gray-300">
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
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 p-4 sm:p-5 rounded-2xl">
                        <h2 className="text-lg sm:text-xl text-emerald-800 dark:text-white font-bold flex items-center mb-2">
                          <PiUsersThreeDuotone className="h-6 w-6 mr-2 text-emerald-600" />
                          Union Membership
                        </h2>
                        <p className="text-[0.83rem] sm:text-sm text-gray-700 dark:text-gray-300">
                          Manage your Matatu Workers Union membership details
                          and benefits.
                        </p>
                      </div>
                    </div>
                    <div className="text-center py-6 sm:py-8 px-2 sm:px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                        <PiUsersDuotone className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-secondary-700 dark:text-white mb-2">
                        Membership Status: {user?.membershipStatus || "Active"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-4 sm:mb-6">
                        Your Union membership is currently active. Access
                        exclusive benefits, union services and discounts for
                        Matatu Workers.
                      </p>

                      <div className="flex flex-col lg:flex-row gap-2 md:gap-3 justify-center">
                        <button
                          onClick={() => navigate("/payments")}
                          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-[0.83rem] sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                        >
                          <TbIdBadge2 className="mr-2 h-5 w-5" />
                          Manage Membership
                        </button>
                        <button
                          onClick={() => navigate("/profile")}
                          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-[0.83rem] sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                        >
                          <PiUserDuotone className="mr-2 h-5 w-5" />
                          View My Profile
                        </button>
                      </div>
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

      {/* Payment Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <PaymentReceiptModal
          payment={selectedPayment}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
