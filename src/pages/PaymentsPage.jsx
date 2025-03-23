import { useState, useEffect } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
} from "react-icons/fi";
import MakePayment from "../components/payment/MakePayment";
import PaymentHistory from "../components/payment/PaymentHistory";
import UnionDuesHistory from "../components/payment/UnionDuesHistory";
import PlanSelectionModal from "../components/payment/PlanSelectionModal";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  TbCreditCardFilled,
  TbHome2,
  TbShieldHalfFilled,
} from "react-icons/tb";
import { BiSolidShieldX } from "react-icons/bi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { PiUserDuotone } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";

const PaymentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [expandedSections, setExpandedSections] = useState({
    plans: true,
    makePayment: false,
    paymentSchedule: false,
    paymentHistory: false,
    unionDues: false,
  });
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

  const insurancePlans = [
    {
      name: "Crew Afya Lite",
      forWho: "For Driver/Conductor",
      benefits: [
        { name: "Inpatient", limit: "200,000" },
        { name: "Maternity (Within Inpatient)", limit: "20,000" },
        { name: "Outpatient - Capitation", limit: "Up to 20,000" },
        { name: "Optical + Free Eye Test", limit: "5,000" },
        { name: "Accidents", limit: "50,000" },
        { name: "Last Expense", limit: "50,000" },
        { name: "Emergency Evacuation", limit: "10,000" },
        { name: "Daily cash compensation", limit: "Kes 800" },
        { name: "Permanent disability compensation", limit: "50,000" },
        { name: "Wellness Support", limit: "Group Sessions" },
      ],
      premiums: {
        daily: 24,
        monthly: 713,
        annual: 8565,
      },
    },
    {
      name: "Crew Afya - (Up to M+3)",
      forWho: "For Driver/Conductor + Dependents",
      benefits: [
        { name: "Inpatient", limit: "200,000" },
        { name: "Maternity (Within Inpatient)", limit: "20,000" },
        { name: "Outpatient - Capitation", limit: "Up to 20,000" },
        { name: "Optical + Free Eye Test", limit: "5,000" },
        { name: "Accidents", limit: "50,000" },
        { name: "Last Expense", limit: "50,000" },
        { name: "Emergency Evacuation", limit: "10,000" },
        { name: "Daily cash compensation", limit: "Kes 800" },
        { name: "Permanent disability compensation", limit: "50,000" },
        { name: "Wellness Support", limit: "Group Sessions + Individual" },
      ],
      premiums: {
        daily: 55,
        monthly: 1661,
        annual: 19933,
      },
    },
  ];

  // Simulate loading user subscription data
  useEffect(() => {
    // Check if user has a subscription in localStorage
    const userSubscription = localStorage.getItem("userSubscription");

    if (userSubscription) {
      const { plan, frequency } = JSON.parse(userSubscription);
      const foundPlan = insurancePlans.find((p) => p.name === plan.name);
      if (foundPlan) {
        setSelectedPlan(foundPlan);
        setSelectedFrequency(frequency);
      }
    }
  }, []);

  // Save subscription to localStorage when it changes
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem(
        "userSubscription",
        JSON.stringify({
          plan: selectedPlan,
          frequency: selectedFrequency,
        })
      );
    }
  }, [selectedPlan, selectedFrequency]);

  // Mock union dues data
  const unionDuesData = {
    status: "Active",
    paidUntil: "2025-04-30",
    nextPaymentDate: "2025-04-15",
    nextPaymentAmount: 500,
    lastPayment: {
      date: "2025-03-15",
      amount: 500,
    },
  };

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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Auto-expand make payment section when a plan is selected
  useEffect(() => {
    if (selectedPlan) {
      setExpandedSections((prev) => ({
        ...prev,
        makePayment: true,
      }));
    }
  }, [selectedPlan]);

  const handleOpenPlanModal = (isChanging = false) => {
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
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="py-6 mt-16 min-h-screen">
      {/* Overlay div for better text visibility */}
      <div className="absolute inset-0 " style={{ zIndex: "-1" }}></div>

      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-primary-600 flex items-center">
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
              <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Payments
              </span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <div className="bg-white flex flex-col md:flex-row justify-between items-center dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-5 sm:px-8 sm:py-6">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-green-700 flex items-center">
              <TbCreditCardFilled className="mr-2 h-6 w-6 text-gray-400" />
              Payments & Subscriptions
            </h1>
            <p className="mt-1 text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400">
              Make payments for medical cover and union dues. Keep track of your
              payment history.
            </p>
          </div>
          <div className="px-6 pb-5 mr-auto md:mr-0 md:px-0 md:py-0">
            {selectedPlan && activeTab === "medical" && (
              <button
                className="btn-primary text-xs sm:text-sm text-white md:mr-6 px-4 py-2 rounded-md"
                onClick={() => handleOpenPlanModal(true)}
              >
                Change Your Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Type Tabs */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 sm:mb-4 md:mb-5">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("medical")}
              className={`flex-1 py-4 px-6 text-center font-medium text-xs sm:text-sm md:text-base ${
                activeTab === "medical"
                  ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center justify-center">
                <TbShieldHalfFilled className="h-5 w-5 mr-2" />
                Medical Cover
              </div>
            </button>
            <button
              onClick={() => setActiveTab("union")}
              className={`flex-1 py-4 px-6 text-center font-medium text-xs sm:text-sm md:text-base ${
                activeTab === "union"
                  ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center justify-center">
                <PiUserDuotone className="h-5 w-5 mr-2" />
                Union Dues
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === "medical" ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 px-4 md:px-8 py-8">
              {/* Calendar Component */}
              <div className="bg-white md:w-[40%] dark:bg-gray-800">
                <h3 className="text-base sm:text-lg font-semibold text-primary-600 mb-2">
                  Your Payment Calendar
                </h3>
                <p className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Monitor your premium payments and plan your payment schedule
                  effectively.
                </p>
                <div className="calendar-wrapper">
                  <Calendar
                    onChange={setCalendarDate}
                    value={calendarDate}
                    tileClassName={tileClassName}
                    className="w-full border-none rounded-lg shadow-sm spaced-calendar"
                  />
                </div>
                <div className="mt-4 flex items-center justify-center space-x-6">
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
              <div className="bg-white md:w-[60%] md:border-l md:border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="">
                  {selectedPlan ? (
                    <div className="space-y-4">
                      <div className="bg-primary-50 dark:bg-primary-900/10 px-2 sm:px-4 py-4 md:mx-10 rounded-lg border border-primary-200 dark:border-primary-800 mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MdOutlineHealthAndSafety className="h-6 w-6 text-primary-600 mt-0.5 mr-1 sm:mr-2 md:mr-3" />
                            <div>
                              <h3 className="font-medium text-[0.9rem] sm:text-base text-gray-900 dark:text-white">
                                {selectedPlan.name}
                              </h3>
                              <p className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400">
                                {selectedFrequency.charAt(0).toUpperCase() +
                                  selectedFrequency.slice(1)}{" "}
                                payment of KES{" "}
                                {selectedPlan.premiums[
                                  selectedFrequency
                                ].toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-green-700 px-4 sm:px-6 py-1.5 rounded-full bg-green-200">
                              Active
                            </div>
                          </div>
                        </div>
                      </div>
                      <MakePayment
                        selectedPlan={selectedPlan}
                        frequency={selectedFrequency}
                        initialPaymentType="medical"
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <BiSolidShieldX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        You are not covered yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Please select an insurance plan first to proceed with
                        payment.
                      </p>
                      <button
                        onClick={() => handleOpenPlanModal(false)}
                        className="inline-flex items-center px-7 py-2 border border-transparent rounded-md shadow-sm text-[0.8rem] sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
            <div className="bg-white dark:bg-gray-800 overflow-hidden ">
              <div className="py-6 sm:px-6 px-2">
                <PaymentHistory title="Medical Payment History" />
              </div>
            </div>
          </div>
        ) : (
          /* Union Dues Content */
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 px-4 md:px-8 py-6">
              {/* Union Dues Info */}
              <div className="bg-white md:w-[40%] dark:bg-gray-800">
                <h3 className="text-base sm:text-lg font-semibold text-secondary-600 mb-1">
                  Union Membership Status
                </h3>
                <p className="text-[0.8rem] sm:text-sm text-gray-600 dark:text-gray-400 sm:mb-4">
                  Your current membership status and payment details.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <FiCheck className="mr-1" />
                        {unionDuesData.status}
                      </span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Membership Valid Until:
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-white">
                        {formatDate(unionDuesData.paidUntil)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Last Payment:
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-white">
                        {formatCurrency(unionDuesData.lastPayment.amount)} on{" "}
                        {formatDate(unionDuesData.lastPayment.date)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Next Payment Due:
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-white">
                        {formatCurrency(unionDuesData.nextPaymentAmount)} on{" "}
                        {formatDate(unionDuesData.nextPaymentDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    About Union Dues
                  </h4>
                  <p className="text-[0.8rem] text-gray-600 dark:text-gray-400">
                    Union dues are monthly fees that support union operations,
                    representation, and benefits. Your membership needs to be
                    active to access union benefits, loans, and medical
                    insurance services.
                  </p>
                  <ul className="mt-3 space-y-1 text-[0.8rem] text-gray-600 dark:text-gray-400 pl-5 list-disc">
                    <li>Monthly dues: KES 500</li>
                    <li>Can pay for multiple months in advance</li>
                    <li>Required for maintaining membership benefits</li>
                  </ul>
                </div>
              </div>

              {/* Union Dues Payment Section */}
              <div className="bg-white md:w-[60%] md:border-l md:border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="md:pl-8">
                  <div className="bg-green-50 dark:bg-green-900/10 px-4 py-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
                    <div className="flex items-center">
                      <PiUserDuotone className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                      <div>
                        <h3 className="font-medium text-base text-gray-900 dark:text-white">
                          Union Membership Dues
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly payment of KES 500
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Use the same MakePayment component with a custom unionDues object and initialPaymentType */}
                  <MakePayment
                    selectedPlan={{
                      name: "Union Membership Dues",
                      premiums: {
                        daily: 0,
                        monthly: 500,
                        annual: 6000,
                      },
                    }}
                    frequency="monthly"
                    initialPaymentType="dues"
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                </div>
              </div>
            </div>

            {/* Union Dues Payment History */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden border-t border-gray-200 dark:border-gray-700">
              <div className="py-6 sm:px-6 px-2">
                <UnionDuesHistory />
              </div>
            </div>
          </div>
        )}
      </div>

      {isPlanModalOpen && (
        <PlanSelectionModal
          isOpen={isPlanModalOpen}
          onClose={handleClosePlanModal}
          insurancePlans={insurancePlans}
          onPlanSelected={handlePlanSelected}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
