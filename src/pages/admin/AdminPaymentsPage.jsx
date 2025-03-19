import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { generateMockPayments } from "../../utils/paymentsGenerator";
import { formatDate2 } from "../../utils/formatDate";

// Import components
import PaymentHeader from "../../components/admin/adminPaymentsPageComponents/PaymentHeader";
import PaymentStats from "../../components/admin/adminPaymentsPageComponents/PaymentStats";
import PaymentFilters from "../../components/admin/adminPaymentsPageComponents/PaymentFilters";
import PaymentTable from "../../components/admin/adminPaymentsPageComponents/PaymentTable";
import PaymentDetailModal from "../../components/admin/adminPaymentsPageComponents/PaymentDetailModal";
import PaymentReceiptModal from "../../components/admin/adminPaymentsPageComponents/PaymentReceiptModal";
import PaymentAuditModal from "../../components/admin/adminPaymentsPageComponents/PaymentAuditModal";

const AdminPaymentsPage = () => {
  const { darkMode } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] =
    useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [paymentStats, setPaymentStats] = useState({
    totalAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    refundedAmount: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Ref for export button
  const exportButtonRef = useRef(null);

  // Initialize loading skeleton count
  const skeletonCount = 10;

  // Fetch payments data
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Generate mock payment data
        const mockPayments = generateMockPayments(125);
        setPayments(mockPayments);

        // Calculate statistics
        calculatePaymentStats(mockPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [refreshTrigger]);

  // Calculate payment statistics
  const calculatePaymentStats = (paymentsData) => {
    const stats = paymentsData.reduce(
      (acc, payment) => {
        // Total amount from completed payments
        if (payment.status === "completed") {
          acc.totalAmount += payment.amount;
          acc.completedCount += 1;
        }

        // Count by status
        if (payment.status === "pending") {
          acc.pendingCount += 1;
        } else if (payment.status === "failed") {
          acc.failedCount += 1;
        } else if (payment.status === "refunded") {
          acc.refundedAmount += payment.amount;
        }

        return acc;
      },
      {
        totalAmount: 0,
        completedCount: 0,
        pendingCount: 0,
        failedCount: 0,
        refundedAmount: 0,
      }
    );

    setPaymentStats(stats);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setStatusFilter("all");
    setMethodFilter("all");
    setPlanFilter("all");
    setCurrentPage(1);
  };

  // View payment details
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentDetailsModalOpen(true);
  };

  // View payment receipt
  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setIsReceiptModalOpen(true);
  };

  // View audit trail
  const handleViewAuditTrail = (payment) => {
    setSelectedPayment(payment);
    setIsAuditModalOpen(true);
  };

  // Handle sort change
  const handleSortChange = (column) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to descending order
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle export data
  const handleExportData = () => {
    // Show the export options dropdown menu
    const menu = document.getElementById("export-menu");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  };

  // Export data in specific format
  const exportDataInFormat = (format) => {
    // In a real application, implement the export logic based on the format
    console.log(`Exporting data in ${format} format`);

    // Simulate export process
    const exportButtonEl = exportButtonRef.current;
    if (exportButtonEl) {
      exportButtonEl.innerHTML = "Exporting...";
      exportButtonEl.disabled = true;

      setTimeout(() => {
        exportButtonEl.innerHTML = "Export <FiChevronDown />";
        exportButtonEl.disabled = false;
        alert(
          `Payment data exported in ${format.toUpperCase()} format successfully!`
        );
      }, 1500);
    }

    // Hide the dropdown
    const menu = document.getElementById("export-menu");
    if (menu) {
      menu.classList.add("hidden");
    }
  };

  // Check if any filters are active
  const hasActiveFilters =
    statusFilter !== "all" ||
    methodFilter !== "all" ||
    planFilter !== "all" ||
    (dateRange.start && dateRange.end);

  // Get unique values for filters
  const uniqueStatuses = ["all", ...new Set(payments.map((p) => p.status))];
  const uniqueMethods = ["all", ...new Set(payments.map((p) => p.method))];
  const uniquePlans = ["all", ...new Set(payments.map((p) => p.plan))];

  return (
    <div className="pb-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header with search and action buttons */}
        <PaymentHeader
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
          onExport={handleExportData}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFilters={hasActiveFilters}
        />

        {/* Export options dropdown */}
        <div
          id="export-menu"
          className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 border border-gray-200 dark:border-gray-700 py-1"
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => exportDataInFormat("csv")}
          >
            Export as CSV
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => exportDataInFormat("excel")}
          >
            Export as Excel
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => exportDataInFormat("pdf")}
          >
            Export as PDF
          </button>
        </div>

        {/* Stats Cards */}
        <PaymentStats stats={paymentStats} formatCurrency={formatCurrency} />

        {/* Filters Panel */}
        {showFilters && (
          <PaymentFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            planFilter={planFilter}
            setPlanFilter={setPlanFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            uniqueStatuses={uniqueStatuses}
            uniqueMethods={uniqueMethods}
            uniquePlans={uniquePlans}
            handleResetFilters={handleResetFilters}
          />
        )}

        {/* Payments Table */}
        <PaymentTable
          loading={loading}
          payments={payments}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          methodFilter={methodFilter}
          planFilter={planFilter}
          dateRange={dateRange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          handleSortChange={handleSortChange}
          handleViewPayment={handleViewPayment}
          handleViewReceipt={handleViewReceipt}
          handleViewAuditTrail={handleViewAuditTrail}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          handleResetFilters={handleResetFilters}
          formatCurrency={formatCurrency}
          formatDate={formatDate2}
        />
      </div>

      {/* Modals */}
      {isPaymentDetailsModalOpen && selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setIsPaymentDetailsModalOpen(false)}
          onViewReceipt={() => {
            setIsPaymentDetailsModalOpen(false);
            setIsReceiptModalOpen(true);
          }}
          formatCurrency={formatCurrency}
          formatDate={formatDate2}
        />
      )}

      {isReceiptModalOpen && selectedPayment && (
        <PaymentReceiptModal
          payment={selectedPayment}
          onClose={() => setIsReceiptModalOpen(false)}
          formatCurrency={formatCurrency}
          formatDate={formatDate2}
        />
      )}

      {isAuditModalOpen && selectedPayment && (
        <PaymentAuditModal
          payment={selectedPayment}
          onClose={() => setIsAuditModalOpen(false)}
          formatCurrency={formatCurrency}
          formatDate={formatDate2}
        />
      )}
    </div>
  );
};

export default AdminPaymentsPage;
