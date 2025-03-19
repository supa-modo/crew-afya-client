import React from "react";

const ReportMetricsSelector = ({
  metrics,
  selectedMetrics,
  handleMetricToggle,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Metrics to Include
        </label>
        <button
          className="text-xs text-admin-600 dark:text-admin-400 hover:text-admin-800 dark:hover:text-admin-300"
          onClick={() => {
            // Toggle between selecting all or none
            if (selectedMetrics.length === metrics.length) {
              handleMetricToggle([]);
            } else {
              handleMetricToggle(metrics.map((metric) => metric.id));
            }
          }}
        >
          {selectedMetrics.length === metrics.length
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`flex items-center p-3 rounded-lg border cursor-pointer ${
              selectedMetrics.includes(metric.id)
                ? "bg-admin-50 border-admin-500 dark:bg-admin-900/20 dark:border-admin-400"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => {
              const newSelected = selectedMetrics.includes(metric.id)
                ? selectedMetrics.filter((id) => id !== metric.id)
                : [...selectedMetrics, metric.id];
              handleMetricToggle(newSelected);
            }}
          >
            <div
              className={`p-1.5 rounded-full mr-3 ${
                selectedMetrics.includes(metric.id)
                  ? "bg-admin-100 text-admin-600 dark:bg-admin-900/30 dark:text-admin-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {metric.icon}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  selectedMetrics.includes(metric.id)
                    ? "text-admin-700 dark:text-admin-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {metric.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportMetricsSelector;
