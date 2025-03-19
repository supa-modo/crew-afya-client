import React from "react";
import ReportTypeSelector from "./ReportTypeSelector";
import ReportDateRange from "./ReportDateRange";
import ReportMetricsSelector from "./ReportMetricsSelector";

const ReportConfig = ({
  reportType,
  handleReportTypeChange,
  dateRange,
  handleDateRangeChange,
  showCustomDateRange,
  customDateRange,
  handleCustomDateChange,
  metrics,
  selectedMetrics,
  handleMetricToggle,
}) => {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Report Configuration
      </h2>

      {/* Report type selector */}
      <ReportTypeSelector
        reportType={reportType}
        handleReportTypeChange={handleReportTypeChange}
      />

      {/* Date range selector */}
      <ReportDateRange
        dateRange={dateRange}
        handleDateRangeChange={handleDateRangeChange}
        showCustomDateRange={showCustomDateRange}
        customDateRange={customDateRange}
        handleCustomDateChange={handleCustomDateChange}
      />

      {/* Metrics selection */}
      <ReportMetricsSelector
        metrics={metrics}
        selectedMetrics={selectedMetrics}
        handleMetricToggle={handleMetricToggle}
      />
    </div>
  );
};

export default ReportConfig;
