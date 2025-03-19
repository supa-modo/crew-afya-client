export const getStatusBadge = (status) => {
  // Handle case where status is undefined or null
  if (!status) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        Unknown
      </span>
    );
  }

  switch (status.toLowerCase()) {
    case "active":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100">
          Active
        </span>
      );
    case "inactive":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
          Inactive
        </span>
      );
    case "suspended":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100">
          Suspended
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {status}
        </span>
      );
  }
};
