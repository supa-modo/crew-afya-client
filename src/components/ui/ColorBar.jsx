import React from "react";

const ColorBar = ({ color }) => {
  // Map color names to their corresponding Tailwind classes
  const getColorClass = (colorName) => {
    const colorMap = {
      primary: "bg-primary-500",
      secondary: "bg-secondary-500",
      red: "bg-red-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500",
    };

    // Default to primary if color not found
    return colorMap[colorName] || colorMap.primary;
  };

  const colorClass = getColorClass(color);

  return <div className={`h-1 ${colorClass}`}></div>;
};

export default ColorBar;
