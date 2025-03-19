import React from "react";
import { FiDownload, FiX } from "react-icons/fi";
import { TbReceipt } from "react-icons/tb";

const PaymentReceiptModal = ({
  payment,
  onClose,
  formatCurrency,
  formatDate,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                <TbReceipt className="h-6 w-6 mr-2 text-blue-600" />
                Payment Receipt
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
              {/* Receipt Content */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Crew Afya
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Health Insurance Solutions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Receipt Number:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.paymentDetails.receiptNumber}
                    </p>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Payment Receipt
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(payment.date, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Transaction ID:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {payment.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment Method:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {payment.method}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Reference:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {payment.reference}
                      </p>
                    </div>
                    {payment.mpesaCode && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          M-Pesa Code:
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {payment.mpesaCode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Payment Details
                  </h3>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">
                          {payment.plan} ({payment.coveragePeriod} plan)
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white text-right">
                          {formatCurrency(payment.amount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                          Transaction Fee
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-right">
                          {formatCurrency(
                            Number(payment.paymentDetails.transactionFee)
                          )}
                        </td>
                      </tr>
                      <tr className="font-bold">
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">
                          Total
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-white text-right">
                          {formatCurrency(
                            payment.amount +
                              Number(payment.paymentDetails.transactionFee)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Thank you for your payment!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This is a computer generated receipt and does not require a
                    physical signature.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                // Simulate downloading receipt
                alert(
                  `Receipt for payment ${payment.id} would be downloaded in a real implementation.`
                );
              }}
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Download Receipt
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default PaymentReceiptModal;
