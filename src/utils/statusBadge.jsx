import { TbCheck, TbClock, TbX } from "react-icons/tb";

export const getStatusBadge = (status) => {
  // Handle case where status is undefined or null
  if (!status) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 border border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
        Unknown
      </span>
    );
  }

  switch (status.toLowerCase()) {
    case "active":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 border border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-100">
          Active
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 border border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-100">
          Inactive
        </span>
      );
    case "suspended":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-200 border border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-100">
          Suspended
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 border border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
          {status}
        </span>
      );
  }
};

// Status badge component
export const StatusBadge = ({ status }) => {
  let bgColor = "";
  let textColor = "";
  let icon = null;

  switch (status) {
    case "completed":
      bgColor =
        "bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-300 dark:border-green-800/50";
      textColor = "text-green-700 dark:text-green-400";
      icon = <TbCheck className="mr-1 h-4 w-4" />;
      break;
    case "failed":
      bgColor =
        "bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-300 dark:border-red-800/50";
      textColor = "text-red-700 dark:text-red-400";
      icon = <TbX className="mr-1 h-4 w-4" />;
      break;
    case "pending":
      bgColor =
        "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-300 dark:border-yellow-800/50";
      textColor = "text-yellow-700 dark:text-yellow-400";
      icon = <TbClock className="mr-1 h-4 w-4" />;
      break;
    default:
      bgColor =
        "bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-300 dark:border-gray-800/50";
      textColor = "text-gray-700 dark:text-gray-400";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${bgColor} ${textColor}`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
