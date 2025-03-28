import React from "react";
import { FiX } from "react-icons/fi";
import {
  TbCheck,
  TbInfoCircle,
  TbArrowsExchange,
  TbAlertCircle,
  TbHistory,
  TbClock,
  TbUser,
  TbCreditCard,
} from "react-icons/tb";
import { MpesaIcon } from "../../common/icons";

const PaymentAuditModal = ({ payment, onClose, formatDate }) => {
  const getPaymentMethod = (paymentMethod) => {
    if (payment.paymentMethod == 'mpesa') {
      return <MpesaIcon width={64} height={24}/>;
    } return paymentMethod;
  }
  // Get payment status info
  const getStatusInfo = (status) => {
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
      // case "refunded":
      //   return {
      //     color: "text-purple-600 dark:text-purple-500",
      //     bgColor: "bg-purple-100 dark:bg-purple-900/20",
      //     icon: <TbArrowsExchange className="h-4 w-4" />,
      //     label: "Refunded",
      //   };
      case "created":
        return {
          color: "text-blue-600 dark:text-blue-500",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
          icon: <TbCreditCard className="h-4 w-4" />,
          label: "Created",
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

  // Use the audit trail from the payment object, or generate a fallback
  const getAuditEvents = () => {
    // If the API has returned actual audit trail events, use those
    if (payment.auditTrail && payment.auditTrail.length > 0) {
      return payment.auditTrail;
    }

    // Fallback: Generate mock events based on payment status
    const events = [
      {
        id: 1,
        status: "created",
        description: "Payment created",
        details: `Transaction initiated via ${
          payment.method || payment.paymentMethod
        }`,
        date: new Date(payment.date),
        type: "payment",
      },
    ];

    // Add events based on payment status
    if (payment.status === "processing") {
      events.push({
        id: 2,
        status: "processing",
        description: "Payment processing",
        details: "Waiting for payment gateway confirmation",
        date: new Date(new Date(payment.date).getTime() + 5 * 60000), // 5 mins after
        type: "payment",
      });
    } else if (payment.status === "completed") {
      events.push({
        id: 2,
        status: "processing",
        description: "Payment processing",
        details: "Waiting for payment gateway confirmation",
        date: new Date(new Date(payment.date).getTime() + 5 * 60000), // 5 mins after
        type: "payment",
      });
      events.push({
        id: 3,
        status: "completed",
        description: "Payment completed",
        details: "Transaction successfully processed",
        date: new Date(new Date(payment.date).getTime() + 10 * 60000), // 10 mins after
        type: "payment",
      });
    } else if (payment.status === "failed") {
      events.push({
        id: 2,
        status: "processing",
        description: "Payment processing",
        details: "Waiting for payment gateway confirmation",
        date: new Date(new Date(payment.date).getTime() + 2 * 60000), // 2 mins after
        type: "payment",
      });
      events.push({
        id: 3,
        status: "failed",
        description: "Payment failed",
        details: "Transaction declined by payment provider",
        date: new Date(new Date(payment.date).getTime() + 3 * 60000), // 3 mins after
        type: "payment",
      });
    } else if (payment.status === "refunded") {
      events.push({
        id: 2,
        status: "processing",
        description: "Payment processing",
        details: "Waiting for payment gateway confirmation",
        date: new Date(new Date(payment.date).getTime() + 5 * 60000), // 5 mins after
        type: "payment",
      });
      events.push({
        id: 3,
        status: "completed",
        description: "Payment completed",
        details: "Transaction successfully processed",
        date: new Date(new Date(payment.date).getTime() + 10 * 60000), // 10 mins after
        type: "payment",
      });
      events.push({
        id: 4,
        status: "refunded",
        description: "Payment refunded",
        details: "Full amount refunded to user",
        date: new Date(new Date(payment.date).getTime() + 2 * 24 * 60 * 60000), // 2 days after
        type: "payment",
      });
    }

    return events;
  };

  const auditEvents = getAuditEvents();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                <TbHistory className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-400" />
                Payment Audit Trail
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* Transaction Information */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Transaction ID
                  </p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white truncate">
                    {payment.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getPaymentMethod(payment.method || payment.paymentMethod)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <p className="text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusInfo(payment.status).color
                      } ${getStatusInfo(payment.status).bgColor}`}
                    >
                      {getStatusInfo(payment.status).icon}
                      <span className="ml-1">
                        {getStatusInfo(payment.status).label}
                      </span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Audit Events Title */}
              <div className="relative mb-4">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Transaction Timeline
                  </span>
                </div>
              </div>

              {/* Audit Events Timeline */}
              <div className="mt-4 flow-root px-2">
                <ul className="-mb-8">
                  {auditEvents.map((event, eventIdx) => {
                    const statusInfo = getStatusInfo(event.status);

                    return (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== auditEvents.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                              aria-hidden="true"
                            ></span>
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full ${statusInfo.bgColor} flex items-center justify-center ring-4 ring-white dark:ring-gray-800`}
                              >
                                {statusInfo.icon}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {event.description}
                                </p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                                  {event.details}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400 flex flex-col items-end">
                                <div className="mb-1">
                                  <TbClock className="inline h-3 w-3 mr-1" />
                                  {formatDate(event.date, true)}
                                </div>
                                {event.user && (
                                  <div className="text-xs text-gray-400 dark:text-gray-500">
                                    <TbUser className="inline h-3 w-3 mr-1" />
                                    {event.user}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {auditEvents.length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No audit events found for this transaction.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAuditModal;
