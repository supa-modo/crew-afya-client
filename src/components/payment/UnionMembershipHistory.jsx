// src/components/payment/UnionMembershipHistory.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";

const UnionMembershipHistory = () => {
  const [membershipPayment, setMembershipPayment] = useState(null);

  useEffect(() => {
    // Check if user has paid membership
    const hasPaid = localStorage.getItem("unionMembershipPaid") === "true";

    if (hasPaid) {
      // In a real app, you'd fetch this from the backend
      // For now, we'll create a mock payment record
      const mockPayment = {
        id: "mem-" + Math.random().toString(36).substr(2, 9),
        amount: 1000,
        date:
          localStorage.getItem("membershipPaymentDate") ||
          new Date().toISOString(),
        status: "Completed",
        receiptNumber: "MUPM-" + Math.floor(Math.random() * 1000000),
      };

      setMembershipPayment(mockPayment);

      // Store the date if not already stored
      if (!localStorage.getItem("membershipPaymentDate")) {
        localStorage.setItem("membershipPaymentDate", mockPayment.date);
      }
    }
  }, []);

  if (!membershipPayment) {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">
          Membership Payment History
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          No membership payments found. Once you register as a member, your
          payment will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Membership Payment History
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Receipt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(membershipPayment.date), "MMM dd, yyyy")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {membershipPayment.receiptNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                KES {membershipPayment.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {membershipPayment.status}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnionMembershipHistory;
