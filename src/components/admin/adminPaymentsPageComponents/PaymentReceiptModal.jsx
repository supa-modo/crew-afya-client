import React, { useRef } from "react";
import { FiDownload, FiX, FiPrinter } from "react-icons/fi";
import { TbReceipt, TbCheck } from "react-icons/tb";
import Logo from "/logo.png"; // Add your logo path here

const PaymentReceiptModal = ({
  payment,
  onClose,
  formatCurrency,
  formatDate,
}) => {
  const receiptRef = useRef(null);

  // Handle print receipt
  const handlePrintReceipt = () => {
    const receiptContent = receiptRef.current;
    if (!receiptContent) return;

    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Payment Receipt</title>");

    // Add print styles
    printWindow.document.write(`
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; }
        .receipt-container { max-width: 800px; margin: 0 auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .logo { max-width: 180px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #333; }
        .subtitle { font-size: 14px; color: #666; margin-bottom: 20px; }
        .receipt-id { font-size: 16px; font-weight: 600; }
        .section { margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .section-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #333; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item-label { font-size: 14px; color: #666; margin-bottom: 4px; }
        .info-item-value { font-size: 15px; color: #333; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 10px; border-bottom: 2px solid #eee; font-size: 14px; color: #666; text-transform: uppercase; }
        td { padding: 12px 10px; border-bottom: 1px solid #eee; }
        .amount-col { text-align: right; }
        .total-row td { font-weight: bold; border-top: 2px solid #ddd; border-bottom: none; padding-top: 15px; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 14px; }
        .small-text { font-size: 12px; color: #999; margin-top: 8px; }
        .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: 600; }
        .status-completed { background-color: rgba(16, 185, 129, 0.1); color: rgb(16, 185, 129); }
      </style>
    `);

    printWindow.document.write("</head><body>");
    printWindow.document.write(receiptContent.innerHTML);
    printWindow.document.write("</body></html>");

    printWindow.document.close();
    printWindow.focus();

    // Add slight delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    // In a real implementation, you might call an API to generate a PDF file
    // For now, simulate a download
    alert(
      `Receipt for payment ${payment.id} would be downloaded in a real implementation.`
    );
  };

  const receiptData = payment.paymentDetails || {
    receiptNumber: `RCPT-${payment.id?.substring(0, 8) || "12345678"}`,
    transactionFee: 0,
  };

  const getStatusBadgeClass = () => {
    let statusClass = "";
    switch (payment.status) {
      case "completed":
        statusClass =
          "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500";
        break;
      case "pending":
        statusClass =
          "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500";
        break;
      case "failed":
        statusClass =
          "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500";
        break;
      default:
        statusClass =
          "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-500";
    }
    return statusClass;
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
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
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
              <div
                ref={receiptRef}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg"
              >
                {/* Receipt Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    {/* Replace with your actual logo */}
                    <div className="bg-blue-600 text-white p-3 rounded-lg mr-3">
                      <TbReceipt className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Matatu Workers Union
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        CrewAfya Medical Insurance Cover
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      RECEIPT
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      #{receiptData.receiptNumber}
                    </p>
                    <span
                      className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}
                    >
                      {payment.status === "completed" && (
                        <TbCheck className="mr-1 h-3 w-3" />
                      )}
                      {payment.status?.charAt(0).toUpperCase() +
                        payment.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Date and Transaction Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Issue Date
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(payment.date, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Transaction ID
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-mono">
                      {payment.id || receiptData.transactionId}
                    </p>
                  </div>
                </div>

                {/* Customer and Payment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Details */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Customer Information
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                      {receiptData.customer?.name || "Customer Name"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Member No:{" "}
                      {receiptData.customer?.membershipNumber || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Phone:{" "}
                      {receiptData.customer?.phoneNumber ||
                        payment.phoneNumber ||
                        "N/A"}
                    </p>
                    {receiptData.customer?.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email: {receiptData.customer.email}
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Payment Details
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-white mb-1">
                      <span className="font-medium">Method:</span>{" "}
                      {payment.method || payment.paymentMethod}
                    </p>
                    {payment.reference && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">Reference:</span>{" "}
                        {payment.reference}
                      </p>
                    )}
                    {payment.mpesaCode && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">M-Pesa Code:</span>{" "}
                        {payment.mpesaCode}
                      </p>
                    )}
                    {receiptData.mpesaReceiptNumber && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">M-Pesa Receipt:</span>{" "}
                        {receiptData.mpesaReceiptNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Items */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Payment Summary
                  </h3>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.description || receiptData.description || (
                            <>
                              {payment.plan || "Insurance"}{" "}
                              {payment.coveragePeriod
                                ? `(${payment.coveragePeriod} plan)`
                                : "Premium"}
                            </>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                          {formatCurrency(payment.amount)}
                        </td>
                      </tr>
                      {Number(receiptData.transactionFee) > 0 && (
                        <tr>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            Transaction Fee
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {formatCurrency(Number(receiptData.transactionFee))}
                          </td>
                        </tr>
                      )}
                      <tr className="font-bold">
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          Total
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                          {formatCurrency(
                            payment.amount +
                              Number(receiptData.transactionFee || 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thank you for your payment.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    This is an official receipt for your payment transaction.
                    For any inquiries, please contact our support team.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
              onClick={handleDownloadReceipt}
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Download Receipt
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handlePrintReceipt}
            >
              <FiPrinter className="mr-2 h-4 w-4" />
              Print
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
