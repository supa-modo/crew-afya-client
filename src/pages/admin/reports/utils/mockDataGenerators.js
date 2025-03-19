import { format, parseISO, subDays, subMonths } from "date-fns";

// Helper for random ID generation
export const generateRandomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// Helper for random date within range
export const randomDateInRange = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Names for sample data
const sampleNames = [
  "John Smith",
  "Maria Garcia",
  "Ali Mohammed",
  "Sarah Johnson",
  "David Chen",
  "Priya Patel",
  "Mohamed Ahmed",
  "Emma Williams",
  "James Brown",
  "Sofia Rodriguez",
  "Liu Yang",
  "Robert Kim",
  "Fatima Hassan",
  "Carlos Gomez",
  "Aisha Osei",
];

// Payment methods
const paymentMethods = ["M-Pesa", "Card", "Bank Transfer", "Cash"];

// Insurance plans
const insurancePlans = [
  "Basic Plan",
  "Standard Plan",
  "Premium Plan",
  "Family Plan",
];

// Payment statuses
const paymentStatuses = [
  "completed",
  "pending",
  "processing",
  "failed",
  "refunded",
];

// User activities
const userActivities = [
  "Signed up",
  "Updated profile",
  "Made payment",
  "Changed plan",
  "Logged in",
  "Viewed benefits",
  "Contacted support",
  "Added dependents",
];

// Devices
const devices = [
  "Android Mobile",
  "iPhone",
  "Desktop PC",
  "Mac",
  "Tablet",
  "iPad",
];

// Locations
const locations = [
  "Nairobi, Kenya",
  "Mombasa, Kenya",
  "Kisumu, Kenya",
  "Nakuru, Kenya",
  "Eldoret, Kenya",
  "Thika, Kenya",
  "Lagos, Nigeria",
  "Kampala, Uganda",
];

// Mock data generator for reports
export const generateMockReportData = (
  reportType,
  dateRange,
  customDateRange
) => {
  // Define date ranges based on selection
  let startDate, endDate;
  const today = new Date();

  switch (dateRange) {
    case "week":
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = today;
      break;
    case "month":
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      endDate = today;
      break;
    case "quarter":
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 3);
      endDate = today;
      break;
    case "year":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      endDate = today;
      break;
    case "ytd":
      startDate = new Date(today.getFullYear(), 0, 1); // Jan 1 of current year
      endDate = today;
      break;
    case "custom":
      if (customDateRange) {
        startDate = parseISO(customDateRange.start);
        endDate = parseISO(customDateRange.end);
      } else {
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        endDate = today;
      }
      break;
    default:
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      endDate = today;
  }

  // Generate time series data
  const timeSeriesData = [];
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const interval = Math.max(1, Math.floor(days / 15)); // Ensure we don't exceed ~15 data points

  for (let i = 0; i <= days; i += interval) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const dataPoint = {
      date: format(date, "MMM dd, yyyy"),
    };

    // Add specific metrics based on report type
    if (reportType === "financial") {
      dataPoint.revenue = Math.random() * 50000 + 10000;
      dataPoint.transactions = Math.floor(Math.random() * 450 + 50);
      dataPoint.averageValue = dataPoint.revenue / dataPoint.transactions;
      dataPoint.pendingAmount = Math.random() * 10000;
      dataPoint.failedAmount = Math.random() * 5000;
      dataPoint.refundAmount = Math.random() * 3000;
    } else if (reportType === "user") {
      const baseUsers = 1000 + i * 20;
      dataPoint.totalUsers = baseUsers + Math.floor(Math.random() * 100);
      dataPoint.activeUsers = Math.floor(
        dataPoint.totalUsers * (0.4 + Math.random() * 0.3)
      );
      dataPoint.newUsers = Math.floor(Math.random() * 50 + 5);
      dataPoint.userRetention = Math.floor(Math.random() * 30 + 70); // 70%-100%
    } else if (reportType === "insurance") {
      dataPoint.basicPlanUsers = Math.floor(Math.random() * 300 + 100);
      dataPoint.standardPlanUsers = Math.floor(Math.random() * 500 + 200);
      dataPoint.premiumPlanUsers = Math.floor(Math.random() * 200 + 50);
      dataPoint.familyPlanUsers = Math.floor(Math.random() * 200 + 100);
      dataPoint.coverageUtilization = Math.floor(Math.random() * 60 + 20); // 20%-80%
    } else if (reportType === "payment") {
      dataPoint.mpesaTransactions = Math.floor(Math.random() * 250 + 100);
      dataPoint.cardTransactions = Math.floor(Math.random() * 100 + 20);
      dataPoint.bankTransactions = Math.floor(Math.random() * 50 + 10);
      dataPoint.cashTransactions = Math.floor(Math.random() * 20 + 5);
      dataPoint.successRate = Math.floor(Math.random() * 15 + 84); // 84%-99%
      dataPoint.processingTime = Math.floor(Math.random() * 30 + 3); // 3-33 seconds
    }

    timeSeriesData.push(dataPoint);
  }

  // Generate table data
  const tableData = [];
  const tableRows = 10; // Show 10 rows of data in the table

  for (let i = 0; i < tableRows; i++) {
    const randomDate = randomDateInRange(startDate, endDate);
    const formattedDate = format(randomDate, "MMM dd, yyyy");
    const randomStatusIndex = Math.floor(
      Math.random() * paymentStatuses.length
    );
    // Bias towards completed for more realistic data
    const status =
      i < 7
        ? i < 5
          ? paymentStatuses[0]
          : paymentStatuses[randomStatusIndex]
        : paymentStatuses[randomStatusIndex];

    if (reportType === "financial") {
      tableData.push({
        date: formattedDate,
        transactionId: `TXN-${generateRandomId()}`,
        user: sampleNames[Math.floor(Math.random() * sampleNames.length)],
        plan: insurancePlans[Math.floor(Math.random() * insurancePlans.length)],
        method:
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        amount: Math.floor(Math.random() * 10000) + 500,
        status: status,
      });
    } else if (reportType === "user") {
      tableData.push({
        date: formattedDate,
        user: sampleNames[Math.floor(Math.random() * sampleNames.length)],
        activity:
          userActivities[Math.floor(Math.random() * userActivities.length)],
        plan:
          Math.random() > 0.3
            ? insurancePlans[Math.floor(Math.random() * insurancePlans.length)]
            : null,
        device: devices[Math.floor(Math.random() * devices.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
      });
    } else if (reportType === "payment") {
      tableData.push({
        date: formattedDate,
        transactionId: `TXN-${generateRandomId()}`,
        method:
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        amount: Math.floor(Math.random() * 10000) + 500,
        status: status,
        processingTime: Math.floor(Math.random() * 60) + 1,
        retries:
          status === "failed" || status === "pending"
            ? Math.floor(Math.random() * 3)
            : 0,
      });
    }
  }

  // For insurance report, ensure we have one entry per plan type
  let tableDataResult = [...tableData];
  if (reportType === "insurance") {
    tableDataResult = insurancePlans.map((plan) => {
      const subscribers = Math.floor(Math.random() * 1000) + 100;
      const premium = Math.floor(Math.random() * 5000) + 1000;
      const utilization = Math.random() * 100;

      return {
        plan: plan,
        subscribers: subscribers,
        premium: premium,
        coverageValue: premium * 100,
        utilization: utilization,
        revenue: subscribers * premium,
      };
    });
  }

  // For pie charts data in insurance and payment reports
  const summaryData = {
    financial: {
      totalRevenue: timeSeriesData.reduce(
        (sum, item) => sum + (item.revenue || 0),
        0
      ),
      totalTransactions: timeSeriesData.reduce(
        (sum, item) => sum + (item.transactions || 0),
        0
      ),
      averageTransactionValue:
        timeSeriesData.reduce(
          (sum, item) => sum + (item.averageValue || 0),
          0
        ) / timeSeriesData.length,
      pendingPaymentsTotal: Math.floor(Math.random() * 500000) + 50000,
      failedPaymentsTotal: Math.floor(Math.random() * 100000) + 10000,
      refundsTotal: Math.floor(Math.random() * 50000) + 5000,
      revenueGrowth: (Math.random() * 40 - 10).toFixed(2),
    },
    user: {
      totalUsers: Math.floor(Math.random() * 9000) + 1000,
      activeUsers: Math.floor(Math.random() * 4500) + 500,
      newUsersThisPeriod: Math.floor(Math.random() * 450) + 50,
      averagePaymentFrequency: Math.floor(Math.random() * 29) + 1,
      userRetentionRate: (Math.random() * 30 + 70).toFixed(2),
      userGrowth: (Math.random() * 50 - 10).toFixed(2),
    },
    insurance: {
      totalPlans: {
        "Basic Plan": Math.floor(Math.random() * 900) + 100,
        "Standard Plan": Math.floor(Math.random() * 1800) + 200,
        "Premium Plan": Math.floor(Math.random() * 450) + 50,
        "Family Plan": Math.floor(Math.random() * 700) + 100,
      },
      totalCoverageValue: Math.floor(Math.random() * 90000000) + 10000000,
      planUpgradesThisPeriod: Math.floor(Math.random() * 90) + 10,
      averageCoverageUtilization: (Math.random() * 60 + 20).toFixed(2),
      mostPopularPlan: "Standard Plan",
    },
    payment: {
      paymentMethodsDistribution: {
        "M-Pesa": (Math.random() * 50 + 30).toFixed(2),
        Card: (Math.random() * 30 + 10).toFixed(2),
        "Bank Transfer": (Math.random() * 20 + 5).toFixed(2),
        Cash: (Math.random() * 10 + 1).toFixed(2),
      },
      overallSuccessRate: (Math.random() * 15 + 84).toFixed(2),
      averageProcessingTime: Math.floor(Math.random() * 30) + 3,
      retryRate: (Math.random() * 15).toFixed(2),
      mostUsedPaymentMethod: "M-Pesa",
    },
  };

  // Process plan distribution data for pie chart
  summaryData.insurance.planDistributionData = Object.entries(
    summaryData.insurance.totalPlans
  ).map(([name, value]) => ({
    name,
    value,
  }));

  // Process utilization by plan data for bar chart
  summaryData.insurance.utilizationByPlanData = Object.keys(
    summaryData.insurance.totalPlans
  ).map((plan) => ({
    name: plan,
    utilization: parseFloat((Math.random() * 60 + 20).toFixed(2)),
  }));

  // Process payment methods data for pie chart
  summaryData.payment.paymentMethodsData = Object.entries(
    summaryData.payment.paymentMethodsDistribution
  ).map(([name, percentage]) => ({
    name,
    value: Math.floor(
      summaryData.financial.totalTransactions * (parseFloat(percentage) / 100)
    ),
  }));

  // Process success rate by method data for bar chart
  summaryData.payment.successRatesByMethodData = Object.keys(
    summaryData.payment.paymentMethodsDistribution
  ).map((method) => ({
    name: method,
    successRate: parseFloat((Math.random() * 15 + 84).toFixed(2)),
  }));

  return {
    timeSeriesData,
    tableData: tableDataResult,
    summaryData,
  };
};
