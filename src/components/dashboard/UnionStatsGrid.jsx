import React from "react";
import { TbShieldCheck, TbWallet, TbTrendingUp } from "react-icons/tb";
import { PiUsersDuotone } from "react-icons/pi";

const UnionStatsGrid = () => {
  const stats = [
    {
      title: "Union Membership",
      value: "Active",
      icon: <Piusersduotone className="h-6 w-6 text-blue-500" />,
      change: "+14",
      changeText: "new members this week",
      bgClass: "bg-blue-100 dark:bg-blue-900/20",
      borderClass: "border-blue-500",
    },
    {
      title: "Medical Cover",
      value: "Silver Plan",
      icon: <TbShieldCheck className="h-6 w-6 text-green-500" />,
      change: "78%",
      changeText: "of members enrolled",
      bgClass: "bg-green-100 dark:bg-green-900/20",
      borderClass: "border-green-500",
    },
    {
      title: "Active Loans",
      value: "1",
      icon: <TbWallet className="h-6 w-6 text-purple-500" />,
      change: "KSh 32,540",
      changeText: "total active balance",
      bgClass: "bg-purple-100 dark:bg-purple-900/20",
      borderClass: "border-purple-500",
    },
    {
      title: "SACCO Savings",
      value: "KSh 15,200",
      icon: <TbTrendingUp className="h-6 w-6 text-orange-500" />,
      change: "+KSh 750",
      changeText: "this month",
      bgClass: "bg-orange-100 dark:bg-orange-900/20",
      borderClass: "border-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${stat.borderClass} border-l-4 border-t-0 border-r-0 border-b-0`}
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgClass}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span
                className={`mr-1 text-${
                  stat.borderClass.split("-")[1]
                }-500 font-medium`}
              >
                {stat.change}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {stat.changeText}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnionStatsGrid;
