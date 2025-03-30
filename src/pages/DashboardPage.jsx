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
  TbUsersGroup,
} from "react-icons/tb";
import { PiUserCircle, PiUserDuotone, PiUsersDuotone } from "react-icons/pi";
import { MdPayments } from "react-icons/md";
import {
  getUserDocuments,
  deleteUserDocument,
} from "../services/documentService";
import ChangeFrequencyModal from "../components/payment/ChangeFrequencyModal";
import ConfirmationModal from "../components/common/ConfirmationModal";

import LoanStatus from "../components/dashboard/LoanStatus";
import UnionMembershipModal from "../components/UnionMembershipModal";
import OverviewTab from "../components/dashboard/OverviewTab";
import MembershipTab from "../components/dashboard/MembershipTab";
import MedicalCoverTab from "../components/dashboard/MedicalCoverTab";

const DashboardPage = () => {
  const { user } = useAuth();
  const [userSubscription, setUserSubscription] = useState(null);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [nextPaymentDate, setNextPaymentDate] = useState("April 15, 2025");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Document states
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

  // New states
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [hasPaidMembership, setHasPaidMembership] = useState(false);

  // Load user subscription data
  useEffect(() => {
    const subscription = localStorage.getItem("userSubscription");
    if (subscription) {
      setUserSubscription(JSON.parse(subscription));
    }

    // Fetch documents on component mount
    fetchDocuments();
    fetchMockData();

    // Check if user has paid membership on component mount
    const membershipStatus = localStorage.getItem("unionMembershipPaid");

    if (membershipStatus === "true") {
      setHasPaidMembership(true);
      return;
    }

    // If not in local storage, check if this is a first-time login and hasn't paid
    const isFirstTimeLogin = user && !membershipStatus;

    if (isFirstTimeLogin) {
      // You could also make an API call here to verify payment status from the server
      // For now, we'll use the absence of the localStorage flag to determine status
      setShowMembershipModal(true);
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

  const handleFrequencyChanged = (newFrequency) => {
    if (userSubscription) {
      const updatedSubscription = {
        ...userSubscription,
        frequency: newFrequency,
      };

      // Update local state
      setUserSubscription(updatedSubscription);

      // Save to localStorage
      localStorage.setItem(
        "userSubscription",
        JSON.stringify(updatedSubscription)
      );

      // Update next payment date based on frequency
      const today = new Date();
      let nextDate;

      if (newFrequency === "daily") {
        nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 1);
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

  return (
    <div className="pb-6 mt-4 sm:mt-10 min-h-screen">
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
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
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
                <div className="flex justify-between items-start">
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
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mt-1">
                          Active
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Next dues:{" "}
                          <span className="font-medium">April 30, 2025</span>
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
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mt-1">
                          Crew Afya Lite
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Coverage:{" "}
                          <span className="font-medium">KSh 200,000</span>
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
                    id: "membership",
                    label: "Membership",
                    icon: <PiUsersDuotone className="h-5 w-5" />,
                  },
                  {
                    id: "medical",
                    label: "Medical Cover",
                    icon: <TbShieldCheckFilled className="h-5 w-5" />,
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
                    <div className="mb-6 px-2">
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        View and manage your membership details, upcoming
                        payments, and documents.
                      </p>
                    </div>
                    <OverviewTab
                      nextPaymentDate={nextPaymentDate}
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
                {activeTab === "membership" && (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage your Matatu Workers Union membership details and
                        benefits.
                      </p>
                    </div>
                    <MembershipTab user={user} />
                  </div>
                )}

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
                      user={user}
                      handleOpenFrequencyModal={handleOpenFrequencyModal}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Frequency Modal */}
      {userSubscription && (
        <ChangeFrequencyModal
          isOpen={isFrequencyModalOpen}
          onClose={handleCloseFrequencyModal}
          currentPlan={userSubscription.plan}
          currentFrequency={userSubscription.frequency}
          onFrequencyChanged={handleFrequencyChanged}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />

      {/* Union Membership Modal */}
      {showMembershipModal && (
        <UnionMembershipModal
          isOpen={showMembershipModal}
          onClose={() => setShowMembershipModal(false)}
          onPaymentComplete={handleMembershipPayment}
        />
      )}
    </div>
  );
};

export default DashboardPage;
