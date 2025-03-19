import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiCheck,
  FiX,
  FiFilter,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import {
  TbHome2,
  TbShieldHalfFilled,
  TbRefresh,
  TbHealthRecognition,
  TbSearch,
  TbShieldPlus,
} from "react-icons/tb";
import { MdHealthAndSafety } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import PlanDetailsModal from "../../components/admin/plans/PlanDetailsModal";
import PlanSubscribersList from "../../components/admin/plans/PlanSubscribersList";
import { mockUsers } from "../../data/mockUsers";
import PlanCard from "../../components/admin/plans/PlanCard";

const InsurancePlansPage = () => {
  const { darkMode } = useTheme();
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedPlanForSubscribers, setSelectedPlanForSubscribers] =
    useState(null);

  // Fetch plans data
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Sample plans data
        const plansData = [
          {
            id: "plan1",
            name: "Crew Afya Lite",
            description: "Basic medical coverage for individuals",
            forWho: "For Driver/Conductor",
            status: "active",
            subscriberCount: 146,
            createdAt: "2023-08-15T10:00:00Z",
            updatedAt: "2023-12-02T14:30:00Z",
            coverageDetails: {
              inpatient: "200,000",
              outpatient: "Up to 20,000",
              maternity: "20,000",
              optical: "5,000",
              dental: "Not covered",
            },
            premiums: {
              daily: 24,
              monthly: 713,
              annual: 8565,
            },
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
          },
          {
            id: "plan2",
            name: "Crew Afya - (Up to M+3)",
            description:
              "Family coverage for up to 4 members with enhanced benefits",
            forWho: "For Driver/Conductor + Dependents",
            status: "active",
            subscriberCount: 89,
            createdAt: "2023-09-01T10:00:00Z",
            updatedAt: "2023-11-15T14:30:00Z",
            coverageDetails: {
              inpatient: "200,000",
              outpatient: "Up to 20,000",
              maternity: "20,000",
              optical: "5,000",
              dental: "10,000",
            },
            premiums: {
              daily: 55,
              monthly: 1661,
              annual: 19933,
            },
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
              {
                name: "Wellness Support",
                limit: "Group Sessions + Individual",
              },
            ],
          },
        ];

        setPlans(plansData);

        // Set default plan for subscribers list
        if (plansData.length > 0 && !selectedPlanForSubscribers) {
          setSelectedPlanForSubscribers(plansData[0]);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [refreshTrigger]);

  // Check for success message from location state (after adding new plan)
  useEffect(() => {
    if (location.state?.success) {
      // You could implement a toast notification here
      console.log(location.state.message);

      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Open edit modal for a plan
  const handleEditPlan = (plan) => {
    setCurrentPlan(plan);
    setIsEditModalOpen(true);
  };

  // Handle plan update
  const handlePlanUpdate = (updatedPlan) => {
    setPlans(
      plans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    );
    setIsEditModalOpen(false);

    // If the updated plan is currently selected for subscribers, update it
    if (selectedPlanForSubscribers?.id === updatedPlan.id) {
      setSelectedPlanForSubscribers(updatedPlan);
    }

    // In a real app, you would send the update to the API
  };

  // Handle viewing subscribers for a plan
  const handleViewSubscribers = (plan) => {
    setSelectedPlanForSubscribers(plan);

    // Scroll to subscribers section
    document.getElementById("subscribers-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  // Handle plan deletion
  const handlePlanDelete = (planId) => {
    // Confirm before deletion
    if (
      window.confirm(
        "Are you sure you want to delete this plan? This action cannot be undone."
      )
    ) {
      const updatedPlans = plans.filter((plan) => plan.id !== planId);
      setPlans(updatedPlans);

      // If the deleted plan is currently selected for subscribers,
      // change to the first available plan or set to null
      if (selectedPlanForSubscribers?.id === planId) {
        setSelectedPlanForSubscribers(
          updatedPlans.length > 0 ? updatedPlans[0] : null
        );
      }

      // In a real app, you would send the deletion request to the API
    }
  };

  // Get filtered plans
  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-admin-600 flex items-center"
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
                <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                  Insurance Plans
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Success message if redirected from new plan creation */}
        {location.state?.success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-600 p-4">
            <div className="flex">
              <FiCheck className="h-5 w-5 text-green-400 dark:text-green-500" />
              <p className="ml-3 text-sm text-green-700 dark:text-green-400">
                {location.state.message}
              </p>
            </div>
          </div>
        )}

        {/* Header section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-semibold text-admin-700 dark:text-admin-500 flex items-center">
              <TbShieldHalfFilled className="mr-2 h-7 w-7 text-admin-600" />
              Insurance Plans
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage medical cover plans and their subscribers
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-[50%]">
            <div className="relative w-full ">
              <input
                type="text"
                placeholder="Search plans..."
                className="pl-9 pr-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-1 focus:outline-none focus:border-admin-500 focus:ring-admin-500 dark:bg-gray-700 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 text-sm text-gray-600/90 sm:text-base transition-colors duration-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TbSearch className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              className="p-2  text-admin-600 hover:bg-admin-50 rounded-lg dark:text-admin-400 dark:hover:bg-gray-700"
              title="Refresh"
            >
              <TbRefresh className="h-5 w-5" />
            </button>
            <Link
              to="/admin/new-cover"
              className="sm:w-[25%] inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
            >
              <TbShieldPlus className="mr-1.5 h-4 w-4" /> New Plan
            </Link>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            // Loading skeletons
            [...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
              >
                <div className="p-6">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))
          ) : filteredPlans.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <MdHealthAndSafety className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No plans found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search term"
                  : "Start by creating a new medical cover plan"}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link
                    to="/admin/new-cover"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-admin-600 hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500"
                  >
                    <FiPlus className="mr-1.5 h-4 w-4" /> New Plan
                  </Link>
                </div>
              )}
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                onEditPlan={handleEditPlan}
                onViewSubscribers={handleViewSubscribers}
                onDeletePlan={handlePlanDelete}
                isCurrentlySelected={selectedPlanForSubscribers?.id === plan.id}
              />
            ))
          )}
        </div>

        {/* Subscribers Section */}
        <div id="subscribers-section" className="mt-8">
          {selectedPlanForSubscribers && (
            <PlanSubscribersList plan={selectedPlanForSubscribers} />
          )}
        </div>
      </div>

      {/* Plan Edit Modal */}
      {isEditModalOpen && (
        <PlanDetailsModal
          plan={currentPlan}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handlePlanUpdate}
        />
      )}
    </div>
  );
};

export default InsurancePlansPage;
