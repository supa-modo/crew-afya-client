import { useState, useEffect } from "react";
import {
  FiFileText,
  FiUpload,
  FiArrowRight,
  FiTrendingUp,
  FiPhone,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TbActivity,
  TbBus,
  TbCalendarEvent,
  TbCreditCardPay,
  TbDownload,
  TbHomeDot,
  TbRoute,
  TbShieldCheckFilled,
  TbTrash,
  TbIdBadge2,
  TbUsersGroup,
  TbClock,
  TbWallet,
  TbCurrency,
  TbReportMoney,
  TbAlertCircle,
  TbBell,
} from "react-icons/tb";
import {
  PiChatCircleTextBold,
  PiClockCountdownDuotone,
  PiFilePdfDuotone,
  PiFilesDuotone,
  PiImageDuotone,
  PiMoneyWavy,
  PiUserCircle,
  PiUserDuotone,
  PiHandshake,
} from "react-icons/pi";
import { MdPayments, MdOutlineSupportAgent } from "react-icons/md";
import {
  getUserDocuments,
  deleteUserDocument,
} from "../services/documentService";
import ChangeFrequencyModal from "../components/payment/ChangeFrequencyModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import CoverageUtilization from "../components/dashboard/CoverageUtilization";
import PaymentSchedule from "../components/dashboard/PaymentSchedule";
import LoanStatus from "../components/dashboard/LoanStatus";
import PaymentHistory from "../components/payment/PaymentHistory";
import DocumentsSection from "../components/dashboard/DocumentsSection";
import UnionDuesSummary from "../components/dashboard/UnionDuesSummary";

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
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);

  // Load user subscription data
  useEffect(() => {
    const subscription = localStorage.getItem("userSubscription");
    if (subscription) {
      setUserSubscription(JSON.parse(subscription));
    }

    // Fetch documents on component mount
    fetchDocuments();
    fetchMockData();
  }, []);

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

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between">
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
                  className="inline-flex items-center px-3 sm:px-5 py-2 bg-secondary-100 border border-green-600 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-green-700 dark:text-green-200  dark:bg-secondary-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <TbCreditCardPay className="mr-2 h-5 sm:h-6 w-5 sm:w-6" />
                  Make a Payment
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 sm:px-6 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
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
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8 mb-4 sm:mb-6">
          <div className="flex overflow-x-auto justify-center py-2 no-scrollbar">
            <div className="flex space-x-1 sm:space-x-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              {[
                {
                  id: "overview",
                  label: "Overview",
                  icon: <TbActivity className="h-4 w-4" />,
                },
                {
                  id: "membership",
                  label: "Membership",
                  icon: <TbUsersGroup className="h-4 w-4" />,
                },
                {
                  id: "medical",
                  label: "Medical Cover",
                  icon: <TbShieldCheckFilled className="h-4 w-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-200 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400"
                      : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Overview Section */}
        {activeTab === "overview" && (
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content area - 2 columns on large screens */}

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Coverage Utilization */}
                  <CoverageUtilization />

                  {/* Recent Payments Section */}
                  <div className="mt-4 px-1 sm:px-4 md:px-6">
                    <h3 className="text-base md:text-lg font-semibold text-green-700 pl-4 mb-1.5  flex items-center">
                      <MdPayments className="mr-2 h-6 w-6 text-green-700" />
                      Recent Payments
                    </h3>
                    <PaymentHistory />
                  </div>

                  {/* Documents Section */}
                  <DocumentsSection
                    documents={documents}
                    isLoadingDocs={isLoadingDocs}
                    handleDeleteDocument={handleDeleteDocument}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Payment Schedule */}
                <PaymentSchedule
                  nextPaymentDate={nextPaymentDate}
                  userSubscription={userSubscription}
                  handleOpenFrequencyModal={handleOpenFrequencyModal}
                />

                {/* Support Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-green-600 py-4 px-6">
                    <h3 className="text-white font-semibold flex items-center">
                      <MdOutlineSupportAgent className="mr-2 h-5 w-5" />
                      Union Support
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Need help with your membership, loans, or medical cover?
                    </p>
                    <div className="flex flex-col space-y-3">
                      <a
                        href="tel:+254711000000"
                        className="flex items-center text-sm text-primary-600 font-medium"
                      >
                        <FiPhone className="h-4 w-4 mr-2" />
                        +254 711 000 000
                      </a>
                      <a
                        href="#"
                        className="flex items-center text-sm text-primary-600 font-medium"
                      >
                        <PiChatCircleTextBold className="h-4 w-4 mr-2" />
                        Chat with Support
                      </a>
                      <a
                        href="#"
                        className="flex items-center text-sm text-primary-600 font-medium"
                      >
                        <FiFileText className="h-4 w-4 mr-2" />
                        Submit a Request
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Membership Tab Content */}
        {activeTab === "membership" && (
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <TbUsersGroup className="mr-2 h-6 w-6 text-primary-600" />
                  Membership Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white p-6 shadow-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-primary-100 mb-1">
                            Matatu Workers Union
                          </div>
                          <div className="text-xl font-bold mb-4">
                            {user?.firstName} {user?.lastName || "Member"}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-primary-100 text-xs">
                                Member ID
                              </div>
                              <div>{user?.memberId || "MWU-125793"}</div>
                            </div>
                            <div>
                              <div className="text-primary-100 text-xs">
                                Route Number
                              </div>
                              <div>{user?.route || "125"}</div>
                            </div>
                            <div>
                              <div className="text-primary-100 text-xs">
                                Join Date
                              </div>
                              <div>{user?.joinDate || "Jan 15, 2023"}</div>
                            </div>
                            <div>
                              <div className="text-primary-100 text-xs">
                                Status
                              </div>
                              <div>Active</div>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:block h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                          <TbIdBadge2 className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/20 flex justify-between">
                        <div>
                          <div className="text-primary-100 text-xs">
                            Next Dues Payment
                          </div>
                          <div>October 30, 2023</div>
                        </div>
                        <div>
                          <div className="text-primary-100 text-xs">
                            Monthly Dues
                          </div>
                          <div>KSh 300</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <TbRoute className="mr-2 h-5 w-5 text-primary-600" />
                        Route Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Route Number
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {user?.route || "125"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Route Name
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {user?.routeName || "CBD - Kawangware"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            SACCO
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {user?.sacco || "Kawangware Sacco"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Position
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {user?.position || "Driver"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <TbCurrency className="mr-2 h-5 w-5 text-primary-600" />
                        Payment History
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            date: "Sep 30, 2023",
                            amount: "KSh 300",
                            status: "Paid",
                          },
                          {
                            date: "Aug 30, 2023",
                            amount: "KSh 300",
                            status: "Paid",
                          },
                          {
                            date: "Jul 30, 2023",
                            amount: "KSh 300",
                            status: "Paid",
                          },
                        ].map((payment, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-800 dark:text-white">
                                {payment.date}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Union Dues
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-800 dark:text-white">
                                {payment.amount}
                              </div>
                              <div
                                className={`text-sm ${
                                  payment.status === "Paid"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {payment.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm">
                          View All Payment History
                        </button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <PiHandshake className="mr-2 h-5 w-5 text-primary-600" />
                        Member Benefits
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            benefit: "Union Representation",
                            status: "Available",
                          },
                          { benefit: "Legal Assistance", status: "Available" },
                          {
                            benefit: "Financial Education",
                            status: "Available",
                          },
                          {
                            benefit: "Route Dispute Resolution",
                            status: "Available",
                          },
                        ].map((benefit, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-600 dark:text-gray-400">
                              {benefit.benefit}
                            </span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {benefit.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Cover Tab Content */}
        {activeTab === "medical" && (
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold flex items-center">
                          <TbShieldCheckFilled className="mr-2 h-6 w-6" />
                          Crew Afya Lite
                        </h2>
                        <p className="mt-1 text-blue-100">
                          For Driver/Conductor
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium">
                        Active
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-blue-100 text-sm">Policy Number</p>
                        <p className="font-medium">MWU-24367</p>
                      </div>
                      <div>
                        <p className="text-blue-100 text-sm">Coverage Period</p>
                        <p className="font-medium">Oct 2023 - Oct 2024</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Coverage Summary
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Premium Payment
                          </span>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                            Daily
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Daily Amount
                          </span>
                          <span className="text-lg text-blue-600 dark:text-blue-400 font-bold">
                            KSh 24
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Monthly Equivalent
                          </span>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                            KSh 713
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Next Payment
                          </span>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                            Tomorrow
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Amount Due
                          </span>
                          <span className="text-lg text-blue-600 dark:text-blue-400 font-bold">
                            KSh 24
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Payment Method
                          </span>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                            M-Pesa
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Coverage Details
                    </h3>

                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Benefit
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Limit
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Used
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Available
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {[
                            { name: "Inpatient", limit: 200000, used: 50000 },
                            { name: "Outpatient", limit: 20000, used: 8500 },
                            { name: "Maternity", limit: 20000, used: 0 },
                            { name: "Optical", limit: 5000, used: 3000 },
                            { name: "Dental", limit: 5000, used: 0 },
                            { name: "Accidents", limit: 50000, used: 0 },
                          ].map((benefit, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0
                                  ? "bg-white dark:bg-gray-900"
                                  : "bg-gray-50 dark:bg-gray-800"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {benefit.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                KSh {benefit.limit.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                KSh {benefit.used.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium text-right">
                                KSh{" "}
                                {(
                                  benefit.limit - benefit.used
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Coverage Utilization
                    </h3>

                    <div className="space-y-4 mb-6">
                      {[
                        { name: "Inpatient", used: 50000, total: 200000 },
                        { name: "Outpatient", used: 8500, total: 20000 },
                        { name: "Optical", used: 3000, total: 5000 },
                      ].map((benefit) => {
                        const percentage = (benefit.used / benefit.total) * 100;
                        return (
                          <div key={benefit.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {benefit.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {percentage.toFixed(1)}% Used
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full ${
                                  percentage > 75
                                    ? "bg-red-600"
                                    : percentage > 50
                                    ? "bg-yellow-600"
                                    : "bg-green-600"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>
                                KSh {benefit.used.toLocaleString()} used
                              </span>
                              <span>
                                KSh {benefit.total.toLocaleString()} limit
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                      <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <TbCreditCardPay className="mr-2 h-5 w-5" />
                        Make Payment
                      </button>
                      <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <FiUpload className="mr-2 h-5 w-5" />
                        Upload Medical Claim
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <TbActivity className="mr-2 h-5 w-5 text-blue-600" />
                      Recent Medical Claims
                    </h3>

                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Service
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Provider
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {[
                            {
                              date: "Oct 10, 2023",
                              service: "Outpatient Visit",
                              provider: "Nairobi Hospital",
                              amount: 2500,
                              status: "Approved",
                            },
                            {
                              date: "Sep 22, 2023",
                              service: "Prescription",
                              provider: "Goodlife Pharmacy",
                              amount: 1800,
                              status: "Approved",
                            },
                            {
                              date: "Aug 15, 2023",
                              service: "Dental Checkup",
                              provider: "Smile Dental",
                              amount: 3000,
                              status: "Pending",
                            },
                            {
                              date: "Jul 30, 2023",
                              service: "Optical Services",
                              provider: "Optica",
                              amount: 3000,
                              status: "Approved",
                            },
                          ].map((claim, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0
                                  ? "bg-white dark:bg-gray-900"
                                  : "bg-gray-50 dark:bg-gray-800"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {claim.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {claim.service}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {claim.provider}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                                KSh {claim.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    claim.status === "Approved"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                      : claim.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  }`}
                                >
                                  {claim.status}
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

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-primary-600 p-4">
                    <h3 className="text-white font-semibold flex items-center">
                      <TbCreditCardPay className="mr-2 h-5 w-5" />
                      Payment Schedule
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <TbClock className="h-5 w-5 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Next Payment
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          Tomorrow
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <TbCurrency className="h-5 w-5 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Amount Due
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          KSh 24
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <TbCalendarEvent className="h-5 w-5 text-primary-600 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Frequency
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          Daily
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleOpenFrequencyModal}
                      className="mt-4 w-full py-2 text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg font-medium text-sm"
                    >
                      Change Payment Frequency
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-blue-600 p-4">
                    <h3 className="text-white font-semibold flex items-center">
                      <TbShieldCheckFilled className="mr-2 h-5 w-5" />
                      Medical Plan Options
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10 relative">
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                          Current
                        </div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          Crew Afya Lite
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          For Driver/Conductor
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Daily
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            KSh 24
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Monthly
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            KSh 713
                          </span>
                        </div>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          Crew Afya - (Up to M+3)
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          For Driver/Conductor + Dependents
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Daily
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            KSh 55
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Monthly
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            KSh 1,661
                          </span>
                        </div>
                        <button className="mt-3 w-full py-2 text-blue-600 bg-white hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-800 font-medium text-sm">
                          Upgrade Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="font-semibold text-lg mb-2">
                    Need Medical Assistance?
                  </h3>
                  <p className="text-blue-100 mb-4 text-sm">
                    Our 24/7 medical helpline is available for all union
                    members.
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <FiPhone className="h-5 w-5" />
                    <span className="font-semibold">0800 123 456</span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Free call for medical emergencies and advice
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loans Tab Content */}
        {activeTab === "loans" && (
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                      <TbWallet className="mr-2 h-6 w-6 text-primary-600" />
                      Your Active Loans
                    </h2>

                    {activeLoans.length > 0 ? (
                      <div className="space-y-6">
                        {activeLoans.map((loan, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                          >
                            <div className="bg-purple-600 px-6 py-4 text-white">
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold">
                                  {loan.type} Loan
                                </h3>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                                  {loan.status === "active"
                                    ? "Active"
                                    : loan.status}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Original Amount
                                  </p>
                                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                    KSh {loan.amount.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Current Balance
                                  </p>
                                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                    KSh {loan.balance.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Monthly Payment
                                  </p>
                                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                    KSh {loan.monthlyPayment.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Repayment Progress
                                </p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div
                                    className="bg-purple-600 h-2.5 rounded-full"
                                    style={{
                                      width: `${
                                        ((loan.amount - loan.balance) /
                                          loan.amount) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>
                                    {Math.round(
                                      ((loan.amount - loan.balance) /
                                        loan.amount) *
                                        100
                                    )}
                                    % paid
                                  </span>
                                  <span>
                                    {Math.round(
                                      (loan.balance / loan.amount) * 100
                                    )}
                                    % remaining
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Next Payment Date
                                  </p>
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    {loan.nextPayment}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Payment Method
                                  </p>
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    M-Pesa
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium shadow-md hover:bg-purple-700 transition-all">
                                  <TbCreditCardPay className="mr-2 h-5 w-5" />
                                  Make Payment
                                </button>
                                <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
                                  <FiFileText className="mr-2 h-5 w-5" />
                                  View Statement
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                        <TbWallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No Active Loans
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          You currently don't have any active loans. Apply for a
                          loan to access funds for your needs.
                        </p>
                        <button className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium shadow-md hover:bg-purple-700 transition-all">
                          <FiTrendingUp className="mr-2 h-5 w-5" />
                          Apply for a Loan
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                      <TbReportMoney className="mr-2 h-6 w-6 text-green-600" />
                      Available Loan Products
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Emergency Loan",
                          amount: "KSh 50,000",
                          interest: "10% p.a.",
                          period: "Up to 6 months",
                          eligibility: "Active membership for 3+ months",
                          color: "red",
                          icon: (
                            <TbAlertCircle className="h-6 w-6 text-red-600" />
                          ),
                        },
                        {
                          title: "Vehicle Improvement",
                          amount: "KSh 200,000",
                          interest: "12% p.a.",
                          period: "Up to 24 months",
                          eligibility: "Active membership for 6+ months",
                          color: "blue",
                          icon: <TbBus className="h-6 w-6 text-blue-600" />,
                        },
                        {
                          title: "Business Expansion",
                          amount: "KSh 500,000",
                          interest: "14% p.a.",
                          period: "Up to 36 months",
                          eligibility:
                            "Active membership for 12+ months, good repayment history",
                          color: "green",
                          icon: (
                            <FiTrendingUp className="h-6 w-6 text-green-600" />
                          ),
                        },
                        {
                          title: "Fleet Addition",
                          amount: "KSh 1,000,000",
                          interest: "15% p.a.",
                          period: "Up to 48 months",
                          eligibility:
                            "Active membership for 24+ months, collateral required",
                          color: "purple",
                          icon: <TbBus className="h-6 w-6 text-purple-600" />,
                        },
                      ].map((loan, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                          <div
                            className={`bg-${loan.color}-100 dark:bg-${loan.color}-900/20 border-l-4 border-${loan.color}-500 p-5`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3
                                  className={`text-lg font-semibold text-${loan.color}-700 dark:text-${loan.color}-400 flex items-center`}
                                >
                                  {loan.icon}
                                  <span className="ml-2">{loan.title}</span>
                                </h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                  Maximum:{" "}
                                  <span className="font-bold text-gray-800 dark:text-white">
                                    {loan.amount}
                                  </span>
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 bg-${loan.color}-200 dark:bg-${loan.color}-900/40 text-${loan.color}-800 dark:text-${loan.color}-300 rounded-full text-xs font-medium`}
                              >
                                {loan.interest}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Repayment Period
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                  {loan.period}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Eligibility
                                </span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right max-w-[200px]">
                                  {loan.eligibility}
                                </span>
                              </div>
                            </div>
                            <button
                              className={`w-full py-2 px-4 bg-${loan.color}-600 hover:bg-${loan.color}-700 text-white rounded-lg text-sm font-medium transition-colors`}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-purple-600 p-4">
                    <h3 className="text-white font-semibold flex items-center">
                      <TbWallet className="mr-2 h-5 w-5" />
                      Loan Requirements
                    </h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          Active union membership
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          Valid ID card and passport photos
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          Up-to-date membership dues
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          Specific requirements per loan type
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-green-600 p-4">
                    <h3 className="text-white font-semibold flex items-center">
                      <TbCreditCardPay className="mr-2 h-5 w-5" />
                      Loan Payment Methods
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <TbCreditCardPay className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                            M-Pesa
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Auto-deduction or manual payments
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <TbBus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                            SACCO Deduction
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Direct from your SACCO account
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <FiPhone className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                            USSD
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Pay via *456*789# on any phone
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="font-semibold text-lg mb-2">
                    Need Financial Advice?
                  </h3>
                  <p className="text-purple-100 mb-4 text-sm">
                    Our financial advisors can help you choose the right loan
                    for your needs.
                  </p>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab Content */}
        {activeTab === "documents" && (
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <PiFilesDuotone className="mr-2 h-6 w-6 text-primary-600" />
                    Your Documents
                  </h2>
                  <button
                    onClick={() => navigate("/profile")}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-md hover:bg-primary-700 transition-all"
                  >
                    <FiUpload className="mr-2 h-5 w-5" />
                    Upload New Document
                  </button>
                </div>

                {uploadProgress > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Uploading document...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {isLoadingDocs ? (
                  <div className="py-8 flex justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-primary-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <div className="text-center">
                      <PiFilesDuotone className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        Upload your documents to keep them organized and
                        accessible.
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        ID card, SACCO membership, vehicle logbook, etc.
                      </p>
                      <button
                        onClick={() => navigate("/profile")}
                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                      >
                        Upload Your First Document
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {documents.length}
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">
                          Total Documents
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-green-100 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                          {documents.filter((doc) => doc.isVerified).length}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          Verified Documents
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {documents.filter((doc) => !doc.isVerified).length}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          Pending Verification
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                          <div
                            className={`p-4 ${
                              doc.isVerified
                                ? "bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-800"
                                : "bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-100 dark:border-yellow-800"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  {doc.mimeType?.startsWith("image/") ? (
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                      <PiImageDuotone className="h-7 w-7 text-blue-500" />
                                    </div>
                                  ) : doc.mimeType === "application/pdf" ? (
                                    <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                      <PiFilePdfDuotone className="h-7 w-7 text-red-500" />
                                    </div>
                                  ) : (
                                    <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                      <svg
                                        className="h-7 w-7 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-base font-medium text-gray-900 dark:text-white truncate max-w-[170px]">
                                    {doc.name}
                                  </h4>
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                      {doc.type}
                                    </span>
                                    <span className="mx-1.5 text-gray-300 dark:text-gray-600">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {(doc.fileSize / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {doc.isVerified && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  <svg
                                    className="h-3 w-3 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <span>
                                Uploaded on{" "}
                                {new Date(
                                  doc.createdAt || Date.now()
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex space-x-3">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md font-medium text-sm hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors"
                              >
                                <TbDownload className="h-4 w-4 mr-1" />
                                Download
                              </a>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                disabled={isSubmitting}
                                className="flex items-center justify-center px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md font-medium text-sm hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <TbTrash className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
};

export default DashboardPage;
