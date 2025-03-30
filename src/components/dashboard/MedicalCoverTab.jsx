import React from "react";
import {
  TbShieldCheckFilled,
  TbActivity,
  TbCreditCardPay,
  TbCalendarEvent,
  TbClock,
  TbCurrency,
} from "react-icons/tb";
import { FiPhone, FiUpload } from "react-icons/fi";

const MedicalCoverTab = ({ user, handleOpenFrequencyModal }) => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    <TbShieldCheckFilled className="mr-2 h-6 w-6" />
                    Crew Afya Lite
                  </h2>
                  <p className="mt-1 text-blue-100">For Driver/Conductor</p>
                </div>
                <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium">
                  Active
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-100 text-sm">Policy Number</p>
                  <p className="font-medium">MWU-24367</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Coverage Period</p>
                  <p className="font-medium">Oct 2023 - Oct 2024</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Coverage Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Premium Payment
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      Daily
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Daily Amount
                    </span>
                    <span className="text-lg text-blue-600 dark:text-blue-400 font-bold">
                      KSh 24
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Monthly Equivalent
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      KSh 713
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Next Payment
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      Tomorrow
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Amount Due
                    </span>
                    <span className="text-lg text-blue-600 dark:text-blue-400 font-bold">
                      KSh 24
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Payment Method
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      M-Pesa
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Coverage Details
              </h3>

              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Benefit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Limit
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Used
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Available
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { name: "Inpatient", limit: 200000, used: 50000 },
                      { name: "Outpatient", limit: 20000, used: 8500 },
                      { name: "Maternity", limit: 20000, used: 0 },
                      { name: "Optical", limit: 5000, used: 3000 },
                      { name: "Dental", limit: 5000, used: 0 },
                      { name: "Accidents", limit: 50000, used: 0 },
                    ].map((benefit, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {benefit.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                          KSh {benefit.limit.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                          KSh {benefit.used.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium text-right">
                          KSh {(benefit.limit - benefit.used).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Coverage Utilization
              </h3>

              <div className="space-y-4 mb-6">
                {[
                  { name: "Inpatient", used: 50000, total: 200000 },
                  { name: "Outpatient", used: 8500, total: 20000 },
                  { name: "Optical", used: 3000, total: 5000 },
                ].map((benefit) => {
                  const percentage = (benefit.used / benefit.total) * 100;
                  return (
                    <div key={benefit.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {benefit.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {percentage.toFixed(1)}% Used
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full ${
                            percentage > 75
                              ? "bg-red-600"
                              : percentage > 50
                              ? "bg-yellow-600"
                              : "bg-green-600"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>KSh {benefit.used.toLocaleString()} used</span>
                        <span>KSh {benefit.total.toLocaleString()} limit</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <TbCreditCardPay className="mr-2 h-5 w-5" />
                  Make Payment
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <FiUpload className="mr-2 h-5 w-5" />
                  Upload Medical Claim
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <TbActivity className="mr-2 h-5 w-5 text-blue-600" />
                Recent Medical Claims
              </h3>

              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Service
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Provider
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      {
                        date: "Oct 10, 2023",
                        service: "Outpatient Visit",
                        provider: "Nairobi Hospital",
                        amount: 2500,
                        status: "Approved",
                      },
                      {
                        date: "Sep 22, 2023",
                        service: "Prescription",
                        provider: "Goodlife Pharmacy",
                        amount: 1800,
                        status: "Approved",
                      },
                      {
                        date: "Aug 15, 2023",
                        service: "Dental Checkup",
                        provider: "Smile Dental",
                        amount: 3000,
                        status: "Pending",
                      },
                      {
                        date: "Jul 30, 2023",
                        service: "Optical Services",
                        provider: "Optica",
                        amount: 3000,
                        status: "Approved",
                      },
                    ].map((claim, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {claim.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {claim.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {claim.provider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                          KSh {claim.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              claim.status === "Approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : claim.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
            <div className="bg-primary-600 p-4">
              <h3 className="text-white font-semibold flex items-center">
                <TbCreditCardPay className="mr-2 h-5 w-5" />
                Payment Schedule
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <TbClock className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Next Payment
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    Tomorrow
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <TbCurrency className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Amount Due
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    KSh 24
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <TbCalendarEvent className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Frequency
                    </span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    Daily
                  </span>
                </div>
              </div>
              <button
                onClick={handleOpenFrequencyModal}
                className="mt-4 w-full py-2 text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg font-medium text-sm"
              >
                Change Payment Frequency
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
            <div className="bg-blue-600 p-4">
              <h3 className="text-white font-semibold flex items-center">
                <TbShieldCheckFilled className="mr-2 h-5 w-5" />
                Medical Plan Options
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10 relative">
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    Current
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Crew Afya Lite
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    For Driver/Conductor
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Daily
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      KSh 24
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      KSh 713
                    </span>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Crew Afya - (Up to M+3)
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    For Driver/Conductor + Dependents
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Daily
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      KSh 55
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monthly
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      KSh 1,661
                    </span>
                  </div>
                  <button className="mt-3 w-full py-2 text-blue-600 bg-white hover:bg-blue-50 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-800 font-medium text-sm">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
            <h3 className="font-semibold text-lg mb-2">
              Need Medical Assistance?
            </h3>
            <p className="text-blue-100 mb-4 text-sm">
              Our 24/7 medical helpline is available for all union members.
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <FiPhone className="h-5 w-5" />
              <span className="font-semibold">0800 123 456</span>
            </div>
            <p className="text-xs text-blue-200">
              Free call for medical emergencies and advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCoverTab;
