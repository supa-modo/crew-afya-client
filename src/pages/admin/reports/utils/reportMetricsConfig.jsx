import React from "react";
import { PiUsersDuotone } from "react-icons/pi";
import {
  TbCashBanknote,
  TbCash,
  TbReportMoney,
  TbInfoCircle,
  TbAlertCircle,
  TbArrowsExchange,
  TbClock,
  TbCheck,
  TbShield,
  TbDeviceMobile,
} from "react-icons/tb";

// Define metrics for each report type
export const getMetricsConfig = (darkMode) => {
  // Define CHART_COLORS with consideration for dark mode
  const CHART_COLORS = darkMode
    ? ["#38bdf8", "#4ade80", "#fb7185", "#a78bfa", "#facc15", "#60a5fa"]
    : ["#0ea5e9", "#22c55e", "#f43f5e", "#8b5cf6", "#eab308", "#3b82f6"];

  return {
    financial: [
      {
        id: "revenue",
        name: "Revenue",
        description: "Total revenue collected from payments",
        icon: <TbCashBanknote className="h-5 w-5" />,
        color: CHART_COLORS[0],
      },
      {
        id: "transactions",
        name: "Transactions",
        description: "Total number of payment transactions",
        icon: <TbCash className="h-5 w-5" />,
        color: CHART_COLORS[1],
      },
      {
        id: "averageTransaction",
        name: "Average Transaction",
        description: "Average amount per transaction",
        icon: <TbReportMoney className="h-5 w-5" />,
        color: CHART_COLORS[2],
      },
      {
        id: "pendingPayments",
        name: "Pending Payments",
        description: "Value of payments awaiting processing",
        icon: <TbInfoCircle className="h-5 w-5" />,
        color: CHART_COLORS[3],
      },
      {
        id: "failedPayments",
        name: "Failed Payments",
        description: "Value of payments that failed",
        icon: <TbAlertCircle className="h-5 w-5" />,
        color: CHART_COLORS[4],
      },
      {
        id: "refunds",
        name: "Refunds",
        description: "Total value of payment refunds",
        icon: <TbArrowsExchange className="h-5 w-5" />,
        color: CHART_COLORS[5],
      },
    ],
    user: [
      {
        id: "activeUsers",
        name: "Active Users",
        description: "Number of users making payments",
        icon: <PiUsersDuotone className="h-5 w-5" />,
        color: CHART_COLORS[0],
      },
      {
        id: "newUsers",
        name: "New Users",
        description: "Number of newly registered users",
        icon: <PiUsersDuotone className="h-5 w-5" />,
        color: CHART_COLORS[1],
      },
      {
        id: "paymentFrequency",
        name: "Payment Frequency",
        description: "How often users make payments",
        icon: <TbClock className="h-5 w-5" />,
        color: CHART_COLORS[2],
      },
      {
        id: "userRetention",
        name: "User Retention",
        description: "Percentage of users making regular payments",
        icon: <PiUsersDuotone className="h-5 w-5" />,
        color: CHART_COLORS[3],
      },
    ],
    insurance: [
      {
        id: "planDistribution",
        name: "Plan Distribution",
        description: "Breakdown of insurance plans by subscribers",
        icon: <TbShield className="h-5 w-5" />,
        color: CHART_COLORS[0],
      },
      {
        id: "coverageValue",
        name: "Coverage Value",
        description: "Total value of active insurance coverage",
        icon: <TbShield className="h-5 w-5" />,
        color: CHART_COLORS[1],
      },
      {
        id: "planUpgrades",
        name: "Plan Upgrades",
        description: "Number of users upgrading their plans",
        icon: <TbShield className="h-5 w-5" />,
        color: CHART_COLORS[2],
      },
      {
        id: "coverageUtilization",
        name: "Coverage Utilization",
        description: "How much of coverage is being utilized",
        icon: <TbShield className="h-5 w-5" />,
        color: CHART_COLORS[3],
      },
    ],
    payment: [
      {
        id: "paymentMethods",
        name: "Payment Methods",
        description: "Breakdown of payment methods used",
        icon: <TbDeviceMobile className="h-5 w-5" />,
        color: CHART_COLORS[0],
      },
      {
        id: "paymentSuccess",
        name: "Payment Success Rate",
        description: "Percentage of successful payments",
        icon: <TbCheck className="h-5 w-5" />,
        color: CHART_COLORS[1],
      },
      {
        id: "paymentTime",
        name: "Payment Processing Time",
        description: "Average time to process payments",
        icon: <TbClock className="h-5 w-5" />,
        color: CHART_COLORS[2],
      },
      {
        id: "paymentRetry",
        name: "Payment Retry Rate",
        description: "Percentage of payments requiring retry",
        icon: <TbArrowsExchange className="h-5 w-5" />,
        color: CHART_COLORS[3],
      },
    ],
  };
};
