// src/components/payment/UnionMembershipHistory.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FiLoader } from "react-icons/fi";
import { apiGet } from "../../services/api";

const UnionMembershipHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membershipPayments, setMembershipPayments] = useState([]);

  useEffect(() => {
    const fetchMembershipPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiGet("/api/v1/union-membership/payments");

        if (response.data.success) {
          setMembershipPayments(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch payment history"
          );
        }
      } catch (error) {
        console.error("Error fetching membership payments:", error);
        setError(error.message || "Failed to fetch payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <FiLoader className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Loading payment history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!membershipPayments || membershipPayments.length === 0) {
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
            {membershipPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {payment.mpesaReceiptNumber || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  KES {Number(payment.amount).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnionMembershipHistory;
