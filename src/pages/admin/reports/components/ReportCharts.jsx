import React from "react";
import { TbChartLine } from "react-icons/tb";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReportCharts = ({
  reportType,
  reportsData,
  selectedMetrics,
  chartColors,
  darkMode,
}) => {
  if (!reportsData || !reportsData.timeSeriesData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <TbChartLine className="mr-2 h-5 w-5 text-admin-600" />
        {reportType === "financial" && "Financial Metrics Over Time"}
        {reportType === "user" && "User Activity Metrics"}
        {reportType === "insurance" && "Insurance Coverage Analytics"}
        {reportType === "payment" && "Payment Processing Insights"}
      </h2>

      {/* Line charts for time-series data */}
      {(reportType === "financial" || reportType === "user") && (
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={reportsData.timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                stroke={darkMode ? "#9ca3af" : "#6b7280"}
                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis
                stroke={darkMode ? "#9ca3af" : "#6b7280"}
                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                  borderColor: darkMode ? "#374151" : "#e5e7eb",
                  color: darkMode ? "#ffffff" : "#000000",
                }}
                labelStyle={{ color: darkMode ? "#ffffff" : "#000000" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />

              {/* Render lines based on report type and selected metrics */}
              {/* This section would have the specific lines for each report type based on selectedMetrics */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar/Pie charts for distribution data */}
      {(reportType === "insurance" || reportType === "payment") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* This section would have the specific charts for insurance and payment reports */}
        </div>
      )}
    </div>
  );
};

export default ReportCharts;
