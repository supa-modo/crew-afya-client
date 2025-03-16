import React from "react";

const FeatureIcon = ({ icon, color }) => {
  // Map color names to their corresponding Tailwind classes
  const getColorClasses = (colorName) => {
    const colorMap = {
      primary: {
        bg: "bg-primary-200",
        darkBg: "dark:bg-primary-900/20",
        text: "text-primary-600",
        darkText: "dark:text-primary-400",
      },
      secondary: {
        bg: "bg-secondary-200",
        darkBg: "dark:bg-secondary-900/20",
        text: "text-secondary-600",
        darkText: "dark:text-secondary-400",
      },
      red: {
        bg: "bg-red-200",
        darkBg: "dark:bg-red-900/20",
        text: "text-red-600",
        darkText: "dark:text-red-400",
      },
      green: {
        bg: "bg-green-200",
        darkBg: "dark:bg-green-900/20",
        text: "text-green-600",
        darkText: "dark:text-green-400",
      },
      blue: {
        bg: "bg-blue-200",
        darkBg: "dark:bg-blue-900/20",
        text: "text-blue-600",
        darkText: "dark:text-blue-400",
      },
      yellow: {
        bg: "bg-yellow-200",
        darkBg: "dark:bg-yellow-900/20",
        text: "text-yellow-600",
        darkText: "dark:text-yellow-400",
      },
      purple: {
        bg: "bg-purple-200",
        darkBg: "dark:bg-purple-900/20",
        text: "text-purple-600",
        darkText: "dark:text-purple-400",
      },
      indigo: {
        bg: "bg-indigo-200",
        darkBg: "dark:bg-indigo-900/20",
        text: "text-indigo-600",
        darkText: "dark:text-indigo-400",
      },
      pink: {
        bg: "bg-pink-200",
        darkBg: "dark:bg-pink-900/20",
        text: "text-pink-600",
        darkText: "dark:text-pink-400",
      },
      orange: {
        bg: "bg-orange-200",
        darkBg: "dark:bg-orange-900/20",
        text: "text-orange-600",
        darkText: "dark:text-orange-400",
      },
    };

    // Default to primary if color not found
    return colorMap[colorName] || colorMap.primary;
  };

  const classes = getColorClasses(color);

  return (
    <div
      className={`p-3 ${classes.bg} ${classes.darkBg} rounded-full w-12 h-12 flex items-center justify-center ${classes.text} ${classes.darkText}`}
    >
      {icon}
    </div>
  );
};

export default FeatureIcon;
