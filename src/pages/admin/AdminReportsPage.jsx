import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { format, subDays } from "date-fns";

// Import Components
import ReportHeader from "./reports/components/ReportHeader";
import ReportConfig from "./reports/components/ReportConfig";
import ReportSummaryCards from "./reports/components/ReportSummaryCards";
import ReportCharts from "./reports/components/ReportCharts";
import ReportTable from "./reports/components/ReportTable";
import ReportLoading from "./reports/components/ReportLoading";

// Import Utils
import { getMetricsConfig } from "./reports/utils/reportMetricsConfig";
import { generateMockReportData } from "./reports/utils/mockDataGenerators";

const AdminReportsPage = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState({});
  const [reportType, setReportType] = useState("financial");
  const [dateRange, setDateRange] = useState("month");
  const [customDateRange, setCustomDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState([
    "revenue",
    "transactions",
    "activeUsers",
  ]);
  const [reportFormat, setReportFormat] = useState("pdf");
  const [exportLoading, setExportLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const exportButtonRef = useRef(null);

  // Get metrics for the current report type
  const metricsConfig = getMetricsConfig(darkMode);
  const getMetricsForType = () =>
    metricsConfig[reportType] || metricsConfig.financial;

  // Define CHART_COLORS with consideration for dark mode
  const CHART_COLORS = darkMode
    ? ["#38bdf8", "#4ade80", "#fb7185", "#a78bfa", "#facc15", "#60a5fa"]
    : ["#0ea5e9", "#22c55e", "#f43f5e", "#8b5cf6", "#eab308", "#3b82f6"];

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range !== "custom") {
      setShowCustomDateRange(false);
    } else {
      setShowCustomDateRange(true);
    }
  };

  // Handle custom date change
  const handleCustomDateChange = (field, value) => {
    setCustomDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle metric selection toggle
  const handleMetricToggle = (newSelectedMetrics) => {
    setSelectedMetrics(newSelectedMetrics);
  };

  // Handle report type change
  const handleReportTypeChange = (type) => {
    setReportType(type);

    // Set default metrics for the selected report type
    switch (type) {
      case "financial":
        setSelectedMetrics(["revenue", "transactions", "averageTransaction"]);
        break;
      case "user":
        setSelectedMetrics(["activeUsers", "newUsers", "userRetention"]);
        break;
      case "insurance":
        setSelectedMetrics([
          "planDistribution",
          "coverageValue",
          "planUpgrades",
        ]);
        break;
      case "payment":
        setSelectedMetrics(["paymentMethods", "paymentSuccess", "paymentTime"]);
        break;
      default:
        setSelectedMetrics(["revenue", "transactions", "activeUsers"]);
    }
  };

  // Handle report export
  const handleExportReport = (format) => {
    setExportLoading(true);

    // Simulate export delay
    setTimeout(() => {
      console.log(`Exporting ${reportType} report in ${format} format`);
      setExportLoading(false);

      // Alert for demo purposes
      alert(
        `${
          reportType.charAt(0).toUpperCase() + reportType.slice(1)
        } report has been exported as ${format.toUpperCase()}`
      );
    }, 1500);
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Fetch report data when parameters change
  useEffect(() => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const mockData = generateMockReportData(
        reportType,
        dateRange,
        customDateRange
      );
      setReportsData(mockData);
      setLoading(false);
    }, 1200);
  }, [dateRange, customDateRange, reportType, refreshTrigger]);

  return (
    <div className="pb-10">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header with breadcrumb and export options */}
        <ReportHeader
          onRefresh={handleRefresh}
          exportButtonRef={exportButtonRef}
          exportLoading={exportLoading}
          handleExportReport={handleExportReport}
        />

        {/* Report configuration panel */}
        <ReportConfig
          reportType={reportType}
          handleReportTypeChange={handleReportTypeChange}
          dateRange={dateRange}
          handleDateRangeChange={handleDateRangeChange}
          showCustomDateRange={showCustomDateRange}
          customDateRange={customDateRange}
          handleCustomDateChange={handleCustomDateChange}
          metrics={getMetricsForType()}
          selectedMetrics={selectedMetrics}
          handleMetricToggle={handleMetricToggle}
        />

        {/* Loading state */}
        {loading && <ReportLoading />}

        {/* Report dashboard */}
        {!loading && reportsData.timeSeriesData && (
          <>
            {/* Summary cards */}
            <ReportSummaryCards
              reportType={reportType}
              summaryData={reportsData.summaryData}
            />

            {/* Data visualization area */}
            <ReportCharts
              reportType={reportType}
              reportsData={reportsData}
              selectedMetrics={selectedMetrics}
              chartColors={CHART_COLORS}
              darkMode={darkMode}
            />

            {/* Data table */}
            <ReportTable
              reportType={reportType}
              reportsData={reportsData}
              dateRange={dateRange}
              reportFormat={reportFormat}
              setReportFormat={setReportFormat}
              exportLoading={exportLoading}
              handleExportReport={handleExportReport}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
