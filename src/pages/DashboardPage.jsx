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
} from "react-icons/tb";
import { PiUserCircle, PiUserDuotone, PiUsersDuotone } from "react-icons/pi";
import { MdPayments } from "react-icons/md";
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

import LoanStatus from "../components/dashboard/LoanStatus";
import UnionMembershipModal from "../components/UnionMembershipModal";
import OverviewTab from "../components/dashboard/OverviewTab";
import MedicalCoverTab from "../components/dashboard/MedicalCoverTab";

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
            setClaimsError(claimsResponse?.message || 'Failed to fetch claims');
          }
        } catch (claimsErr) {
          console.error('Error fetching user claims:', claimsErr);
          setClaimsError('An error occurred while fetching claims');
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
            setLimitsError(limitsResponse?.message || 'Failed to fetch coverage limits');
          }
        } catch (limitsErr) {
          console.error('Error fetching coverage limits:', limitsErr);
          setLimitsError('An error occurred while fetching coverage limits');
        } finally {
          setLimitsLoading(false);
        }
      } catch (utilError) {
        console.error("Error loading coverage utilization:", utilError);
      }
    };

    loadSubscription();
    fetchDocuments();
    fetchMockData();

    // Check if user has paid membership based on the membershipStatus from user object
    if (user && user.membershipStatus === "active") {
      setHasPaidMembership(true);
    } else if (user && user.membershipStatus === "pending") {
      // If membership status is pending, show the membership modal
      setShowMembershipModal(true);
      setHasPaidMembership(false);
    }
  }, [user]);

  const fetchMockData = () => {
    // Mock notifications
    setNotifications([
      {
        id: 1,
        type: "payment",
        title: "Premium Payment Due",
        message: "Your monthly insurance premium is due in 2 days",
        date: "2023-10-15",
        isRead: false,
      },
      {
        id: 2,
        type: "union",
        title: "Member Meeting",
        message: "Quarterly union meeting scheduled for next week",
        date: "2023-10-12",
        isRead: true,
      },
      {
        id: 3,
        type: "loan",
        title: "Loan Application Approved",
        message: "Your vehicle improvement loan has been approved",
        date: "2023-10-10",
        isRead: false,
      },
    ]);

    // Mock active loans
    setActiveLoans([
      {
        id: 1,
        type: "Vehicle Improvement",
        amount: 150000,
        balance: 95000,
        monthlyPayment: 7500,
        nextPayment: "October 30, 2023",
        status: "active",
      },
    ]);
  };

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
    <div className="bg-gray-50/40 dark:bg-gray-900/40 pb-6 mt-4 sm:mt-10 min-h-screen">
      {/* Main dashboard content */}
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-600 flex items-center"
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

        <div className="max-w-screen-2xl mx-auto px-2 sm:px-3 lg:px-4 mb-4">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 sm:px-8 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex items-center space-x-2 font-lexend">
                <PiUserDuotone className="hidden md:flex mr-2 h-10 w-10 text-primary-600" />
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-[1.4rem] font-bold text-secondary-700 dark:text-secondary-500 flex items-center">
                    Welcome, {user?.firstName || "User"}!
                  </h1>
                  <p className=" text-sm  text-gray-600 dark:text-gray-400">
                    Manage your Union membership, medical coverage, and loan
                    applications all in one place.
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <Link
                  to="/payments"
                  className="inline-flex items-center px-4 sm:px-5 py-2 bg-secondary-700 border border-green-600 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white dark:text-green-200  dark:bg-secondary-900 hover:bg-secondary-800 dark:hover:bg-secondary-800 transition-colors duration-200"
                >
                  <TbCreditCardPay className="mr-2 h-5 sm:h-6 w-5 sm:w-6" />
                  Make a Payment
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-5 sm:px-6 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  <PiUserCircle className="mr-2 h-5 sm:h-6 w-5 sm:w-6" />
                  View Profile
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 px-3 sm:px-6 lg:px-6 mb-3 sm:mb-4 md:mb-6">
              <div className="md:w-[50%] bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 rounded-2xl p-5 sm:p-6 text-white shadow-md relative">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-80 text-xs sm:text-sm ">
                        Matatu Workers Union
                      </span>
                      <div className="w-1 h-1 rounded-full bg-white"></div>
                      <div className="text-xs rounded-lg text-secondary-400">
                        {user?.membershipStatus}
                      </div>
                    </div>

                    <div className="text-lg sm:text-xl font-semibold mb-4">
                      {user?.firstName} {user?.otherNames}{" "}
                      {user?.lastName || "Member"}
                    </div>
                    <div className="grid grid-cols-2 gap-10 sm:gap-8">
                      <div>
                        <div className="opacity-80 text-[0.7rem] sm:text-xs">
                          Member ID
                        </div>
                        <div className="text-[0.7rem] sm:text-xs md:text-sm text-secondary-400">
                          {user?.membershipNumber || "-------"}
                        </div>
                      </div>
                      <div>
                        <div className="opacity-80 text-[0.7rem] sm:text-xs">
                          Operation Route
                        </div>
                        <div className="text-[0.7rem] sm:text-xs md:text-sm text-amber-500">
                          {user?.route || "Thika Road"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-5 right-5 flex h-12 w-12 md:h-20 md:w-20 rounded-full bg-white/20 items-center justify-center">
                    <TbBus className="h-7 w-7 md:h-12 md:w-12 text-white" />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-4 border-t border-white/20 flex justify-between text-[0.68rem]  sm:text-xs md:text-sm">
                  <div className="flex items-center ">
                    <TbCalendarEvent className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline mr-1">Member since:</span>
                    <span className="inline sm:hidden mr-1">Since: </span>
                    <span className="text-secondary-400 ">
                      {user?.joinDate || "Jan 15, 2023"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <TbRoute className="mr-2 h-4 w-4" />
                    SACCO: {user?.sacco || "Kawangware Sacco"}
                  </div>
                </div>
              </div>

              <div className="md:w-[50%]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-3 border border-l-4 border-l-green-500">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                          Union Membership
                        </p>
                        <h3 className="text-lg sm:text-xl capitalize font-bold text-secondary-700 dark:text-white mt-1">
                          {user?.membershipStatus}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Registered:{" "}
                          <span className="font-medium">
                            {formatDate(user?.membershipDate) || "---------"}
                          </span>
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <TbIdBadge2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-3 border border-l-4 border-l-blue-500">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                          Medical Cover
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold text-primary-600 dark:text-white mt-1">
                          {userSubscription?.plan?.name || "No Active Plan"}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Active since {formatDate(userSubscription?.startDate)}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <TbShieldCheckFilled className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
                <LoanStatus loans={activeLoans} />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="md:max-w-screen-2xl mx-auto md:px-4 mb-6">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl md:rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Tab Navigation - Enhanced Style */}
            <div className="relative">
              <div className="flex items-center justify-between md:justify-start border-b border-gray-200 dark:border-gray-700">
                {[
                  {
                    id: "overview",
                    label: "Overview",
                    icon: <TbActivity className="h-5 w-5" />,
                  },

                  {
                    id: "medical",
                    label: "Medical Cover",
                    icon: <TbShieldCheckFilled className="h-5 w-5" />,
                  },
                  {
                    id: "membership",
                    label: "Membership",
                    icon: <PiUsersDuotone className="h-5 w-5" />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`group relative min-w-[120px] sm:min-w-[160px] flex items-center justify-center px-4 py-3 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "text-primary-600 dark:text-primary-400 bg-gradient-to-b from-transparent to-primary-100 dark:to-primary-900/20"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`flex items-center justify-center h-10 md:h-11 w-10 md:w-11 rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-gray-700/70 dark:text-gray-400 dark:group-hover:bg-gray-600/70"
                        }`}
                      >
                        {tab.icon}
                      </span>
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Area - Enhanced Padding and Animation */}
            <div className="px-2 sm:px-4 py-4">
              <div className="transition-all duration-300 ease-in-out">
                {/* Overview Tab Content */}
                {activeTab === "overview" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6 px-3">
                      <p className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        View and manage your membership details, upcoming
                        payments, and documents.
                      </p>
                    </div>
                    <OverviewTab
                      nextPaymentDate={formatDate(nextPaymentDate)}
                      userSubscription={userSubscription}
                      handleOpenFrequencyModal={handleOpenFrequencyModal}
                      documents={documents}
                      isLoadingDocs={isLoadingDocs}
                      handleDeleteDocument={handleDeleteDocument}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                )}

                {/* Membership Tab Content */}
                {/* {activeTab === "membership" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage your Matatu Workers Union membership details and
                        benefits.
                      </p>
                    </div>
                    <MembershipTab hasPaidMembership={hasPaidMembership} />
                  </div>
                )} */}

                {/* Medical Cover Tab Content */}
                {activeTab === "medical" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        View and manage your medical coverage plan, dependents,
                        and claims.
                      </p>
                    </div>
                    <MedicalCoverTab
                      userSubscription={userSubscription}
                      coverageUtilization={coverageUtilization}
                      isLoading={isLoading}
                      error={error}
                      handleOpenFrequencyModal={() => setIsFrequencyModalOpen(true)}
                      claims={claims}
                      claimsLoading={claimsLoading}
                      claimsError={claimsError}
                      coverageLimits={coverageLimits}
                      limitsLoading={limitsLoading}
                      limitsError={limitsError}
                    />
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
