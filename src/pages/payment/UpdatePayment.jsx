import { useState } from "react";
import { PageHeader, Button } from "../../components/UI";
import { PaymentIcon } from "../../icons";

const METHOD_META = {
  Cheque: { color: "#7c3aed", bg: "#f5f3ff", icon: "🏦" },
  NEFT: { color: "#0369a1", bg: "#e0f2fe", icon: "⚡" },
  RTGS: { color: "#0369a1", bg: "#e0f2fe", icon: "⚡" },
  IMPS: { color: "#0369a1", bg: "#e0f2fe", icon: "⚡" },
};

const STATUS_META = {
  Pending: { color: "#a05c00", bg: "#fff3e0", border: "#fcd34d" },
  Initiated: { color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" },
  Rejected: { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  Accepted: { color: "#15803d", bg: "#dcfce7", border: "#86efac" },
};

const CAMPAIGNS = [
  { id: 1, name: "Campaign 1" },
  { id: 5, name: "Campaign OPD and DIGIT PAYMENT PROTECTION" },
  { id: 6, name: "BPP Campaign" },
  { id: 7, name: "Test Campaign" },
  { id: 8, name: "SBI_STP_Campaign" },
  { id: 11, name: "BPP Campaign_2026-2027" },
  { id: 12, name: "Standalone campaign" },
];

const MOCK = [
  {
    id: "PAY-2026-001",
    customerName: "Aarav Sharma",
    policyNo: "POL-2026-1001",
    product: "Star Comprehensive Health",
    method: "Cheque",
    bank: "HDFC Bank",
    branch: "Andheri Branch",
    chequeNo: "CHQ-004521",
    referenceNo: null,
    amount: 18500,
    initiatedDate: "2026-04-12",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending",
    rejectionReason: null,
  },
  {
    id: "PAY-2026-002",
    customerName: "Priya Mehta",
    policyNo: "POL-2026-1002",
    product: "HDFC ERGO Optima Secure",
    method: "NEFT",
    bank: "ICICI Bank",
    branch: null,
    chequeNo: null,
    referenceNo: "NEFT240412001823",
    amount: 24200,
    initiatedDate: "2026-04-14",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Initiated",
    rejectionReason: null,
  },
  {
    id: "PAY-2026-003",
    customerName: "Rohan Verma",
    policyNo: "POL-2026-1003",
    product: "Bajaj Allianz Health Guard",
    method: "Cheque",
    bank: "SBI",
    branch: "Dadar Branch",
    chequeNo: "CHQ-009832",
    referenceNo: null,
    amount: 12800,
    initiatedDate: "2026-04-15",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Rejected",
    rejectionReason: "Cheque signature mismatch",
  },
  {
    id: "PAY-2026-004",
    customerName: "Sneha Iyer",
    policyNo: "POL-2026-1004",
    product: "Star Comprehensive Health",
    method: "RTGS",
    bank: "Axis Bank",
    branch: null,
    chequeNo: null,
    referenceNo: "RTGS240415002711",
    amount: 52000,
    initiatedDate: "2026-04-15",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending",
    rejectionReason: null,
  },
  {
    id: "PAY-2026-005",
    customerName: "Rahul Gupta",
    policyNo: "POL-2026-1005",
    product: "Bajaj Allianz Comprehensive",
    method: "IMPS",
    bank: "Kotak Bank",
    branch: null,
    chequeNo: null,
    referenceNo: "IMPS240416008842",
    amount: 9500,
    initiatedDate: "2026-04-16",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Initiated",
    rejectionReason: null,
  },
  {
    id: "PAY-2026-006",
    customerName: "Kavita Pillai",
    policyNo: "POL-2026-1006",
    product: "HDFC ERGO Optima Secure",
    method: "Cheque",
    bank: "Bank of Baroda",
    branch: "Pune Branch",
    chequeNo: "CHQ-012203",
    referenceNo: null,
    amount: 31000,
    initiatedDate: "2026-04-17",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Rejected",
    rejectionReason: "Cheque date expired",
  },
  {
    id: "PAY-2026-007",
    customerName: "Vikram Rao",
    policyNo: "POL-2026-1007",
    product: "Star Comprehensive Health",
    method: "NEFT",
    bank: "Union Bank",
    branch: null,
    chequeNo: null,
    referenceNo: "NEFT240418003512",
    amount: 16750,
    initiatedDate: "2026-04-18",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending",
    rejectionReason: null,
  },
  {
    id: "PAY-2026-008",
    customerName: "Divya Nair",
    policyNo: "POL-2026-1008",
    product: "Bajaj Allianz Health Guard",
    method: "IMPS",
    bank: "Yes Bank",
    branch: null,
    chequeNo: null,
    referenceNo: "IMPS240420011293",
    amount: 8200,
    initiatedDate: "2026-04-20",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Initiated",
    rejectionReason: null,
  },
  {
    id: "PAY-2026-009",
    customerName: "Arjun Singh",
    policyNo: "POL-2026-1009",
    product: "HDFC ERGO Optima Secure",
    method: "Cheque",
    bank: "Punjab National Bank",
    branch: "Ludhiana Branch",
    chequeNo: "CHQ-019882",
    referenceNo: null,
    amount: 44500,
    initiatedDate: "2026-04-21",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending",
    rejectionReason: null,
  },
  {
    id: "PAY-2026-010",
    customerName: "Meera Joshi",
    policyNo: "POL-2026-1010",
    product: "Star Comprehensive Health",
    method: "RTGS",
    bank: "HDFC Bank",
    branch: null,
    chequeNo: null,
    referenceNo: "RTGS240422007634",
    amount: 67000,
    initiatedDate: "2026-04-22",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Rejected",
    rejectionReason: "Insufficient funds at time of transfer",
  },
];

const REJECT_REASONS = [
  "Cheque signature mismatch",
  "Cheque date expired",
  "Insufficient funds",
  "Account number mismatch",
  "UTR not found",
  "Amount mismatch",
  "Duplicate payment",
  "Other",
];

function fmt(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function StatusPill({ status, onClick }) {
  const m = STATUS_META[status] ?? STATUS_META.Pending;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "3px 12px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 700,
        background: m.bg,
        color: m.color,
        border: `1.5px solid ${m.border}`,
        cursor: onClick ? "pointer" : "default",
        fontFamily: "inherit",
        transition: "opacity .13s",
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.opacity = ".75";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {status}
    </button>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: ".4px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: "#1a1628", fontWeight: 500 }}>
        {value || "—"}
      </div>
    </div>
  );
}

function PaymentModal({ payment, onClose, onAccept, onReject }) {
  const [phase, setPhase] = useState("view"); // view | reject-form | accepted | rejected
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const m = METHOD_META[payment.method] ?? METHOD_META["NEFT"];
  const canAct = payment.status === "Pending" || payment.status === "Initiated";

  const confirmAccept = () => {
    onAccept(payment.id);
    setPhase("accepted");
  };
  const confirmReject = () => {
    if (!reason) return;
    onReject(payment.id, reason, notes);
    setPhase("rejected");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.45)",
          zIndex: 1000,
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 1001,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 24px 60px rgba(0,0,0,.22)",
          width: "92%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 26px 18px",
            borderBottom: "1.5px solid #f0edf8",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                letterSpacing: ".5px",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Payment Details
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1628" }}>
              {payment.id}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
              {payment.customerName} · {payment.policyNo}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <StatusPill status={payment.status} />
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "1.5px solid #e8e4f0",
                background: "#faf9fc",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div style={{ padding: "20px 26px" }}>
          {/* Amount banner */}
          <div
            style={{
              background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#7c3aed",
                  fontWeight: 600,
                  letterSpacing: ".4px",
                  textTransform: "uppercase",
                }}
              >
                Premium Amount
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#a855f7",
                  marginTop: 2,
                }}
              >
                {fmt(payment.amount)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: m.bg,
                  color: m.color,
                  border: `1.5px solid`,
                  borderColor: m.bg,
                  borderRadius: 10,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <span>{m.icon}</span> {payment.method}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                Offline Payment
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 24px",
              marginBottom: 20,
            }}
          >
            <DetailRow label="Customer Name" value={payment.customerName} />
            <DetailRow label="Policy Number" value={payment.policyNo} />
            <DetailRow label="Product" value={payment.product} />
            <DetailRow label="Campaign" value={payment.campaignName} />
            <DetailRow label="Date Initiated" value={payment.initiatedDate} />
            <DetailRow label="Initiated By" value={payment.initiatedBy} />
            <DetailRow label="Bank" value={payment.bank} />
            {payment.branch && (
              <DetailRow label="Branch" value={payment.branch} />
            )}
            {payment.chequeNo && (
              <DetailRow label="Cheque Number" value={payment.chequeNo} />
            )}
            {payment.referenceNo && (
              <DetailRow label="Reference / UTR" value={payment.referenceNo} />
            )}
          </div>

          {/* Rejection reason (already rejected) */}
          {payment.status === "Rejected" && payment.rejectionReason && (
            <div
              style={{
                background: "#fef2f2",
                border: "1.5px solid #fca5a5",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#dc2626",
                  marginBottom: 4,
                }}
              >
                Rejection Reason
              </div>
              <div style={{ fontSize: 13.5, color: "#7f1d1d" }}>
                {payment.rejectionReason}
              </div>
            </div>
          )}

          {/* ── Success states ── */}
          {phase === "accepted" && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #86efac",
                borderRadius: 12,
                padding: "18px 20px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 26 }}>✅</span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#15803d",
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  Payment Accepted
                </div>
                <div style={{ fontSize: 13, color: "#166534" }}>
                  Payment of <strong>{fmt(payment.amount)}</strong> from{" "}
                  <strong>{payment.customerName}</strong> has been successfully
                  verified and accepted. Policy{" "}
                  <strong>{payment.policyNo}</strong> will now be activated.
                </div>
              </div>
            </div>
          )}

          {phase === "rejected" && (
            <div
              style={{
                background: "#fef2f2",
                border: "1.5px solid #fca5a5",
                borderRadius: 12,
                padding: "18px 20px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 26 }}>❌</span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#dc2626",
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  Payment Rejected
                </div>
                <div style={{ fontSize: 13, color: "#7f1d1d" }}>
                  Payment of <strong>{fmt(payment.amount)}</strong> has been
                  rejected. Reason: <strong>{reason}</strong>. The customer will
                  be notified to re-submit the payment.
                </div>
              </div>
            </div>
          )}

          {/* ── Reject form ── */}
          {phase === "reject-form" && canAct && (
            <div
              style={{
                background: "#fef9f0",
                border: "1.5px solid #fcd34d",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "#92400e",
                  fontSize: 14,
                  marginBottom: 14,
                }}
              >
                Reject Payment
              </div>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748b",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Reason for Rejection *
                </label>
                <select
                  className="field-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="">Select a reason…</option>
                  {REJECT_REASONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748b",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Additional Notes (optional)
                </label>
                <textarea
                  className="field-input"
                  placeholder="Add any additional details…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 72,
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={confirmReject}
                  disabled={!reason}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 8,
                    background: !reason ? "#e5e7eb" : "#dc2626",
                    color: !reason ? "#9ca3af" : "#fff",
                    border: "none",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: !reason ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setPhase("view")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Action buttons (view phase, actionable status) ── */}
          {phase === "view" && canAct && (
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                type="button"
                onClick={confirmAccept}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 9,
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "opacity .13s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                ✓ Accept Payment
              </button>
              <button
                type="button"
                onClick={() => setPhase("reject-form")}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 9,
                  background: "#fff",
                  color: "#dc2626",
                  border: "2px solid #dc2626",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .13s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                ✕ Reject Payment
              </button>
            </div>
          )}

          {(phase === "accepted" || phase === "rejected" || !canAct) && (
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const ASSOCIATIONS_LIST = [
  { id: 1007, name: "AIBRF-BANK OF BARODA RETIREES ASSOCIATION MAHARASHTRA" },
  {
    id: 1008,
    name: "ALL INDIA PUNJAB NATIONAL BANK PENSIONERS ASSOCIATION (REGD.)",
  },
  { id: 1019, name: "BANK OF MAHARASHTRA RETIRED EMPLOYEES ORGANISATION" },
  { id: 1021, name: "AIBRF-ALL INDIA UNION BANK RETIREES FEDERATION" },
  { id: 1023, name: "INDIAN OVERSEAS BANK" },
  { id: 1025, name: "KARUR VYSYA BANK" },
  { id: 1027, name: "BANK OF RAJASTHAN" },
  { id: 1030, name: "BHARATHEEYA BANK" },
  { id: 1032, name: "CENTRAL BANK RETIRED OFFICERS ASSOCIATION" },
  { id: 1033, name: "Group Oraganization" },
  { id: 1058, name: "UCO BANK RETIRED EMPLOYEES ASSOCIATION" },
];

const TOP_LABEL = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: ".5px",
};

export default function UpdatePayment() {
  const [payments, setPayments] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("5");
  const [methodFilter, setMethodFilter] = useState("");
  const [selected, setSelected] = useState(null);
  // Top-bar filters (applied on button click)
  const [topCampaign, setTopCampaign] = useState("5");
  const [topAssoc, setTopAssoc] = useState("");

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchQ =
      p.customerName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.policyNo.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q);
    const matchCampaign =
      campaignFilter === "" || p.campaignId === Number(campaignFilter);
    const matchMethod =
      methodFilter === ""
        ? true
        : methodFilter === "Cheque"
          ? p.method === "Cheque"
          : p.method === "NEFT" || p.method === "RTGS" || p.method === "IMPS";
    return matchQ && matchCampaign && matchMethod;
  });

  const handleAccept = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Accepted" } : p)),
    );
  };
  const handleReject = (id, reason) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Rejected", rejectionReason: reason } : p,
      ),
    );
  };

  const openPayment = payments.find((p) => p.id === selected?.id) ?? null;

  return (
    <div>
      <PageHeader
        icon={<PaymentIcon />}
        title="Update Payment"
        subtitle="Review and process offline payment submissions"
      />

      {/* Top filter bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: "16px 20px" }}>
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 260px" }}>
              <label style={TOP_LABEL}>Campaign Name</label>
              <select
                className="field-select"
                style={{ marginTop: 5 }}
                value={topCampaign}
                onChange={(e) => setTopCampaign(e.target.value)}
              >
                <option value="">All Campaigns</option>
                {CAMPAIGNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: "1 1 260px" }}>
              <label style={TOP_LABEL}>Association</label>
              <select
                className="field-select"
                style={{ marginTop: 5 }}
                value={topAssoc}
                onChange={(e) => setTopAssoc(e.target.value)}
              >
                <option value="">All Associations</option>
                {ASSOCIATIONS_LIST.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setCampaignFilter(topCampaign)}
              style={{
                padding: "10px 32px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
                boxShadow: "0 2px 8px rgba(168,85,247,0.35)",
                flexShrink: 0,
                alignSelf: "flex-end",
                transition: "opacity .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Total",
            count: 1100,
            amount: "₹2,03,50,000",
            color: "#7c3aed",
            border: "#ddd6fe",
          },
          {
            label: "Pending",
            count: 17,
            amount: "₹3,14,500",
            color: "#a05c00",
            border: "#fde68a",
          },
          {
            label: "Initiated",
            count: 82,
            amount: "₹15,17,000",
            color: "#0369a1",
            border: "#7dd3fc",
          },
          {
            label: "Rejected",
            count: 11,
            amount: "₹2,03,500",
            color: "#dc2626",
            border: "#fca5a5",
          },
          {
            label: "Accepted",
            count: 990,
            amount: "₹1,83,15,000",
            color: "#15803d",
            border: "#86efac",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: `1.5px solid ${s.border}`,
              borderRadius: 12,
              padding: "16px 18px",
              borderTop: `3px solid ${s.color}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.count}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
                {s.amount}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#64748b",
                marginTop: 6,
                textTransform: "uppercase",
                letterSpacing: ".4px",
              }}
            >
              {s.label} Payments
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 14,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: ".4px",
                }}
              >
                Search
              </label>
              <input
                className="field-input filter-search"
                placeholder="Search by payment ID, customer, policy…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: "0 0 190px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: ".4px",
                }}
              >
                Payment Method
              </label>
              <select
                className="field-select"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">All Methods</option>
                <option value="Cheque">Cheque</option>
                <option value="BankTransfer">NEFT / RTGS / IMPS</option>
              </select>
            </div>
            <div style={{ flex: "0 0 220px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: ".4px",
                }}
              >
                Campaign
              </label>
              <select
                className="field-select"
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">All Campaigns</option>
                {CAMPAIGNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {(methodFilter || campaignFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: 12, padding: "5px 12px", flexShrink: 0 }}
                  onClick={() => {
                    setMethodFilter("");
                    setCampaignFilter("");
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="table-wrap">
            <table style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Policy No.</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>
                    Status
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 400,
                        color: "#64748b",
                        marginTop: 2,
                      }}
                    >
                      click to accept / reject
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "32px 0",
                        color: "#64748b",
                      }}
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const mm = METHOD_META[p.method] ?? METHOD_META["NEFT"];
                    return (
                      <tr
                        key={p.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelected(p)}
                      >
                        <td
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: "#7c3aed",
                          }}
                        >
                          {p.id}
                        </td>
                        <td style={{ fontWeight: 500 }}>{p.customerName}</td>
                        <td
                          style={{
                            color: "#64748b",
                            fontFamily: "monospace",
                            fontSize: 12,
                          }}
                        >
                          {p.policyNo}
                        </td>
                        <td>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              background: mm.bg,
                              color: mm.color,
                              borderRadius: 6,
                              padding: "2px 9px",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {mm.icon} {p.method}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{fmt(p.amount)}</td>
                        <td style={{ color: "#64748b" }}>{p.initiatedDate}</td>
                        <td
                          style={{
                            fontFamily: "monospace",
                            fontSize: 11.5,
                            color: "#64748b",
                          }}
                        >
                          {p.chequeNo || p.referenceNo || "—"}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <StatusPill
                            status={p.status}
                            onClick={() => setSelected(p)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && openPayment && (
        <PaymentModal
          payment={openPayment}
          onClose={() => setSelected(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
