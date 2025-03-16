import { useState, useEffect } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
} from "react-icons/fi";
import MakePayment from "../components/payment/MakePayment";
import PaymentHistory from "../components/payment/PaymentHistory";
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

  return (
    <div className="py-6 mt-16">
      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
            <h1 className="text-lg md:text-xl font-bold text-green-700  flex items-center">
              <TbCreditCardFilled className="mr-2 h-6 w-6 text-gray-400" />
              Payments and Health Cover Plans
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Make payments and view your payment history. Keep track of your
              insurance premiums and ensure your coverage stays active.
            </p>
          </div>
          <div className="px-6 pb-5 mr-auto md:mr-0 md:px-0 md:py-0">
            {selectedPlan && (
              <button
                className="btn-primary text-sm text-white md:mr-6 px-4 py-2 rounded-md"
                onClick={() => handleOpenPlanModal(true)}
              >
                Change Your Plan
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white  dark:bg-gray-800 shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 px-4 md:px-8 py-8">
            {/* Calendar Component */}
            <div className="bg-white md:w-[40%] dark:bg-gray-800">
              <h3 className="text-base sm:text-lg font-semibold text-primary-600  mb-2">
                Your Payment Calendar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
            <div className="bg-white md:w-[60%] md:border-l md:border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden ">
              <div className="">
                {selectedPlan ? (
                  <div className="space-y-4">
                    <div className="bg-primary-50 dark:bg-primary-900/10 px-2 sm:px-4 py-4 md:mx-10 rounded-lg border border-primary-200 dark:border-primary-800 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MdOutlineHealthAndSafety className="h-6 w-6 text-primary-600 mt-0.5 mr-1 sm:mr-2 md:mr-3" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {selectedPlan.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
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
                          <div className=" text-xs font-medium text-green-700 px-4 sm:px-6 py-1.5 rounded-full bg-green-200">
                            Active
                          </div>
                        </div>
                      </div>
                    </div>
                    <MakePayment
                      selectedPlan={selectedPlan}
                      frequency={selectedFrequency}
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
                      className="inline-flex items-center px-7 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
            <div className="p-6">
              <PaymentHistory title="Payments History" />
            </div>
          </div>
        </div>
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
