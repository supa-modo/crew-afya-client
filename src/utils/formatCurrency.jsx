export const formatCurrency = (amount) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount);
};
