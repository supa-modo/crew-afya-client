import { useState, useEffect } from "react";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import MakePayment from "../components/payment/MakePayment";
import PaymentHistory from "../components/payment/PaymentHistory";
import PlanSelectionModal from "../components/payment/PlanSelectionModal";
import MembershipRequiredModal from "../components/payment/MembershipRequiredModal";
import PaymentReceiptModal from "../components/admin/adminPaymentsPageComponents/PaymentReceiptModal";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  TbCreditCardFilled,
  TbHome2,
  TbShieldHalfFilled,
  TbCalendarEvent,
  TbMoneybag,
  TbCoins,
  TbChevronRight,
} from "react-icons/tb";
import { BiSolidShieldX } from "react-icons/bi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { PiUserDuotone, PiUsersThreeDuotone } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";
import UnionMembershipHistory from "../components/payment/UnionMembershipHistory";
import { RiUserCommunityLine } from "react-icons/ri";
import {
  saveSubscription,
  getUserSubscription,
  getPremiumAmount,
} from "../services/subscriptionService";

const PaymentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [paymentDates, setPaymentDates] = useState({
    paid: [
      "2025-03-11",
      "2025-03-12",
      "2025-03-13",
      "2025-03-15",
      "2025-03-18",
    ],
    defaulted: ["2025-03-14", "2025-03-16"],
  });
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [activeTab, setActiveTab] = useState("medical"); // "medical" or "union"
  const [hasPaidMembership, setHasPaidMembership] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMembershipRequiredModal, setShowMembershipRequiredModal] =
    useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Load user subscription data from server
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user || !user.id) return;

      setIsLoading(true);

      try {
        // Get subscription from server
        const response = await getUserSubscription(user.id);

        if (
          response &&
          response.success &&
          response.data &&
          response.data.plan
        ) {
          // If server has subscription data, use it
          setSelectedPlan(response.data.plan);
          setSelectedFrequency(
            response.data.frequency || response.data.paymentFrequency || "daily"
          );
        } else {
          // No subscription found
          setSelectedPlan(null);
          setSelectedFrequency("daily"); // Default frequency
        }
      } catch (error) {
        console.error("Error loading subscription:", error);
        setSelectedPlan(null);
        setSelectedFrequency("daily"); // Default frequency
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  // Save subscription to server when it changes
  useEffect(() => {
    const saveUserSubscription = async () => {
      if (!selectedPlan || !user || !user.id) return;

      // Save to server
      try {
        await saveSubscription({
          planId: selectedPlan.id,
          frequency: selectedFrequency,
          userId: user.id,
        });
      } catch (error) {
        console.error("Error saving subscription to server:", error);
        // Continue even if server save fails, as we have no fallback
      }
    };

    saveUserSubscription();
  }, [selectedPlan, selectedFrequency, user]);

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    if (paymentDates.paid.includes(dateStr)) {
      return "bg-green-300 text-green-800 hover:bg-green-400";
    }
    if (paymentDates.defaulted.includes(dateStr)) {
      return "bg-red-300 text-red-800 hover:bg-red-400";
    }
    return "";
  };

  const handleOpenPlanModal = (isChanging = false) => {
    // Check if user has active membership status before opening the plan modal
    if (user && user.membershipStatus !== "active") {
      setShowMembershipRequiredModal(true);
      return;
    }
    setIsChangingPlan(isChanging);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = (success = false) => {
    setIsPlanModalOpen(false);

    if (success && !selectedPlan) {
      // If this was the first plan selection, refresh the page
      window.location.reload();
    }
  };

  const handlePlanSelected = (plan, frequency) => {
    setSelectedPlan(plan);
    setSelectedFrequency(frequency);
    setIsPlanModalOpen(false);

    // Save to server immediately after selection
    if (user && user.id) {
      saveSubscription({
        planId: plan.id,
        frequency: frequency,
        userId: user.id,
      }).catch((error) => {
        console.error("Error saving subscription after plan selection:", error);
      });
    }
  };

  // Check membership status based on user object
  useEffect(() => {
    if (user && user.membershipStatus === "active") {
      setHasPaidMembership(true);
    } else {
      setHasPaidMembership(false);
      // Show membership modal if status is pending
      if (user && user.membershipStatus === "pending") {
        // Open the membership modal
        setActiveTab("union");
      }
    }
  }, [user]);

  // Handler for membership payment
  const handleMembershipPayment = (success) => {
    if (success) {
      setHasPaidMembership(true);
    }
  };

  // Handle view receipt
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50/60 to-gray-100/60 dark:from-gray-900/60 dark:to-gray-800/60 min-h-screen pb-10">
      <div className="pt-20 sm:pt-24">
        {/* Breadcrumb */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-600 flex items-center"
                >
                  <TbHome2 className="h-5 w-5 mr-2" />
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
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-primary-600"
                >
                  Dashboard
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
                  Payments
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Header section */}
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 md:px-8 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 pt-5 sm:pt-7 pb-8 flex flex-col lg:flex-row justify-between items-center rounded-2xl overflow-hidden border border-secondary-700/20 shadow-xl relative">
            <div className="lg:w-full relative z-10 px-5 sm:px-8 text-secondary-700 dark:text-secondary-500">
              <h1 className="text-base sm:text-lg md:text-xl font-bold flex items-center">
                <TbCoins className="mr-3 h-8 w-8 text-secondary-700 dark:text-secondary-500" />
                Payments & Subscriptions
              </h1>
              <p className="mt-2 text-[0.8rem] sm:text-[0.95rem] font-medium text-gray-500 dark:text-gray-300 max-w-2xl">
                Make payments for medical cover, union membership and Keep track
                of your payment history.
              </p>
            </div>
            {selectedPlan && activeTab === "medical" && (
              <div className="px-4 md:px-8 pt-5 md:pt-8 z-10 w-full lg:w-auto min-w-[30%]">
                <button
                  className="w-full text-white bg-gradient-to-r from-secondary-700/90 to-secondary-800 transition-all duration-200 font-medium text-[0.8rem] sm:text-sm py-2.5 sm:py-3 px-8 rounded-lg shadow-md hover:shadow-lg"
                  onClick={() => handleOpenPlanModal(true)}
                >
                  Change Your Plan
                </button>
              </div>
            )}

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100/30 dark:bg-secondary-900/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-200/20 dark:bg-secondary-900/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
            <div className="absolute right-14 sm:right-48 top-5 opacity-10">
              <TbCoins className="h-24 w-24 text-secondary-700" />
            </div>
          </div>
        </div>

        {/* Payment Type Tabs */}
        <div className="max-w-screen-2xl mx-auto px-0 md:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("medical")}
                className={`relative flex-1 py-4 px-6 text-center font-medium text-sm md:text-base transition-all duration-200 ${
                  activeTab === "medical"
                    ? "text-primary-600 dark:text-primary-400 overflow-hidden"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center justify-center">
                  <TbShieldHalfFilled className="h-5 w-5 mr-2" />
                  Medical Cover
                </div>
                {activeTab === "medical" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 shadow-sm"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("union")}
                className={`relative flex-1 py-4 px-6 text-center font-medium text-sm md:text-base transition-all duration-200 ${
                  activeTab === "union"
                    ? "text-green-600 dark:text-green-400 overflow-hidden"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center justify-center">
                  <RiUserCommunityLine className="h-5 w-5 mr-2" />
                  Membership
                </div>
                {activeTab === "union" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 via-green-600 to-green-400 shadow-sm"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="max-w-screen-2xl mx-auto px-0 md:px-8">
          {activeTab === "medical" ? (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-b-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 px-4 md:px-6 lg:px-8 py-8">
                {/* Calendar Component */}
                <div className="bg-white lg:w-[40%] dark:bg-gray-800 rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-primary-600 flex items-center mb-2">
                    <TbCalendarEvent className="mr-2 h-5 w-5 text-primary-500" />
                    Your Payment Calendar
                  </h3>
                  <p className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Monitor your premium payments and plan your payment schedule
                    effectively.
                  </p>
                  <div className="calendar-wrapper shadow-md rounded-xl  overflow-hidden">
                    <Calendar
                      onChange={setCalendarDate}
                      value={calendarDate}
                      tileClassName={tileClassName}
                      className="w-full border-none rounded-lg overflow-hidden shadow-sm spaced-calendar"
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-center space-x-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg py-3 px-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-green-300 mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Paid
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-red-300 mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Defaulted
                      </span>
                    </div>
                  </div>
                </div>

                {/* Make Payment Section */}
                <div className="bg-white lg:w-[60%] lg:border-l lg:border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden lg:pl-8">
                  <div className="">
                    {isLoading ? (
                      <div className="text-center py-20">
                        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Loading your subscription...
                        </p>
                      </div>
                    ) : selectedPlan ? (
                      <div className="space-y-4">
                        <MakePayment
                          selectedPlan={selectedPlan}
                          frequency={selectedFrequency}
                          initialPaymentType="medical"
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="bg-white dark:bg-gray-700 w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-md mb-4">
                          <BiSolidShieldX className="h-9 w-9 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          You are not covered yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          Please select an insurance plan first to proceed with
                          payment.
                        </p>
                        <button
                          onClick={() => handleOpenPlanModal(false)}
                          className="inline-flex items-center px-8 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                        >
                          Select a Plan
                          <FiArrowRight className="ml-2 -mr-1 h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment History Section */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden border-t border-gray-200 dark:border-gray-700">
                <div className="py-6 sm:px-6 px-2">
                  <PaymentHistory
                    title="Medical Payment History"
                    onViewReceipt={handleViewReceipt}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Union Dues Content */
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-b-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 px-4 md:px-8 py-8">
                {/* Union Membership Info */}
                <div className="bg-white md:w-[40%] dark:bg-gray-800">
                  <h3 className="text-base sm:text-lg font-semibold text-secondary-700 mb-3 flex items-center">
                    <RiUserCommunityLine className="mr-2 h-6 w-6 text-secondary-700" />
                    Union Membership Status
                  </h3>
                  <p className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your current membership status information.
                  </p>

                  <div className="bg-gradient-to-br from-secondary-50 to-emerald-50 dark:from-secondary-900/20 dark:to-emerald-900/10 rounded-xl p-6 shadow-md border border-secondary-200 dark:border-secondary-800/50">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-medium shadow-sm ${
                            hasPaidMembership
                              ? "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400 border border-secondary-300 dark:border-secondary-800/50"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                          }`}
                        >
                          <FiCheck className="mr-1" />
                          {hasPaidMembership
                            ? "Active Member"
                            : "Pending Incomplete Registration"}
                        </span>
                      </div>
                    </div>

                    {/* Membership Info */}
                    <div className="space-y-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Membership Status:
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white">
                          {hasPaidMembership
                            ? "Lifetime Member"
                            : "Registration Incomplete"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-secondary-200/50 dark:border-secondary-800/30">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Registration Fee:
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-white">
                          KES 500 (One-time payment)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <PiUsersThreeDuotone className="h-5 w-5 text-secondary-500 mr-2" />
                      About Union Membership
                    </h4>
                    <p className="text-[0.8rem] text-gray-600 dark:text-gray-400">
                      Union membership requires a one-time registration fee that
                      grants you lifetime access to all union benefits,
                      including legal representation, medical insurance access,
                      and more.
                    </p>
                    <ul className="mt-3 space-y-1 text-[0.8rem] text-gray-600 dark:text-gray-400 pl-5 list-disc">
                      <li>One-time fee: KES 500</li>
                      <li>No recurring charges</li>
                      <li>Required for accessing all union benefits</li>
                    </ul>
                  </div>
                </div>

                {/* Union Membership Payment Section */}
                <div className="bg-white md:w-[60%] md:border-l md:border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                  <div className="md:pl-8">
                    {hasPaidMembership ? (
                      <div className="bg-gradient-to-r from-secondary-50 to-emerald-50 dark:from-secondary-900/20 dark:to-emerald-900/10 px-6 py-8 rounded-xl border border-secondary-200 dark:border-secondary-800/50 text-center shadow-md">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full mb-4 shadow-md">
                          <FiCheck className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                          You're a Registered Member!
                        </h3>
                        <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-400 mb-6">
                          You have successfully paid your one-time union
                          registration fee and are now a lifetime member with
                          access to all benefits.
                        </p>
                        <button
                          onClick={() => navigate("/profile")}
                          className="text-sm px-5 py-3 border border-transparent rounded-lg shadow-md font-medium text-white bg-gradient-to-r from-secondary-700/90 to-secondary-700 hover:from-secondary-800/90 hover:to-secondary-800 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <span className="mr-2">
                              View Membership Details
                            </span>
                            <TbChevronRight className="h-4 w-4" />
                          </div>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 px-6 py-5 rounded-xl border border-green-200 dark:border-green-800/50 mb-6 shadow-md">
                        <div className="flex items-center">
                          <div className="bg-white/80 dark:bg-gray-800 p-2.5 rounded-lg shadow-sm mr-3">
                            <RiUserCommunityLine className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                              Union Membership Registration
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                              One-time payment of KES 500
                            </p>
                          </div>
                        </div>
                      </div> */}

                        {/* MakePayment component with membership config */}
                        <MakePayment
                          selectedPlan={{
                            name: "Union Membership Registration",
                            premiums: {
                              daily: 0,
                              monthly: 0,
                              annual: 500,
                            },
                          }}
                          frequency="annual"
                          initialPaymentType="membership"
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                          onPaymentComplete={handleMembershipPayment}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Union Membership Payment History */}
              <div
                className="bg-white dark:bg-gray-800 overflow-hidden 
            
            "
              >
                <div className="py-6 sm:px-6 px-2">
                  <UnionMembershipHistory />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        isOpen={isPlanModalOpen}
        onClose={() => handleClosePlanModal()}
        onPlanSelected={handlePlanSelected}
      />

      {/* Membership Required Modal */}
      <MembershipRequiredModal
        isOpen={showMembershipRequiredModal}
        onClose={() => setShowMembershipRequiredModal(false)}
        onConfirm={() => {
          setShowMembershipRequiredModal(false);
          // Navigate to union tab
          setActiveTab("union");
        }}
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

export default PaymentsPage;
