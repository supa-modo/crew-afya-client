import { subDays } from "date-fns";

// Mock data for payments
export const generateMockPayments = (count) => {
  const statuses = [
    "completed",
    "completed",
    "completed",
    "completed",
    "failed",
    "pending",
    "processing",
    "refunded",
  ];
  const paymentMethods = ["M-Pesa", "Cash"];
  const plans = [
    "Crew Afya Lite",
    "Crew Afya - (Up to M+3)",
    "Crew Afya Premium",
  ];
  const coveragePeriods = ["daily", "monthly", "annual"];

  return Array.from({ length: count }, (_, index) => {
    const randomDate = subDays(new Date(), Math.floor(Math.random() * 60));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const plan = plans[Math.floor(Math.random() * plans.length)];
    const coveragePeriod =
      coveragePeriods[Math.floor(Math.random() * coveragePeriods.length)];

    // Generate amounts based on coverage period and plan
    let amount = 0;
    if (plan === "Crew Afya Lite") {
      amount =
        coveragePeriod === "daily"
          ? 24
          : coveragePeriod === "monthly"
          ? 713
          : 8565;
    } else if (plan === "Crew Afya - (Up to M+3)") {
      amount =
        coveragePeriod === "daily"
          ? 55
          : coveragePeriod === "monthly"
          ? 1661
          : 19933;
    } else {
      amount =
        coveragePeriod === "daily"
          ? 75
          : coveragePeriod === "monthly"
          ? 2250
          : 27000;
    }

    return {
      id: `TXN-${100000 + index}`,
      userId: `USR-${10000 + Math.floor(Math.random() * 500)}`,
      userName: `User ${10000 + Math.floor(Math.random() * 500)}`,
      amount,
      date: randomDate.toISOString(),
      status,
      method,
      plan,
      coveragePeriod,
      reference: `REF-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`,
      mpesaCode:
        method === "M-Pesa"
          ? `${String.fromCharCode(
              65 + Math.floor(Math.random() * 26)
            )}${String.fromCharCode(
              65 + Math.floor(Math.random() * 26)
            )}${String.fromCharCode(
              65 + Math.floor(Math.random() * 26)
            )}${Math.floor(Math.random() * 10000000)}`
          : null,
      processingTime:
        status !== "pending" ? `${(Math.random() * 5).toFixed(2)}s` : null,
      notes:
        Math.random() > 0.8 ? "Customer requested receipt via email" : null,
      audited: Math.random() > 0.7,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}`,
      deviceInfo: Math.random() > 0.5 ? "Mobile App" : "Web Browser",
      location: Math.random() > 0.7 ? "Nairobi, Kenya" : null,
      paymentDetails: {
        accountNumber: `ACC-${Math.floor(Math.random() * 1000000)}`,
        receiptNumber: `RCT-${Math.floor(Math.random() * 1000000)}`,
        transactionFee: (amount * 0.01).toFixed(2),
      },
    };
  });
};
