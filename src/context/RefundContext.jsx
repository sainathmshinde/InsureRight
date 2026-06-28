import { createContext, useContext, useState } from "react";

const RefundContext = createContext();

const INITIAL_REFUNDS = [
  { id: "REF-001", proposalId: "PRO-2025-1081", customerName: "Aarav Sharma",   mobile: "9870000082", product: "Star Comprehensive Health", icName: "Star Health",    systemAmount: 18500, uploadedAmount: 20000, refundAmount: 1500, paymentType: "Cheque", status: "Pending",   requestDate: "2026-06-20", processedDate: null },
  { id: "REF-002", proposalId: "PRO-2025-1083", customerName: "Rohan Verma",    mobile: "9870000084", product: "Bajaj Allianz Health Guard", icName: "Bajaj Allianz", systemAmount: 12800, uploadedAmount: 14000, refundAmount: 1200, paymentType: "NEFT",   status: "Approved",  requestDate: "2026-06-18", processedDate: null },
  { id: "REF-003", proposalId: "PRO-2025-1085", customerName: "Rahul Gupta",    mobile: "9870000086", product: "ICICI Lombard Health",       icName: "ICICI Lombard", systemAmount: 24200, uploadedAmount: 25500, refundAmount: 1300, paymentType: "Cheque", status: "Processed", requestDate: "2026-06-15", processedDate: "2026-06-22" },
  { id: "REF-004", proposalId: "PRO-2025-1087", customerName: "Vikram Rao",     mobile: "9870000088", product: "Star Comprehensive Health",  icName: "Star Health",   systemAmount: 31500, uploadedAmount: 33000, refundAmount: 1500, paymentType: "NEFT",   status: "Pending",   requestDate: "2026-06-22", processedDate: null },
  { id: "REF-005", proposalId: "PRO-2025-1089", customerName: "Arjun Singh",    mobile: "9870000090", product: "HDFC ERGO Optima Secure",    icName: "HDFC ERGO",     systemAmount: 44500, uploadedAmount: 47000, refundAmount: 2500, paymentType: "Cheque", status: "Rejected",  requestDate: "2026-06-12", processedDate: null },
  { id: "REF-006", proposalId: "PRO-2025-1091", customerName: "Priya Mehta",    mobile: "9870000092", product: "Star Comprehensive Health",  icName: "Star Health",   systemAmount: 15600, uploadedAmount: 16800, refundAmount: 1200, paymentType: "NEFT",   status: "Approved",  requestDate: "2026-06-25", processedDate: null },
  { id: "REF-007", proposalId: "PRO-2025-1093", customerName: "Sneha Iyer",     mobile: "9870000094", product: "Bajaj Allianz Health Guard", icName: "Bajaj Allianz", systemAmount: 22000, uploadedAmount: 23500, refundAmount: 1500, paymentType: "Cheque", status: "Processed", requestDate: "2026-06-10", processedDate: "2026-06-19" },
  { id: "REF-008", proposalId: "PRO-2025-1095", customerName: "Kavita Pillai",  mobile: "9870000096", product: "HDFC ERGO Optima Secure",    icName: "HDFC ERGO",     systemAmount: 28900, uploadedAmount: 30000, refundAmount: 1100, paymentType: "NEFT",   status: "Pending",   requestDate: "2026-06-26", processedDate: null },
  { id: "REF-009", proposalId: "PRO-2025-1097", customerName: "Divya Nair",     mobile: "9870000098", product: "ICICI Lombard Health",       icName: "ICICI Lombard", systemAmount: 19200, uploadedAmount: 21000, refundAmount: 1800, paymentType: "Cheque", status: "Approved",  requestDate: "2026-06-17", processedDate: null },
  { id: "REF-010", proposalId: "PRO-2025-1099", customerName: "Meera Joshi",    mobile: "9870000100", product: "Star Comprehensive Health",  icName: "Star Health",   systemAmount: 67000, uploadedAmount: 70000, refundAmount: 3000, paymentType: "NEFT",   status: "Processed", requestDate: "2026-06-08", processedDate: "2026-06-16" },
];

export function RefundProvider({ children }) {
  const [refunds, setRefunds] = useState(INITIAL_REFUNDS);

  const addRefund = (entry) => {
    setRefunds((prev) => {
      const id = `REF-${String(prev.length + 1).padStart(3, "0")}`;
      const today = new Date().toISOString().slice(0, 10);
      return [{ id, ...entry, status: "Pending", requestDate: today, processedDate: null }, ...prev];
    });
  };

  return (
    <RefundContext.Provider value={{ refunds, addRefund }}>
      {children}
    </RefundContext.Provider>
  );
}

export function useRefunds() {
  return useContext(RefundContext);
}
