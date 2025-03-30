import React, { useRef } from "react";
import { FiDownload, FiX, FiPrinter } from "react-icons/fi";
import { TbReceipt, TbCheck } from "react-icons/tb";
import { formatDate2 } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";

const PaymentReceiptModal = ({ payment, onClose }) => {
  const receiptRef = useRef(null);

  // Enhanced print receipt function
  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to print the receipt");
      return;
    }

    // Get status class and badge text for the receipt
    const getStatusClass = () => {
      switch (payment.status) {
        case "completed":
          return "status-completed";
        case "pending":
          return "status-pending";
        case "failed":
          return "status-failed";
        default:
          return "";
      }
    };

    const getStatusIcon = () => {
      return payment.status === "completed" ? "✓ " : "";
    };

    const statusText =
      payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1);
    const receiptData = payment.paymentDetails || {
      receiptNumber: `RCPT-${
        payment.id?.substring(0, 8).toUpperCase() || "12345678"
      }`,
      transactionFee: 0,
    };

    const subtitle = getSubtitle();

    // Construct the receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt - Matatu Workers Union</title>
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Lexend', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          body {
            background-color: white;
            color: #1a202c;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .receipt-container {
            background-color: white;
            border-radius: 0.5rem;
            padding: 2rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          }
          
          .receipt-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
          }
          
          .logo-container {
            display: flex;
            align-items: center;
          }
          
          .logo {
            width: 4.5rem;
            height: auto;
            margin-right: 0.75rem;
            border-radius: 9999px;
            background: white;
          }
          
          .company-name {
            font-size: 1.25rem;
            font-weight: 700;
            color: #4a5568;
          }
          
          .receipt-info {
            text-align: right;
          }
          
          .receipt-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: #718096;
          }
          
          .receipt-number {
            font-size: 1.125rem;
            font-weight: 700;
            color: #2d3748;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            margin-top: 0.25rem;
            padding: 0.125rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }
          
          .status-completed {
            background-color: #c6f6d5;
            color: #2f855a;
          }
          
          .status-pending {
            background-color: #fefcbf;
            color: #b7791f;
          }
          
          .status-failed {
            background-color: #fed7d7;
            color: #c53030;
          }
          
          .section {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          
          .section-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #718096;
            margin-bottom: 0.75rem;
          }
          
          .customer-name {
            font-size: 0.875rem;
            font-weight: 500;
            color: #2d3748;
            margin-bottom: 0.25rem;
          }
          
          .detail-text {
            font-size: 0.875rem;
            color: #4a5568;
            margin-bottom: 0.25rem;
          }
          
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }
          
          th {
            padding: 0.75rem;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 500;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          th:last-child {
            text-align: right;
          }
          
          td {
            padding: 0.75rem;
            font-size: 0.875rem;
            color: #2d3748;
            border-top: 1px solid #e2e8f0;
          }
          
          td:last-child {
            text-align: right;
          }
          
          .total-row {
            font-weight: 700;
          }
          
          .footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer p {
            font-size: 0.875rem;
            color: #4a5568;
            margin-bottom: 0.5rem;
          }
          
          .footer .disclaimer {
            font-size: 0.75rem;
            color: #718096;
          }
          
          @media print {
            body {
              padding: 0;
              background: white;
            }
            
            .receipt-container {
              box-shadow: none;
              padding: 1rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <!-- Receipt Header -->
          <div class="receipt-header">
            <div class="logo-container">
              <img src="/mwulogo.png" alt="Matatu Workers Union Logo" class="logo">
              <div>
                <h2 class="company-name">Matatu Workers Union</h2>
                <p class="detail-text">${subtitle}</p>
              </div>
            </div>
            <div class="receipt-info">
              <p class="receipt-label">RECEIPT</p>
              <p class="receipt-number">#${receiptData.receiptNumber}</p>
              <span class="status-badge ${getStatusClass()}">
                ${getStatusIcon()}${statusText}
              </span>
            </div>
          </div>

          <!-- Date and Transaction Info -->
          <div class="grid-2 section">
            <div>
              <p class="receipt-label">Issue Date</p>
              <p class="detail-text">${formatDate2(
                payment.paymentDate,
                true
              )}</p>
            </div>
            <div>
              <p class="receipt-label">Transaction ID</p>
              <p class="detail-text" style="font-family: monospace;">${
                payment.id || receiptData.transactionId
              }</p>
            </div>
          </div>

          <!-- Customer and Payment Details -->
          <div class="grid-2 section">
            <!-- Customer Details -->
            <div>
              <h3 class="section-title">Customer Information</h3>
              <p class="customer-name">${
                receiptData.customer?.name || "Customer Name"
              }</p>
              <p class="detail-text">Member No: ${
                receiptData.customer?.membershipNumber || "N/A"
              }</p>
              <p class="detail-text">Phone: ${
                receiptData.customer?.phoneNumber ||
                payment.phoneNumber ||
                "N/A"
              }</p>
              ${
                receiptData.customer?.email
                  ? `<p class="detail-text">Email: ${receiptData.customer.email}</p>`
                  : ""
              }
            </div>

            <!-- Payment Method -->
            <div>
              <h3 class="section-title">Payment Details</h3>
              <p class="detail-text"><span style="font-weight: 500;">Method:</span> ${
                payment.method || payment.paymentMethod
              }</p>
              ${
                payment.reference
                  ? `<p class="detail-text"><span style="font-weight: 500;">Reference:</span> ${payment.reference}</p>`
                  : ""
              }
              ${
                payment.mpesaCode
                  ? `<p class="detail-text"><span style="font-weight: 500;">M-Pesa Code:</span> ${payment.mpesaCode}</p>`
                  : ""
              }
              ${
                receiptData.mpesaReceiptNumber
                  ? `<p class="detail-text"><span style="font-weight: 500;">M-Pesa Receipt:</span> ${receiptData.mpesaReceiptNumber}</p>`
                  : ""
              }
            </div>
          </div>

          <!-- Payment Items -->
          <div class="section">
            <h3 class="section-title">Payment Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${
                    payment.description ||
                    receiptData.description ||
                    payment.plan ||
                    "Insurance Premium"
                  }</td>
                  <td>${formatCurrency(payment.amount)}</td>
                </tr>
                ${
                  Number(receiptData.transactionFee) > 0
                    ? `
                <tr>
                  <td>Transaction Fee</td>
                  <td>${formatCurrency(Number(receiptData.transactionFee))}</td>
                </tr>`
                    : ""
                }
                <tr class="total-row">
                  <td>Total</td>
                  <td>${formatCurrency(
                    payment.amount + Number(receiptData.transactionFee || 0)
                  )}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Thank you for your payment.</p>
            <p class="disclaimer">This is an official receipt for your payment transaction. For any inquiries, please contact our support team.</p>
            <p class="disclaimer">This is a computer generated receipt and does not require a physical signature.</p>
          </div>
        </div>
        <script>
          // Auto print when the page loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // Write the HTML to the new window and print
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
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
    receiptNumber: `RCPT-${
      payment.id?.substring(0, 8).toUpperCase() || "12345678"
    }`,
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

  const getSubtitle = () => {
    if (payment.metadata?.paymentType === "membership") {
      return "Union Membership Fee";
    }
    return (
      payment.plan ||
      "Insurance" +
        (payment.coveragePeriod
          ? `(${payment.coveragePeriod} plan)`
          : "Premium")
    );
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
                <TbReceipt className="h-6 w-6 mr-2 text-secondary-600" />
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
                    <div className="bg-white mr-3 w-[4.5rem] rounded-full">
                      <img
                        src="/mwulogo.png"
                        alt="logo"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-secondary-700 dark:text-white">
                        Matatu Workers Union
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getSubtitle()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      RECEIPT
                    </p>
                    <p className="text-lg font-bold text-gray-700 dark:text-white">
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
                      {formatDate2(payment.paymentDate, true)}
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
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary-700 text-base font-medium text-white hover:bg-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 sm:ml-3 sm:w-auto sm:text-sm"
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
