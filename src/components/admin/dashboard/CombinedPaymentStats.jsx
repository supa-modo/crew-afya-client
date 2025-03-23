import React from "react";
import { PiMoneyWavyDuotone } from "react-icons/pi";
import { TbTrendingDown, TbTrendingUp } from "react-icons/tb";
import {
  AreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  YAxis,
} from "recharts";

const CombinedPaymentStats = ({ summary, chartData, formatCurrency }) => {
  // Calculate percentage change (example - you can replace with your actual calculation)
  const medicalChange = 5.2; // positive value for increase
  const duesChange = -2.7; // negative value for decrease

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-bold text-amber-700 dark:text-amber-600 mb-2">
          Revenue Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Medical Payments Card */}
          <div className="bg-admin-100 dark:bg-indigo-900/30 rounded-lg p-4">
            <div className="flex justify-between items-start ">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-4">
                  <PiMoneyWavyDuotone className="h-8 w-8 text-admin-600 dark:text-indigo-300" />
                </div>
                <div>
                  <div className="mt-1">
                    <p className="text-[1.3rem] font-bold text-gray-700 dark:text-white">
                      {formatCurrency(summary.totalMedicalMTD)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ">
                      Medical Payments - Month to date
                    </p>
                  </div>
                </div>
              </div>

              {medicalChange > 0 ? (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs">
                  <TbTrendingUp className="h-3 w-3 mr-1" />
                  <span>{Math.abs(medicalChange)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-rose-600 dark:text-rose-400 text-xs">
                  <TbTrendingDown className="h-3 w-3 mr-1" />
                  <span>{Math.abs(medicalChange)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Union Dues Card */}
          <div className="bg-secondary-100 dark:bg-emerald-900/40 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-secondary-200 dark:bg-secondary-800 flex items-center justify-center mr-4">
                  <PiMoneyWavyDuotone className="h-8 w-8 text-secondary-600 dark:text-secondary-300" />
                </div>
                <div>
                  <div className="mt-1">
                    <p className="text-[1.3rem] font-bold text-gray-700 dark:text-white">
                      {formatCurrency(summary.totalDuesMTD)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Union Dues - Month to date
                    </p>
                  </div>
                </div>
              </div>

              {duesChange > 0 ? (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs">
                  <TbTrendingUp className="h-3 w-3 mr-1" />
                  <span>{Math.abs(duesChange)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-rose-600 dark:text-rose-400 text-xs">
                  <TbTrendingDown className="h-3 w-3 mr-1" />
                  <span>{Math.abs(duesChange)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Combined Chart */}
        <div className="h-[220px] w-full mt-1 bg-gray-50 dark:bg-gray-900/30 rounded-lg py-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="medicalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="duesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
                stroke="#9CA3AF"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />

              <YAxis
                tickFormatter={(tick) => `$${(tick / 1000).toFixed(0)}k`}
                stroke="#9CA3AF"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              />

              <Area
                type="monotone"
                dataKey="medical"
                name="Medical"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#medicalGradient)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />

              <Area
                type="monotone"
                dataKey="dues"
                name="Union Dues"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#duesGradient)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Chart legend */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-indigo-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Medical
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Union Dues
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedPaymentStats;
