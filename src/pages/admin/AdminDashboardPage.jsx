import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CombinedPaymentStats from "../../components/admin/adminDashboard/CombinedPaymentStats";
import QuickActions from "../../components/admin/adminDashboard/QuickActions";
import RecentPayments from "../../components/admin/adminDashboard/RecentPayments";
import PaymentType from "../../components/admin/adminDashboard/PaymentType";
import PaymentTrendChart from "../../components/admin/adminDashboard/PaymentTrendChart";
import PlanDistributionChart from "../../components/admin/adminDashboard/PlanDistributionChart";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiSearch,
} from "react-icons/fi";
import { TbArrowNarrowRight } from "react-icons/tb";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import {
  PiCaretDownDuotone,
  PiSlidersDuotone,
  PiUserDuotone,
  PiUsersThreeDuotone,
} from "react-icons/pi";

const AdminDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Simulate API data fetching
  useEffect(() => {
    setIsLoading(true);
    // Fetch dashboard data from API
    setTimeout(() => {
      setDashboardData(generateMockData(selectedPeriod));
      setIsLoading(false);
    }, 500);
  }, [selectedPeriod]);

  // Generate mock data based on selected period
  const generateMockData = (period) => {
    const enrollmentTrend = [];
    const paymentTrend = [];
    let days = 7;

    if (period === "month") days = 30;
    if (period === "quarter") days = 90;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      enrollmentTrend.unshift({
        date: dateStr,
        enrollments: Math.floor(Math.random() * 15) + 2,
      });

      paymentTrend.unshift({
        date: dateStr,
        medical: Math.floor(Math.random() * 50000) + 10000,
        dues: Math.floor(Math.random() * 15000) + 5000,
      });
    }

    return {
      summary: {
        totalMembers: 12467,
        activeMedical: 9856,
        activeUnion: 10023,
        pendingPayments: 245,
        defaulters: 187,
        totalDuesMTD: 3045000,
        totalMedicalMTD: 8976000,
        memberGrowth: 4.8,
        medicaGrowth: 6.2,
        duesGrowth: 2.9,
      },
      recentPayments: [
        {
          id: "PMT-10452",
          userId: "USR-38291",
          userName: "John Kamau",
          amount: 1661,
          type: "medical",
          status: "completed",
          date: "2025-03-22T09:45:12Z",
        },
        {
          id: "PMT-10451",
          userId: "USR-29471",
          userName: "Sarah Njeri",
          amount: 300,
          type: "dues",
          status: "completed",
          date: "2025-03-22T08:32:07Z",
        },
        {
          id: "PMT-10450",
          userId: "USR-87023",
          userName: "Peter Omondi",
          amount: 24,
          type: "medical",
          status: "completed",
          date: "2025-03-22T08:17:56Z",
        },
        {
          id: "PMT-10449",
          userId: "USR-12984",
          userName: "Marcy Wambui",
          amount: 300,
          type: "dues",
          status: "pending",
          date: "2025-03-22T07:59:21Z",
        },
        {
          id: "PMT-10448",
          userId: "USR-56720",
          userName: "Alex Muriithi",
          amount: 713,
          type: "medical",
          status: "completed",
          date: "2025-03-21T19:23:44Z",
        },
      ],
      pendingActions: [
        {
          id: "ACT-1024",
          type: "verification",
          user: "James Maina",
          userId: "USR-76542",
          date: "2025-03-22T06:45:23Z",
          priority: "high",
        },
        {
          id: "ACT-1023",
          type: "payment_review",
          user: "Rose Chebet",
          userId: "USR-18234",
          date: "2025-03-22T05:22:17Z",
          priority: "medium",
        },
        {
          id: "ACT-1022",
          type: "document_approval",
          user: "David Ngugi",
          userId: "USR-29387",
          date: "2025-03-21T18:14:09Z",
          priority: "low",
        },
      ],
      enrollmentTrend,
      paymentTrend,
      planDistribution: [
        { name: "Crew Afya Lite (M)", value: 7235 },
        { name: "Crew Afya (M+1)", value: 2621 },
        { name: "Crew Afya (M+2)", value: 2621 },
        { name: "Crew Afya (M+3)", value: 1234 },
        { name: "Crew Afya (M+4)", value: 2453 },
        { name: "Crew Afya (M+5)", value: 50 },
        { name: "Crew Afya (M+6)", value: 100 },
      ],
      paymentTypeDistribution: [
        { name: "Daily", value: 5642 },
        { name: "Weekly", value: 3287 },
        { name: "Monthly", value: 3287 },
        { name: "Annual", value: 927 },
      ],
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get formatted payment data for charts
  const getPaymentChartData = useMemo(() => {
    if (!dashboardData) return [];

    if (selectedPeriod === "week") {
      return dashboardData.paymentTrend;
    }

    // For longer periods, group by week or month to reduce data points
    const groupedData = [];
    const data = dashboardData.paymentTrend;
    const groupSize = selectedPeriod === "month" ? 3 : 7; // 3 days for month, 7 days for quarter

    for (let i = 0; i < data.length; i += groupSize) {
      const chunk = data.slice(i, i + groupSize);
      const totalMedical = chunk.reduce((sum, item) => sum + item.medical, 0);
      const totalDues = chunk.reduce((sum, item) => sum + item.dues, 0);
      groupedData.push({
        date: chunk[0].date,
        medical: totalMedical,
        dues: totalDues,
      });
    }

    return groupedData;
  }, [dashboardData, selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-admin-700 dark:text-admin-500 mb-1">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Overview and performance metrics of the CrewAfya platform
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3 w-[40%]">
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center space-x-6 justify-between text-xs sm:text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-admin-600 focus:border-admin-600"
            >
              <div className="flex items-center">
                <PiSlidersDuotone className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">Filter</span>
              </div>
              <PiCaretDownDuotone className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="p-3">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Time Period
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="period"
                        value="week"
                        checked={selectedPeriod === "week"}
                        onChange={() => setSelectedPeriod("week")}
                        className="h-4 w-4 text-admin-600 focus:ring-admin-500 border-gray-300 dark:border-gray-600 rounded-full"
                      />
                      <span className="ml-2">Last 7 days</span>
                    </label>
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="period"
                        value="month"
                        checked={selectedPeriod === "month"}
                        onChange={() => setSelectedPeriod("month")}
                        className="h-4 w-4 text-admin-600 focus:ring-admin-500 border-gray-300 dark:border-gray-600 rounded-full"
                      />
                      <span className="ml-2">Last 30 days</span>
                    </label>
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="period"
                        value="quarter"
                        checked={selectedPeriod === "quarter"}
                        onChange={() => setSelectedPeriod("quarter")}
                        className="h-4 w-4 text-admin-600 focus:ring-admin-500 border-gray-300 dark:border-gray-600 rounded-full"
                      />
                      <span className="ml-2">Last 90 days</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-admin-500 focus:border-admin-500 text-sm w-full"
            />
            <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-admin-600 dark:text-admin-500 mt-1">
                  {dashboardData.summary.totalMembers.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-admin-100 dark:bg-admin-900/30 flex items-center justify-center">
                <PiUsersThreeDuotone className="h-7 w-7 text-admin-600 dark:text-admin-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <FiArrowUpRight
                className={`h-4 w-4 ${
                  dashboardData.summary.memberGrowth >= 0
                    ? "text-green-500"
                    : "text-red-500"
                } mr-1`}
              />
              <span
                className={`text-xs font-medium ${
                  dashboardData.summary.memberGrowth >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {dashboardData.summary.memberGrowth}% growth
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                from last {selectedPeriod}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Medical Cover Active
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-500 mt-1">
                  {dashboardData.summary.activeMedical.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MdOutlineHealthAndSafety className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <FiArrowUpRight
                className={`h-4 w-4 ${
                  dashboardData.summary.medicaGrowth >= 0
                    ? "text-green-500"
                    : "text-red-500"
                } mr-1`}
              />
              <span
                className={`text-xs font-medium ${
                  dashboardData.summary.medicaGrowth >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {dashboardData.summary.medicaGrowth}% growth
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                from last {selectedPeriod}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Union Members Active
                </p>
                <p className="text-2xl font-bold text-admin-600 dark:text-admin-500 mt-1">
                  {dashboardData.summary.activeUnion.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <PiUserDuotone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <FiArrowUpRight
                className={`h-4 w-4 ${
                  dashboardData.summary.duesGrowth >= 0
                    ? "text-green-500"
                    : "text-red-500"
                } mr-1`}
              />
              <span
                className={`text-xs font-medium ${
                  dashboardData.summary.duesGrowth >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {dashboardData.summary.duesGrowth}% growth
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                from last {selectedPeriod}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Actions
                </p>
                <p className="text-2xl font-bold text-admin-600 dark:text-admin-500 mt-1">
                  {dashboardData.pendingActions.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <FiAlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-3">
              <Link
                to="/admin/actions"
                className="text-xs font-medium text-admin-600 dark:text-admin-400 flex items-center"
              >
                View all pending actions
                <TbArrowNarrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Combined Payment Stats */}
          <div className="lg:col-span-4">
            <CombinedPaymentStats
              summary={dashboardData.summary}
              chartData={getPaymentChartData}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Payment Trend */}
          <PaymentTrendChart
            chartData={getPaymentChartData}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />

          {/* Defaulters and Action Items
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-semibold text-amber-700 dark:text-amber-600">
                  Requires Attention
                </h2>
                <Link
                  to="/admin/actions"
                  className="text-xs font-medium text-admin-600 dark:text-admin-400 flex items-center"
                >
                  View all
                  <TbArrowNarrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {/* Pending Payments */}
          {/*
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded-lg mr-3">
                      <FiAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                        Pending Payment Verifications
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {dashboardData.summary.pendingPayments} payments require
                        verification
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/admin/payments"
                    className="text-xs font-medium text-admin-600 dark:text-admin-400 flex items-center"
                  >
                    Verify now
                    <TbArrowNarrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {/* Payment Defaulters */}
          {/*
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-800/30 rounded-lg mr-3">
                      <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                        Payment Defaulters
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {dashboardData.summary.defaulters} members have
                        defaulted payments
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/admin/reports/defaulters"
                    className="text-xs font-medium text-admin-600 dark:text-admin-400 flex items-center"
                  >
                    View list
                    <TbArrowNarrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {/* Pending Actions */}
          {/*
                {dashboardData.pendingActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          action.priority === "high"
                            ? "bg-red-100 dark:bg-red-800/30"
                            : action.priority === "medium"
                            ? "bg-yellow-100 dark:bg-yellow-800/30"
                            : "bg-blue-100 dark:bg-blue-800/30"
                        }`}
                      >
                        <FiClock
                          className={`h-5 w-5 ${
                            action.priority === "high"
                              ? "text-red-600 dark:text-red-400"
                              : action.priority === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                          {action.type === "verification" &&
                            "Identity Verification"}
                          {action.type === "payment_review" && "Payment Review"}
                          {action.type === "document_approval" &&
                            "Document Approval"}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {action.user} • {formatTime(action.date)}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/admin/members?id=${action.userId}`}
                      className="text-xs font-medium text-admin-600 dark:text-admin-400 flex items-center"
                    >
                      Review
                      <TbArrowNarrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Column - Member Distribution Quick Actions, and Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Plan Distribution */}
          <PlanDistributionChart
            planDistribution={dashboardData.planDistribution}
            totalMembers={dashboardData.summary.totalMembers}
          />

          {/* Payment Type Distribution */}
          <PaymentType
            paymentTypeDistribution={dashboardData.paymentTypeDistribution}
            totalMembers={dashboardData.summary.totalMembers}
          />

          {/* Recent Payments
          <RecentPayments
            recentPayments={dashboardData.recentPayments}
            formatCurrency={formatCurrency}
            formatTime={formatTime}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
