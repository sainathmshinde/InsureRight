export const PAYMENT_STATUSES = [
  "Pending payment",
  "Payment Initiated in offline mode",
  "Cheque received",
  "Payment Failed",
  "Payment received (completed)",
];

export const PAYMENT_STATUS_META = {
  "Pending payment":                   { color: "#a05c00", bg: "#fff3e0", border: "#fcd34d" },
  "Payment Initiated in offline mode": { color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" },
  "Cheque received":                   { color: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd" },
  "Payment Failed":                    { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  "Payment received (completed)":      { color: "#15803d", bg: "#dcfce7", border: "#86efac" },
};

// Short form for use under a "Payment Status" column header, where the full
// sentence-style value would be redundant/too wide for a dense table cell.
export const PAYMENT_STATUS_SHORT_LABEL = {
  "Pending payment":                   "Pending",
  "Payment Initiated in offline mode": "Initiated (Offline)",
  "Cheque received":                   "Cheque Received",
  "Payment Failed":                    "Failed",
  "Payment received (completed)":      "Received",
};
