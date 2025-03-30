import React from "react";
import {
  TbUsersGroup,
  TbRoute,
  TbCurrency,
  TbIdBadge2,
  TbCalendarEvent,
} from "react-icons/tb";
import { PiHandshake } from "react-icons/pi";

const MembershipTab = ({ user }) => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <TbUsersGroup className="mr-2 h-6 w-6 text-primary-600" />
            Membership Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white p-6 shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-primary-100 mb-1">
                      Matatu Workers Union
                    </div>
                    <div className="text-xl font-bold mb-4">
                      {user?.firstName} {user?.lastName || "Member"}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-primary-100 text-xs">
                          Member ID
                        </div>
                        <div>{user?.memberId || "MWU-125793"}</div>
                      </div>
                      <div>
                        <div className="text-primary-100 text-xs">
                          Route Number
                        </div>
                        <div>{user?.route || "125"}</div>
                      </div>
                      <div>
                        <div className="text-primary-100 text-xs">
                          Join Date
                        </div>
                        <div>{user?.joinDate || "Jan 15, 2023"}</div>
                      </div>
                      <div>
                        <div className="text-primary-100 text-xs">Status</div>
                        <div>Active</div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex h-16 w-16 rounded-full bg-white/20 items-center justify-center">
                    <TbIdBadge2 className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20 flex justify-between">
                  <div>
                    <div className="text-primary-100 text-xs">
                      Next Dues Payment
                    </div>
                    <div>October 30, 2023</div>
                  </div>
                  <div>
                    <div className="text-primary-100 text-xs">Monthly Dues</div>
                    <div>KSh 300</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <TbRoute className="mr-2 h-5 w-5 text-primary-600" />
                  Route Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Route Number
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {user?.route || "125"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Route Name
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {user?.routeName || "CBD - Kawangware"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      SACCO
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {user?.sacco || "Kawangware Sacco"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Position
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {user?.position || "Driver"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <TbCurrency className="mr-2 h-5 w-5 text-primary-600" />
                  Payment History
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      date: "Sep 30, 2023",
                      amount: "KSh 300",
                      status: "Paid",
                    },
                    {
                      date: "Aug 30, 2023",
                      amount: "KSh 300",
                      status: "Paid",
                    },
                    {
                      date: "Jul 30, 2023",
                      amount: "KSh 300",
                      status: "Paid",
                    },
                  ].map((payment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {payment.date}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Union Dues
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-800 dark:text-white">
                          {payment.amount}
                        </div>
                        <div
                          className={`text-sm ${
                            payment.status === "Paid"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {payment.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm">
                    View All Payment History
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <PiHandshake className="mr-2 h-5 w-5 text-primary-600" />
                  Member Benefits
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      benefit: "Union Representation",
                      status: "Available",
                    },
                    { benefit: "Legal Assistance", status: "Available" },
                    {
                      benefit: "Financial Education",
                      status: "Available",
                    },
                    {
                      benefit: "Route Dispute Resolution",
                      status: "Available",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {benefit.benefit}
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {benefit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipTab;
