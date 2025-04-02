import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PaymentTrendChart = ({ chartData, formatCurrency, formatDate }) => {
  const PAYMENT_COLORS = {
    medical: "#4f46e5",
    dues: "#10b981",
  };

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
              {entry.name === "medical" ? "Medical: " : "Union Dues: "}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
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
              data={chartData}
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
  );
};

export default PaymentTrendChart;
