import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CoverageUtilization = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/coverage-utilization");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg  md:text-xl font-bold mb-4">Coverage Utilization</h2>
      <div className="space-y-4 mb-6">
        {[
          { name: "Inpatient", used: 50000, total: 200000 },
          { name: "Outpatient", used: 8500, total: 20000 },
          { name: "Optical", used: 3000, total: 5000 },
        ].map((benefit) => {
          const percentage = (benefit.used / benefit.total) * 100;
          return (
            <div key={benefit.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {benefit.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {percentage.toFixed(1)}% Used
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${
                    percentage > 75
                      ? "bg-red-600"
                      : percentage > 50
                      ? "bg-yellow-600"
                      : "bg-green-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>KSh {benefit.used.toLocaleString()} used</span>
                <span>KSh {benefit.total.toLocaleString()} limit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoverageUtilization;
