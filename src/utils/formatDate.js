export const formatDate = (dateStr, includeTime = false) => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "Invalid date";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleDateString("en-US", options);
};
