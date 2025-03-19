import { format } from "date-fns";

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value) => {
  return `${parseFloat(value).toFixed(2)}%`;
};

// Format time
export const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds} sec`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

// Helper function to get date range label
export const getDateRangeLabel = (range) => {
  switch (range) {
    case "week":
      return "Last 7 days";
    case "month":
      return "Last 30 days";
    case "quarter":
      return "Last 3 months";
    case "year":
      return "Last 12 months";
    case "ytd":
      return "Year to date";
    case "custom":
      return "Custom date range";
    default:
      return "Last 30 days";
  }
};
