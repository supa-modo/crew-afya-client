import { useState, useEffect } from "react";
import { generateMockReportData } from "../utils/mockDataGenerators";

export const useReportData = () => {
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState({});
  const [reportType, setReportType] = useState("financial");
  const [dateRange, setDateRange] = useState("month");
  const [customDateRange, setCustomDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch report data when parameters change
  useEffect(() => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const mockData = generateMockReportData(
        reportType,
        dateRange,
        customDateRange
      );
      setReportsData(mockData);
      setLoading(false);
    }, 1200);
  }, [dateRange, customDateRange, reportType, refreshTrigger]);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return {
    loading,
    reportsData,
    reportType,
    setReportType,
    dateRange,
    setDateRange,
    customDateRange,
    setCustomDateRange,
    refreshData,
  };
};
