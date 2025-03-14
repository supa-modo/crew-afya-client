import api from "./authService";

// Mock payment data for development
const MOCK_PAYMENT_HISTORY = [
  {
    id: "pay_1",
    date: new Date(2023, 2, 15).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "MPESA123456",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_2",
    date: new Date(2023, 1, 15).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "MPESA789012",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_3",
    date: new Date(2023, 0, 15).toISOString(),
    amount: 500,
    method: "Card",
    reference: "CARD345678",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_4",
    date: new Date(2022, 11, 15).toISOString(),
    amount: 500,
    method: "Bank Transfer",
    reference: "BNK901234",
    status: "completed",
    description: "Monthly premium payment",
  },
  {
    id: "pay_5",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 500,
    method: "M-Pesa",
    reference: "",
    status: "pending",
    description: "Upcoming payment",
  },
];

// Initiate M-Pesa payment
export const initiateMpesaPayment = async (paymentData) => {
  try {
    const response = await api.post("/payments/mpesa", paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create payment schedule
export const createPaymentSchedule = async (scheduleData) => {
  try {
    const response = await api.post("/payments/schedule", scheduleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update payment schedule
export const updatePaymentSchedule = async (scheduleId, scheduleData) => {
  try {
    const response = await api.put(
      `/payments/schedule/${scheduleId}`,
      scheduleData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment history
export const getPaymentHistory = async () => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get("/payments/history");
    // return response.data;

    // For now, return mock data
    return {
      success: true,
      data: MOCK_PAYMENT_HISTORY,
    };
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw new Error("Failed to fetch payment history");
  }
};

// Get payment details
export const getPaymentDetails = async (paymentId) => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get(`/payments/${paymentId}`);
    // return response.data;

    // For now, find the payment in our mock data
    const payment = MOCK_PAYMENT_HISTORY.find((p) => p.id === paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return {
      success: true,
      data: payment,
    };
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw new Error("Failed to fetch payment details");
  }
};

// Get payment methods
export const getPaymentMethods = async () => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get("/payments/methods");
    // return response.data;

    // For now, return mock payment methods
    return {
      success: true,
      data: [
        { id: "mpesa", name: "M-Pesa", icon: "mobile" },
        { id: "card", name: "Credit/Debit Card", icon: "credit-card" },
        { id: "bank", name: "Bank Transfer", icon: "bank" },
      ],
    };
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw new Error("Failed to fetch payment methods");
  }
};
