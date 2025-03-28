import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { formatDate2 } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import * as adminPaymentService from "../../services/adminPaymentService";

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
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);

  // Ref for export button
  const exportButtonRef = useRef(null);

  // Initialize loading skeleton count
  const skeletonCount = 10;

  // Fetch payments data
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy,
          sortOrder: sortOrder,
        };

        // Add filters if set
        if (searchTerm) params.search = searchTerm;
        if (statusFilter !== "all") params.status = statusFilter;
        if (methodFilter !== "all") params.method = methodFilter;
        if (planFilter !== "all") params.plan = planFilter;
        if (dateRange.start && dateRange.end) {
          params.startDate = dateRange.start;
          params.endDate = dateRange.end;
        }

        // Fetch payments from API
        const response = await adminPaymentService.fetchAllPayments(params);

        if (response.success) {
          setPayments(response.data.payments);
          setTotalItems(response.data.total);
        } else {
          setError("Failed to fetch payments");
        }

        // Fetch payment statistics
        const statsResponse = await adminPaymentService.getPaymentStats();
        if (statsResponse.success) {
          setPaymentStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("An error occurred while fetching payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [refreshTrigger, currentPage, itemsPerPage, sortBy, sortOrder]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setStatusFilter("all");
    setMethodFilter("all");
    setPlanFilter("all");
    setCurrentPage(1);
    setRefreshTrigger((prev) => prev + 1);
  };

  // View payment details
  const handleViewPayment = async (payment) => {
    try {
      // Fetch detailed payment info
      const response = await adminPaymentService.getPaymentById(payment.id);
      if (response.success) {
        setSelectedPayment(response.data);
        setIsPaymentDetailsModalOpen(true);
      } else {
        alert("Could not fetch payment details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      alert("Error fetching payment details");
    }
  };

  // View payment receipt
  const handleViewReceipt = async (payment) => {
    try {
      // Fetch receipt data
      const response = await adminPaymentService.generatePaymentReceipt(
        payment.id
      );
      if (response.success) {
        setSelectedPayment({ ...payment, paymentDetails: response.data });
        setIsReceiptModalOpen(true);
      } else {
        alert("Could not generate receipt");
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Error generating receipt");
    }
  };

  // View audit trail
  const handleViewAuditTrail = async (payment) => {
    try {
      // Fetch audit trail
      const response = await adminPaymentService.getPaymentAuditTrail(
        payment.id
      );
      if (response.success) {
        setSelectedPayment({
          ...payment,
          auditTrail: response.data.events,
        });
        setIsAuditModalOpen(true);
      } else {
        alert("Could not fetch audit trail");
      }
    } catch (error) {
      console.error("Error fetching audit trail:", error);
      alert("Error fetching audit trail");
    }
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
    // Reset to first page when sorting changes
    setCurrentPage(1);
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
  const exportDataInFormat = async (format) => {
    try {
      // Collect current filters to pass to the export endpoint
      const filters = {
        status: statusFilter !== "all" ? statusFilter : undefined,
        method: methodFilter !== "all" ? methodFilter : undefined,
        plan: planFilter !== "all" ? planFilter : undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        searchTerm: searchTerm || undefined,
      };

      const exportButtonEl = exportButtonRef.current;
      if (exportButtonEl) {
        exportButtonEl.innerHTML = "Exporting...";
        exportButtonEl.disabled = true;
      }

      // Call export API
      const response = await adminPaymentService.exportPaymentsData(
        format,
        filters
      );

      if (response.success) {
        alert(
          `Payment data exported in ${format.toUpperCase()} format successfully!`
        );

        // In a real-world scenario, you might trigger a download here
        // window.location.href = response.data.downloadUrl;
      } else {
        alert(`Failed to export data: ${response.message}`);
      }
    } catch (error) {
      console.error(`Error exporting data as ${format}:`, error);
      alert(`Error exporting data as ${format}`);
    } finally {
      // Reset button state
      const exportButtonEl = exportButtonRef.current;
      if (exportButtonEl) {
        exportButtonEl.innerHTML = "Export <FiChevronDown />";
        exportButtonEl.disabled = false;
      }

      // Hide the dropdown
      const menu = document.getElementById("export-menu");
      if (menu) {
        menu.classList.add("hidden");
      }
    }
  };

  // Check if any filters are active
  const hasActiveFilters =
    statusFilter !== "all" ||
    methodFilter !== "all" ||
    planFilter !== "all" ||
    (dateRange.start && dateRange.end);

  // Get unique values for filters from the loaded data
  const getUniqueValues = (field) => {
    if (!payments || payments.length === 0) return ["all"];
    return ["all", ...new Set(payments.map((p) => p[field]).filter(Boolean))];
  };

  const uniqueStatuses = getUniqueValues("status");
  const uniqueMethods = getUniqueValues("paymentMethod");
  const uniquePlans =
    payments.length > 0 && payments[0].metadata?.plan
      ? [
          "all",
          ...new Set(payments.map((p) => p.metadata?.plan).filter(Boolean)),
        ]
      : ["all"];

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <PaymentHeader pageTitle="Payment Management" />

      <PaymentStats
        stats={paymentStats}
        loading={loading}
        darkMode={darkMode}
      />

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
        totalItems={totalItems}
        handleSortChange={handleSortChange}
        handleViewPayment={handleViewPayment}
        handleViewReceipt={handleViewReceipt}
        handleViewAuditTrail={handleViewAuditTrail}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        handleResetFilters={handleResetFilters}
        formatCurrency={formatCurrency}
        formatDate={formatDate2}
        handleExportData={handleExportData}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
        toggleFilters={toggleFilters}
        showFilters={showFilters}
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

      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Modals */}
      {isPaymentDetailsModalOpen && selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setIsPaymentDetailsModalOpen(false)}
          onViewReceipt={() => {
            setIsPaymentDetailsModalOpen(false);
            handleViewReceipt(selectedPayment);
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
