import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CombinedPaymentStats from "../../components/admin/dashboard/CombinedPaymentStats";
import {
  FiActivity,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownRight,
  FiSearch,
  FiSliders,
  FiClock,
} from "react-icons/fi";
import {
  TbShieldCheck,
  TbBus,
  TbUserCheck,
  TbArrowNarrowRight,
  TbChartBar,
  TbUserPlus,
  TbCoins,
} from "react-icons/tb";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import {
  PiCaretDownDuotone,
  PiSlidersDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { RiUserAddLine } from "react-icons/ri";

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
        { name: "Crew Afya Lite", value: 7235 },
        { name: "Crew Afya (M+3)", value: 2621 },
      ],
      paymentTypeDistribution: [
        { name: "Daily", value: 5642 },
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

  // Chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const PAYMENT_COLORS = {
    medical: "#4f46e5",
    dues: "#10b981",
  };

  // Get formatted enrollment data for charts
  const getEnrollmentChartData = useMemo(() => {
    if (!dashboardData) return [];

    if (selectedPeriod === "week") {
      return dashboardData.enrollmentTrend;
    }

    // For longer periods, group by week or month to reduce data points
    const groupedData = [];
    const data = dashboardData.enrollmentTrend;
    const groupSize = selectedPeriod === "month" ? 3 : 7; // 3 days for month, 7 days for quarter

    for (let i = 0; i < data.length; i += groupSize) {
      const chunk = data.slice(i, i + groupSize);
      const totalEnrollments = chunk.reduce(
        (sum, item) => sum + item.enrollments,
        0
      );
      groupedData.push({
        date: chunk[0].date,
        enrollments: totalEnrollments,
      });
    }

    return groupedData;
  }, [dashboardData, selectedPeriod]);

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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <p
              key={`tooltip-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name === "enrollments"
                ? "New Members: "
                : entry.name === "medical"
                ? "Medical: "
                : "Union Dues: "}
              {entry.name === "enrollments"
                ? entry.value
                : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-600"></div>
      </div>
    );
  }

  return (
    <div className=" mx-auto">
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
          <div className="relative ">
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardData.summary.totalMembers.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-admin-100 dark:bg-admin-900/30 flex items-center justify-center">
                <FiUsers className="h-6 w-6 text-admin-600 dark:text-admin-400" />
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
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
          {/* Combined Payment Stats - Takes up 3/4 of the row */}
          <div className="lg:col-span-4">
            <CombinedPaymentStats
              summary={dashboardData.summary}
              chartData={getPaymentChartData}
              formatCurrency={formatCurrency}
            />
          </div>
          {/* Enrollment Trend */}
          {/* <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Member Enrollment Trend
                </h2>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Last{" "}
                  {selectedPeriod === "week"
                    ? "7"
                    : selectedPeriod === "month"
                    ? "30"
                    : "90"}{" "}
                  days
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getEnrollmentChartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="enrollmentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4F46E5"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(tick) => {
                        const date = new Date(tick);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="enrollments"
                      name="enrollments"
                      stroke="#4F46E5"
                      fillOpacity={1}
                      fill="url(#enrollmentGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div> */}

          {/* Payment Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-amber-700 dark:text-amber-600">
                  Payment Trends
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Medical
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Union Dues
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getPaymentChartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(tick) => {
                        const date = new Date(tick);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="medical"
                      fill={PAYMENT_COLORS.medical}
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                    <Bar
                      dataKey="dues"
                      fill={PAYMENT_COLORS.dues}
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Defaulters and Action Items */}
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
          </div>
        </div>

        {/* Right Column - Member Distribution Quick Actions, and Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions*/}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <h2 className="text-base font-bold text-amber-700 dark:text-amber-600 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/admin/members/new"
                    className="flex flex-col items-center justify-center p-4 bg-admin-50 dark:bg-admin-900/10 rounded-lg border border-admin-100 dark:border-admin-800 hover:bg-admin-100 dark:hover:bg-admin-800/20 transition-colors"
                  >
                    <RiUserAddLine className="h-7 w-7 text-admin-600 dark:text-admin-400 mb-2" />
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      Add Member
                    </span>
                  </Link>
                  <Link
                    to="/admin/plans"
                    className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-800/20 transition-colors"
                  >
                    <TbShieldCheck className="h-7 w-7 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      Manage Plans
                    </span>
                  </Link>
                  <Link
                    to="/admin/payments"
                    className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-800/20 transition-colors"
                  >
                    <TbCoins className="h-7 w-7 text-emerald-600 dark:text-emerald-400 mb-2" />
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      View Payments
                    </span>
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors"
                  >
                    <TbChartBar className="h-7 w-7 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      Generate Reports
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <h2 className="text-base font-semibold text-amber-700 dark:text-amber-600 mb-4">
                Payment Frequency Distribution
              </h2>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.paymentTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.paymentTypeDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} members`, name]}
                        contentStyle={{
                          borderRadius: "0.5rem",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                  <div className="space-y-3">
                    {dashboardData.paymentTypeDistribution.map(
                      (entry, index) => (
                        <div
                          key={`legend-${index}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.value.toLocaleString()} (
                            {Math.round(
                              (entry.value /
                                dashboardData.summary.totalMembers) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <h2 className="text-base font-semibold text-amber-700 dark:text-amber-600 mb-1">
                Insurance Plan Distribution
              </h2>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.planDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.planDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} members`, name]}
                        contentStyle={{
                          borderRadius: "0.5rem",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                  <div className="space-y-3">
                    {dashboardData.planDistribution.map((entry, index) => (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className="h-3 w-3 rounded-full mr-2"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.value.toLocaleString()} (
                          {Math.round(
                            (entry.value / dashboardData.summary.totalMembers) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-amber-700 dark:text-amber-600">
                  Recent Payments
                </h2>
                <Link
                  to="/admin/payments"
                  className="text-xs font-medium text-admin-600 dark:text-admin-400 flex items-center"
                >
                  View all payments
                  <TbArrowNarrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          payment.type === "medical"
                            ? "bg-indigo-100 dark:bg-indigo-800/30"
                            : "bg-emerald-100 dark:bg-emerald-800/30"
                        }`}
                      >
                        {payment.type === "medical" ? (
                          <TbShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <TbBus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                          {payment.userName}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span className="mr-2">{payment.id}</span>
                          <span>•</span>
                          <span className="ml-2">
                            {formatTime(payment.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div
                        className={`text-xs ${
                          payment.status === "completed"
                            ? "text-green-600 dark:text-green-400"
                            : payment.status === "pending"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
