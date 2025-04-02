import React, { useState, useEffect } from "react";
import { PiMoneyWavyDuotone } from "react-icons/pi";
import { TbTrendingDown, TbTrendingUp } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
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
  const [activePlan, setActivePlan] = useState(0);

  // Mock data for medical plans - replace with actual data from your API
  const medicalPlans = [
    {
      name: "CrewAfya Lite (M)",
      revenue: 2500000,
      change: 5.2,
      color: "#6366F1",
    },
    {
      name: "CrewAfya M+1",
      revenue: 1800000,
      change: 3.8,
      color: "#10B981",
    },
    {
      name: "CrewAfya M+2",
      revenue: 1500000,
      change: -1.2,
      color: "#F59E0B",
    },
    {
      name: "CrewAfya M+3",
      revenue: 1200000,
      change: 2.5,
      color: "#EF4444",
    },
    {
      name: "CrewAfya M+4",
      revenue: 900000,
      change: 4.1,
      color: "#8B5CF6",
    },
    {
      name: "CrewAfya M+5",
      revenue: 700000,
      change: -0.8,
      color: "#EC4899",
    },
    {
      name: "CrewAfya M+6",
      revenue: 500000,
      change: 1.9,
      color: "#14B8A6",
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePlan((prev) => (prev + 1) % medicalPlans.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-bold text-amber-700 dark:text-amber-600 mb-2">
          Revenue Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Total Medical Revenue Card */}
          <div className="bg-admin-100 dark:bg-indigo-900/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center mr-4">
                  <PiMoneyWavyDuotone className="h-8 w-8 text-admin-600 dark:text-indigo-300" />
                </div>
                <div>
                  <div className="mt-1">
                    <p className="text-[1.3rem] font-bold text-gray-700 dark:text-white">
                      {formatCurrency(summary.totalMedicalMTD)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Medical Revenue - Month to date
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Revenue Carousel */}
          <div className="bg-secondary-100 dark:bg-emerald-900/40 rounded-lg px-4">
            <div className="relative h-[80px]">
              <AnimatePresence mode="wait">
                {medicalPlans.map(
                  (plan, index) =>
                    index === activePlan && (
                      <motion.div
                        key={index}
                        className="absolute inset-0 flex items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-secondary-200 dark:bg-secondary-800 flex items-center justify-center mr-4">
                            <PiMoneyWavyDuotone className="h-8 w-8 text-secondary-600 dark:text-secondary-300" />
                          </div>
                          <div>
                            <p className="text-[1.3rem] font-bold text-gray-700 dark:text-white">
                              {formatCurrency(plan.revenue)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {plan.name}
                            </p>
                          </div>
                        </div>
             
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>

            {/* Plan carousel indicators */}
            <div className="flex justify-end -mt-10 space-x-1.5">
            {medicalPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActivePlan(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activePlan
                      ? "w-4 bg-secondary-600 dark:bg-secondary-500"
                      : "w-1.5 bg-secondary-400/60 dark:bg-secondary-400/30"
                  }`}
                  aria-label={`Go to plan ${index + 1}`}
                />
              ))}
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
                {medicalPlans.map((plan, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`planGradient${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={plan.color}
                      stopOpacity={0.4}
                    />
                    <stop offset="95%" stopColor={plan.color} stopOpacity={0} />
                  </linearGradient>
                ))}
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

              {/* Total Medical Revenue Area */}
              <Area
                type="monotone"
                dataKey="medical"
                name="Total Medical"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#planGradient0)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />

              {/* Individual Plan Areas */}
              {medicalPlans.map((plan, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={`plan${index + 1}`}
                  name={plan.name}
                  stroke={plan.color}
                  fillOpacity={1}
                  fill={`url(#planGradient${index})`}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>

          {/* Chart legend */}
          <div className="flex justify-center flex-wrap gap-2 mt-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-indigo-500 mr-1"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Total Medical
              </span>
            </div>
            {medicalPlans.map((plan, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full mr-1"
                  style={{ backgroundColor: plan.color }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {plan.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedPaymentStats;
