import React from "react";
import { FiX } from "react-icons/fi";
import {
  TbReceipt,
  TbReportMoney,
  TbCheck,
  TbInfoCircle,
  TbAlertCircle,
  TbArrowsExchange,
} from "react-icons/tb";

const PaymentDetailModal = ({
  payment,
  onClose,
  onViewReceipt,
  formatCurrency,
  formatDate,
}) => {
  // Get payment status info
  const getPaymentStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "text-green-600 dark:text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/20",
          icon: <TbCheck className="h-4 w-4" />,
          label: "Completed",
        };
      case "pending":
        return {
          color: "text-yellow-600 dark:text-yellow-500",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
          icon: <TbInfoCircle className="h-4 w-4" />,
          label: "Pending",
        };
      case "processing":
        return {
          color: "text-blue-600 dark:text-blue-500",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
          icon: <TbArrowsExchange className="h-4 w-4" />,
          label: "Processing",
        };
      case "failed":
        return {
          color: "text-red-600 dark:text-red-500",
          bgColor: "bg-red-100 dark:bg-red-900/20",
          icon: <TbAlertCircle className="h-4 w-4" />,
          label: "Failed",
        };
      case "refunded":
        return {
          color: "text-purple-600 dark:text-purple-500",
          bgColor: "bg-purple-100 dark:bg-purple-900/20",
          icon: <TbArrowsExchange className="h-4 w-4" />,
          label: "Refunded",
        };
      default:
        return {
          color: "text-gray-600 dark:text-gray-500",
          bgColor: "bg-gray-100 dark:bg-gray-900/20",
          icon: <TbInfoCircle className="h-4 w-4" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                  <TbReportMoney className="h-6 w-6 mr-2 text-admin-600" />
                  Payment Details
                </h3>
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Transaction ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {payment.id}
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date & Time
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formatDate(payment.date, true)}
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        User
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        <div className="flex items-center">
                          {payment.userName}{" "}
                          <span className="text-xs text-gray-500 ml-2">
                            (ID: {payment.userId})
                          </span>
                        </div>
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Amount
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formatCurrency(payment.amount)}
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getPaymentStatusInfo(payment.status).color
                          } ${getPaymentStatusInfo(payment.status).bgColor}`}
                        >
                          {getPaymentStatusInfo(payment.status).icon}
                          <span className="ml-1">
                            {getPaymentStatusInfo(payment.status).label}
                          </span>
                        </span>
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment Method
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {payment.method}
                        {payment.mpesaCode && (
                          <span className="text-xs text-gray-500 ml-2">
                            (M-Pesa Code: {payment.mpesaCode})
                          </span>
                        )}
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Insurance Plan
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {payment.plan}{" "}
                        <span className="text-xs text-gray-500 capitalize">
                          ({payment.coveragePeriod} payment)
                        </span>
                      </dd>
                    </div>
                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Reference
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {payment.reference}
                      </dd>
                    </div>
                    {payment.processingTime && (
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Processing Time
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                          {payment.processingTime}
                        </dd>
                      </div>
                    )}
                    {payment.notes && (
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Notes
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                          {payment.notes}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-admin-600 text-base font-medium text-white hover:bg-admin-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onViewReceipt}
            >
              <TbReceipt className="mr-2 h-4 w-4" />
              View Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
