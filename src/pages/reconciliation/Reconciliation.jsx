import { useState, useRef } from "react";
import { PageHeader } from "../../components/UI";
import { DateInput } from "../../components/Field";
import { DocumentIcon, SearchIcon } from "../../icons";
import { POLICY_MOCK } from "../policy/PolicyList";
import { ASSOCIATIONS } from "../member/orgAssocData";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import { PAYMENT_STATUS_META } from "../../constants/paymentStatus";
import { useRefunds } from "../../context/RefundContext";
import { formatDate } from "../../utils/date";

const CAMPAIGNS = [
  { id: 1, name: "Campaign 1" },
  { id: 5, name: "Campaign OPD and DIGIT PAYMENT PROTECTION" },
  { id: 6, name: "BPP Campaign" },
  { id: 7, name: "Test Campaign" },
  { id: 8, name: "SBI_STP_Campaign" },
  { id: 11, name: "BPP Campaign_2026-2027" },
  { id: 12, name: "Standalone campaign" },
];

const REJECT_REASONS = [
  "Amount mismatch",
  "Account number mismatch",
  "Cheque signature mismatch",
  "Cheque date expired",
  "UTR not found",
  "Duplicate entry",
  "Insufficient funds",
  "Member details mismatch",
  "Other",
];

const LABEL = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: ".5px",
};

const STATUS_META = PAYMENT_STATUS_META;

const BANKS = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank", "PNB"];
const BRANCHES = ["Andheri West", "Fort", "Bandra Kurla Complex", "Shivajinagar", "Connaught Place", "MG Road"];
const DEPOSIT_LOCATIONS = [
  "Mumbai – Fort", "Pune – Shivajinagar", "Delhi – Connaught Place",
  "Bangalore – MG Road", "Chennai – Anna Salai", "Hyderabad – Banjara Hills",
];
const IN_FAVOUR = [
  "BOB Employees Association", "SBI Staff Union", "Central Govt Employees",
  "Railway Workers Union", "BSNL Employees Trust",
];

const IFSC_PREFIXES = ["HDFC", "ICIC", "SBIN", "UTIB", "KKBK", "PUNB"];
const BASE_DATA = POLICY_MOCK.filter(
  (p) => p.paymentStatus === "Pending payment" || p.paymentStatus === "Payment Failed",
).map((p) => {
  const id = p.id;
  // Use id for deterministic type assignment so filtering never breaks consistency
  let paymentType = (p.paymentType === "NEFT" || p.paymentType === "Cheque")
    ? p.paymentType
    : id % 2 === 0 ? "NEFT" : "Cheque";

  const mm  = String((id % 12) + 1).padStart(2, "0");
  const dd  = String((id % 28) + 1).padStart(2, "0");
  const yr  = 2025 + (id % 2);
  const uid = 100 + (id % 12);

  const cd  = String(((id + 3) % 28) + 1).padStart(2, "0");
  const typeFields = paymentType === "Cheque" ? {
    paymentDetailId:        `PD-${1000 + id}`,
    chequeNumber:           String(100000 + ((id * 17 + 43) % 900000)),
    bankName:               BANKS[id % BANKS.length],
    chequeDate:             `${yr}-${mm}-${dd}`,
    clearingDate:           `${yr}-${mm}-${cd}`,
    inFavourOf:             IN_FAVOUR[id % IN_FAVOUR.length],
    chequePhotoDocumentName:`cheque_${p.proposalId}.jpg`,
    chequePhotoDocumentUrl: `/docs/cheques/cheque_${id}.jpg`,
    chequeDepositLocation:  DEPOSIT_LOCATIONS[id % DEPOSIT_LOCATIONS.length],
    ifscCode:               `${IFSC_PREFIXES[id % 6]}0${String((id * 7) % 10000).padStart(6, "0")}`,
    micrCode:               `${400 + (id % 100)}${String((id * 3) % 1000000).padStart(6, "0")}`,
    userId:                 uid,
  } : {
    paymentDetailId:           `PD-${2000 + id}`,
    bankName:                  BANKS[id % BANKS.length],
    branchName:                BRANCHES[id % BRANCHES.length],
    accountNumber:             `${30000 + id * 13}${String(id * 7 % 10000).padStart(6, "0")}`,
    accountName:               p.memberName,
    ifscCode:                  `${IFSC_PREFIXES[id % 6]}0${String((id * 11) % 10000).padStart(6, "0")}`,
    transactionId:             `TXN${String(id * 98765 + 100000).slice(-9)}`,
    neftDate:                  `${yr}-${mm}-${dd}`,
    neftReceiptDocumentName:   `neft_receipt_${p.proposalId}.pdf`,
    neftReceiptDocumentUrl:    `/docs/neft/neft_${id}.pdf`,
    userId:                    uid,
  };

  return { ...p, paymentType, paymentMode: "Offline", ...typeFields };
});

function StatusPill({ status }) {
  const m = STATUS_META[status] ?? STATUS_META["Pending payment"];
  return (
    <span
      style={{
        padding: "3px 12px",
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 700,
        background: m.bg,
        color: m.color,
        border: `1.5px solid ${m.border}`,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function fmt(v) {
  return v ? `₹${Number(v).toLocaleString("en-IN")}` : "—";
}

function TxnDetailRow({ label, value, mismatch }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>{label}</div>
      <div style={{ fontSize: 13.5, color: mismatch ? "#dc2626" : "#1a1628", fontWeight: mismatch ? 700 : 500 }}>
        {value || "—"}{mismatch && <span style={{ marginLeft: 4 }}>⚠</span>}
      </div>
    </div>
  );
}

function computeMatchSummary(up, pr, isCheque) {
  const compareFields = isCheque
    ? [
        { key: "chequeNumber", label: "Cheque Number" },
        { key: "chequeDate", label: "Cheque Date" },
      ]
    : [
        { key: "transactionId", label: "Transaction ID" },
        { key: "neftDate", label: "NEFT Date" },
      ];

  const matched = [];
  const mismatched = [];
  compareFields.forEach(({ key, label }) => {
    const a = up[key] ?? "";
    const b = pr[key] ?? "";
    (a === b ? matched : mismatched).push(label);
  });

  if (up.premium !== pr.premium) mismatched.push("Premium Amount");
  else matched.push("Premium Amount");

  return { matched, mismatched };
}

function computePremiumDiff(up, pr) {
  return (up.premium ?? 0) - (pr.premium ?? 0);
}

const MODAL_OVERLAY = { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", backdropFilter: "blur(2px)" };
const MODAL_BOX = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,.22)", width: "92%", maxHeight: "90vh", overflowY: "auto" };

function PendingPickerModal({
  uploaded: up, availablePending, isCheque, isNeft,
  search, onSearch, dateFrom, onDateFrom, dateTo, onDateTo,
  onPick, onClose,
}) {
  const filtered = availablePending.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (p.chequeNumber ?? "").toLowerCase().includes(q) ||
      p.memberName.toLowerCase().includes(q);
    const dateField = isCheque ? p.chequeDate : p.neftDate;
    const matchFrom = !dateFrom || (dateField && dateField >= dateFrom);
    const matchTo = !dateTo || (dateField && dateField <= dateTo);
    return matchSearch && matchFrom && matchTo;
  });

  const hasFilters = search || dateFrom || dateTo;
  const refCellStyle = { padding: "8px 10px", fontSize: 12.5, color: "#92400e", whiteSpace: "nowrap" };

  return (
    <>
      <div style={{ ...MODAL_OVERLAY, zIndex: 1000 }} onClick={onClose} />
      <div style={{ ...MODAL_BOX, zIndex: 1001, maxWidth: 860 }}>
        <div style={{ padding: "22px 26px 18px", borderBottom: "1.5px solid #f0edf8", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 4 }}>Match with Pending</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1628" }}>Select a Pending Record to Compare</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e8e4f0", background: "#faf9fc", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>

        <div style={{ padding: "18px 26px 26px" }}>
          {/* Uploaded record being matched — same columns as the table below, for direct comparison */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#a16207", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>
            Uploaded Record (IC Data) — matching this against pending records below
          </div>
          <div style={{ border: "1.5px solid #fde68a", borderRadius: 8, overflow: "hidden", marginBottom: 18 }}>
            <table style={{ fontSize: 12.5, marginBottom: 0 }}>
              <thead>
                <tr>
                  {isCheque && <>
                    <th style={{ background: "#fefce8", color: "#a16207" }}>Cheque No.</th>
                    <th style={{ background: "#fefce8", color: "#a16207" }}>Cheque Date</th>
                  </>}
                  {isNeft && <>
                    <th style={{ background: "#fefce8", color: "#a16207" }}>Transaction No.</th>
                    <th style={{ background: "#fefce8", color: "#a16207" }}>NEFT Date</th>
                  </>}
                  <th style={{ background: "#fefce8", color: "#a16207" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: "#fffef0" }}>
                  {isCheque && <>
                    <td style={{ ...refCellStyle, fontFamily: "monospace", fontWeight: 600 }}>{up.chequeNumber ?? "—"}</td>
                    <td style={refCellStyle}>{up.chequeDate ? formatDate(up.chequeDate) : "—"}</td>
                  </>}
                  {isNeft && <>
                    <td style={{ ...refCellStyle, fontFamily: "monospace", fontWeight: 600 }}>{up.transactionId ?? "—"}</td>
                    <td style={refCellStyle}>{up.neftDate ? formatDate(up.neftDate) : "—"}</td>
                  </>}
                  <td style={{ ...refCellStyle, fontWeight: 700 }}>{fmt(up.premium)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={LABEL}>Search</label>
              <input
                className="field-input filter-search"
                placeholder="Cheque number or member name…"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                style={{ width: 240 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={LABEL}>From Date</label>
              <DateInput value={dateFrom} onChange={(e) => onDateFrom(e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={LABEL}>To Date</label>
              <DateInput value={dateTo} onChange={(e) => onDateTo(e.target.value)} />
            </div>
            {hasFilters && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { onSearch(""); onDateFrom(""); onDateTo(""); }}>
                Clear
              </button>
            )}
          </div>

          {/* List */}
          {availablePending.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: "#64748b", fontSize: 13 }}>No pending records available</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: "#64748b", fontSize: 13 }}>No pending records match your search/filters</div>
          ) : (
            <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ maxHeight: 420, overflowY: "auto" }}>
                <table style={{ fontSize: 13, marginBottom: 0 }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}>Order ID</th>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}>Member Name</th>
                      {isCheque && <>
                        <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}>Cheque No.</th>
                        <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}>Cheque Date</th>
                      </>}
                      {isNeft && <>
                        <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}>Transaction No.</th>
                        <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}>NEFT Date</th>
                      </>}
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}>Amount</th>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const chequeMatch = isCheque && up.chequeNumber && p.chequeNumber && up.chequeNumber === p.chequeNumber;
                      const txnMatch = isNeft && up.transactionId && p.transactionId && up.transactionId === p.transactionId;
                      const nameMatch = up.memberName === p.memberName;
                      return (
                        <tr
                          key={p.id}
                          onClick={() => onPick(p.id)}
                          style={{ cursor: "pointer", background: "#f0f7ff" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#f0f7ff"; }}
                        >
                          <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#1d4ed8", fontSize: 12 }}>{p.proposalId}</td>
                          <td style={{ fontWeight: 600, color: nameMatch ? "#15803d" : "#1e293b" }}>{p.memberName}{nameMatch && <span style={{ marginLeft: 4 }} title="Name matches uploaded record">✓</span>}</td>
                          {isCheque && <>
                            <td style={{ fontFamily: "monospace", fontWeight: 600, color: chequeMatch ? "#15803d" : "inherit" }}>{p.chequeNumber ?? "—"}{chequeMatch && <span style={{ marginLeft: 4 }} title="Cheque number matches uploaded record">✓</span>}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{p.chequeDate ? formatDate(p.chequeDate) : "—"}</td>
                          </>}
                          {isNeft && <>
                            <td style={{ fontFamily: "monospace", fontWeight: 600, color: txnMatch ? "#15803d" : "#0369a1" }}>{p.transactionId ?? "—"}{txnMatch && <span style={{ marginLeft: 4 }} title="Transaction number matches uploaded record">✓</span>}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{p.neftDate ? formatDate(p.neftDate) : "—"}</td>
                          </>}
                          <td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(p.premium)}</td>
                          <td style={{ fontSize: 16, color: "#a78bfa", textAlign: "center" }}>→</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MatchComparisonModal({
  uploaded: up, pending: pr, isCheque, isNeft,
  manualMatch,
  onAccept, onReject, onSetReason, onBack, onClose,
}) {
  const { matched, mismatched } = computeMatchSummary(up, pr, isCheque);
  const diff = computePremiumDiff(up, pr);
  const showingReasonSelect = manualMatch?.action === "reject" && manualMatch?.reason === "";

  return (
    <>
      <div style={{ ...MODAL_OVERLAY, zIndex: 1010 }} onClick={onClose} />
      <div style={{ ...MODAL_BOX, zIndex: 1011, maxWidth: 760 }}>
        <div style={{ padding: "22px 26px 18px", borderBottom: "1.5px solid #f0edf8", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <button type="button" onClick={onBack} style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit", padding: 0, marginBottom: 6 }}>
              ← Back
            </button>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1628" }}>Compare &amp; Match</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{up.proposalId} ↔ {pr.proposalId}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e8e4f0", background: "#faf9fc", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>

        <div style={{ padding: "20px 26px" }}>
          {/* Match summary banner */}
          <div style={{ background: mismatched.length === 0 ? "#f0fdf4" : "#fff3e0", border: `1.5px solid ${mismatched.length === 0 ? "#86efac" : "#fcd34d"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 18, fontSize: 13, color: mismatched.length === 0 ? "#15803d" : "#92400e" }}>
            {matched.length > 0 && <div><strong>Matched on:</strong> {matched.join(", ")}</div>}
            {mismatched.length > 0 && <div style={{ marginTop: matched.length > 0 ? 4 : 0 }}><strong>{mismatched.length} mismatch{mismatched.length > 1 ? "es" : ""}:</strong> {mismatched.join(", ")}</div>}
          </div>

          {/* Side-by-side comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
            <div style={{ background: "#eff6ff", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>System (Pending)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <TxnDetailRow label="Member Name" value={pr.memberName} />
                {isCheque && <>
                  <TxnDetailRow label="Cheque Number" value={pr.chequeNumber} />
                  <TxnDetailRow label="Cheque Date" value={formatDate(pr.chequeDate)} />
                </>}
                {isNeft && <>
                  <TxnDetailRow label="Transaction ID" value={pr.transactionId} />
                  <TxnDetailRow label="NEFT Date" value={formatDate(pr.neftDate)} />
                </>}
                <TxnDetailRow label="Amount" value={fmt(pr.premium)} />
              </div>
            </div>
            <div style={{ background: "#fefce8", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a16207", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Uploaded (IC Data)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {isCheque && <>
                  <TxnDetailRow label="Cheque Number" value={up.chequeNumber} mismatch={(up.chequeNumber ?? "") !== (pr.chequeNumber ?? "")} />
                  <TxnDetailRow label="Cheque Date" value={formatDate(up.chequeDate)} mismatch={(up.chequeDate ?? "") !== (pr.chequeDate ?? "")} />
                </>}
                {isNeft && <>
                  <TxnDetailRow label="Transaction ID" value={up.transactionId} mismatch={(up.transactionId ?? "") !== (pr.transactionId ?? "")} />
                  <TxnDetailRow label="NEFT Date" value={formatDate(up.neftDate)} mismatch={(up.neftDate ?? "") !== (pr.neftDate ?? "")} />
                </>}
                <TxnDetailRow label="Amount" value={fmt(up.premium)} mismatch={up.premium !== pr.premium} />
              </div>
            </div>
          </div>

          {/* Payment difference banner */}
          {diff !== 0 && (
            <div style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", borderRadius: 12, padding: "14px 20px", marginBottom: 18, fontSize: 13.5, color: "#3b0764" }}>
              {diff > 0
                ? <><strong>Member overpaid by {fmt(diff)}.</strong> Please initiate a refund for the extra amount.</>
                : <><strong>Member underpaid by {fmt(-diff)}.</strong> Please collect the remaining amount from the member.</>}
            </div>
          )}

          {/* Accept / Reject */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={onAccept}
              style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>
              {diff > 0 ? `✓ Accept & Refund ${fmt(diff)}` : diff < 0 ? `✓ Accept (${fmt(-diff)} Due)` : "✓ Accept"}
            </button>
            <button type="button" onClick={onReject}
              style={{ padding: "8px 20px", borderRadius: 8, border: "1.5px solid #dc2626", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}>
              ✕ Reject
            </button>
            {showingReasonSelect && (
              <select className="field-select" style={{ fontSize: 12, padding: "4px 8px", maxWidth: 240 }} value=""
                onChange={(e) => onSetReason(e.target.value)}>
                <option value="">Select reason…</option>
                {REJECT_REASONS.map((r) => (<option key={r}>{r}</option>))}
              </select>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function TransactionDetailModal({ system: rec, uploaded: up, onClose }) {
  const [showChequeImage, setShowChequeImage] = useState(false);
  const isCheque = rec.paymentType === "Cheque";
  const methodMeta = isCheque
    ? { color: "#7c3aed", bg: "#f5f3ff", icon: "🏦" }
    : { color: "#0369a1", bg: "#e0f2fe", icon: "⚡" };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000, backdropFilter: "blur(2px)" }} onClick={onClose} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1001, background: "#fff", borderRadius: 18, boxShadow: "0 24px 60px rgba(0,0,0,.22)", width: "92%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "22px 26px 18px", borderBottom: "1.5px solid #f0edf8", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 4 }}>Transaction Info</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1628" }}>{rec.proposalId}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{rec.memberName} · {rec.product}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e8e4f0", background: "#faf9fc", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", lineHeight: 1 }}>×</button>
          </div>
        </div>

        <div style={{ padding: "20px 26px" }}>
          {/* Amount banner */}
          <div style={{ background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase" }}>Premium Amount</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#a855f7", marginTop: 2 }}>{fmt(rec.premium)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: methodMeta.bg, color: methodMeta.color, border: "1.5px solid", borderColor: methodMeta.bg, borderRadius: 10, padding: "6px 14px", fontSize: 13, fontWeight: 700 }}>
                <span>{methodMeta.icon}</span> {rec.paymentType}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Offline Payment</div>
            </div>
          </div>

          {/* System details grid */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>System Record</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", marginBottom: 20 }}>
            <TxnDetailRow label="Member Name" value={rec.memberName} />
            <TxnDetailRow label="Order ID" value={rec.proposalId} />
            <TxnDetailRow label="Product" value={rec.product} />
            <TxnDetailRow label="Campaign" value={rec.campaignName} />
            <TxnDetailRow label="IC Name" value={rec.icName} />
            <TxnDetailRow label="Bank" value={rec.bankName} />
            {isCheque && <>
              <TxnDetailRow label="Cheque Number" value={rec.chequeNumber} />
              <TxnDetailRow label="Cheque Date" value={formatDate(rec.chequeDate)} />
              <TxnDetailRow label="In Favour Of" value={rec.inFavourOf} />
              <TxnDetailRow label="Deposit Location" value={rec.chequeDepositLocation} />
              <TxnDetailRow label="IFSC Code" value={rec.ifscCode} />
              <TxnDetailRow label="MICR Code" value={rec.micrCode} />
            </>}
            {!isCheque && <>
              <TxnDetailRow label="Transaction ID" value={rec.transactionId} />
              <TxnDetailRow label="NEFT Date" value={formatDate(rec.neftDate)} />
              <TxnDetailRow label="Account Number" value={rec.accountNumber} />
              <TxnDetailRow label="Account Name" value={rec.accountName} />
              <TxnDetailRow label="Branch" value={rec.branchName} />
              <TxnDetailRow label="IFSC Code" value={rec.ifscCode} />
            </>}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "2px dashed #e2e8f0", margin: "8px 0 20px" }} />

          {/* Uploaded record */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "#a16207", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Uploaded Record (IC Data)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", marginBottom: 20, background: "#fefce8", borderRadius: 10, padding: "14px 16px" }}>
            <TxnDetailRow label="Premium Amount" value={fmt(up.premium)} mismatch={up.premium !== rec.premium} />
            <TxnDetailRow label="IC Status" value={up.uploadedStatus} />
            {isCheque && <>
              <TxnDetailRow label="Bank" value={up.bankName} mismatch={up.bankName !== rec.bankName} />
              <TxnDetailRow label="Cheque Number" value={up.chequeNumber} mismatch={up.chequeNumber !== rec.chequeNumber} />
              <TxnDetailRow label="Cheque Date" value={formatDate(up.chequeDate)} mismatch={up.chequeDate !== rec.chequeDate} />
            </>}
            {!isCheque && <>
              <TxnDetailRow label="Member Name" value={up.memberName} mismatch={up.memberName !== rec.memberName} />
              <TxnDetailRow label="Transaction ID" value={up.transactionId} mismatch={up.transactionId !== rec.transactionId} />
              <TxnDetailRow label="NEFT Date" value={formatDate(up.neftDate)} mismatch={up.neftDate !== rec.neftDate} />
            </>}
          </div>

          {/* View Uploaded Cheque button */}
          {isCheque && (
            <div>
              <button type="button" onClick={() => setShowChequeImage(!showChequeImage)}
                style={{ padding: "10px 22px", borderRadius: 10, border: "2px solid #7c3aed", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, transition: "all .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                🏦 {showChequeImage ? "Hide" : "View"} Uploaded Cheque
              </button>
              {showChequeImage && (
                <div style={{ marginTop: 14, border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#f8fafc", padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".4px" }}>
                    {rec.chequePhotoDocumentName}
                  </div>
                  <div style={{ background: "#fff", border: "1px dashed #cbd5e1", borderRadius: 8, padding: "40px 20px", color: "#94a3b8", fontSize: 14 }}>
                    Cheque image preview for {rec.chequePhotoDocumentName}
                    <div style={{ marginTop: 8, fontSize: 12, color: "#7c3aed", fontFamily: "monospace" }}>{rec.chequePhotoDocumentUrl}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View NEFT Receipt */}
          {!isCheque && (
            <div>
              <button type="button"
                style={{ padding: "10px 22px", borderRadius: 10, border: "2px solid #0369a1", background: "#fff", color: "#0369a1", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#e0f2fe"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                ⚡ View NEFT Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function exportToExcel(rows) {
  const headers = [
    "ID",
    "Order ID",
    "Member Name",
    "Mobile",
    "Product",
    "IC Name",
    "Premium",
    "Payment Mode",
    "Pay Type",
    "Campaign",
    "Payment Status",
  ];
  const escape = (v) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csvRows = [
    headers.join(","),
    ...rows.map((p) =>
      [
        p.id,
        p.proposalId,
        p.memberName,
        p.mobile,
        p.product,
        p.icName,
        p.premium,
        p.paymentMode,
        p.paymentType,
        p.campaignName,
        p.paymentStatus,
      ]
        .map(escape)
        .join(","),
    ),
  ];
  // BOM for Excel UTF-8 compatibility
  const blob = new Blob(["﻿" + csvRows.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reconciliation_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Generate mock "uploaded" data — skip some system records & add extra uploaded-only rows
function buildUploadedRows(records) {
  const matched = [];
  records.forEach((r, i) => {
    if (i % 7 === 0) return; // skip every 7th → becomes "pending" (unmatched system)
    const premiumDiff = i % 6 === 0;
    const nameDiff = i % 11 === 0;
    const chequeDateDiff = i % 8 === 0;
    const clearingDateDiff = i % 9 === 0;
    const chequeNumDiff = i % 13 === 0;

    const base = {
      proposalId: r.proposalId,
      memberName: nameDiff
        ? r.memberName.split(" ").reverse().join(" ")
        : r.memberName,
      premium: premiumDiff ? r.premium + 500 : r.premium,
      paymentType: r.paymentType,
      icName: r.icName,
      uploadedStatus: "Payment received (completed)",
    };

    if (r.paymentType === "Cheque") {
      base.bankName = r.bankName;
      base.chequeNumber = chequeNumDiff
        ? String(Number(r.chequeNumber) + 1)
        : r.chequeNumber;
      base.chequeDate = chequeDateDiff
        ? r.chequeDate.replace(/-(\d{2})$/, (_, d) =>
            "-" + String(Math.min(28, Number(d) + 2)).padStart(2, "0"))
        : r.chequeDate;
      base.clearingDate = clearingDateDiff
        ? r.clearingDate.replace(/-(\d{2})$/, (_, d) =>
            "-" + String(Math.min(28, Number(d) + 3)).padStart(2, "0"))
        : r.clearingDate;
    }

    if (r.paymentType === "NEFT") {
      const txnDiff = i % 10 === 0;
      const neftDateDiff = i % 7 === 0;
      base.transactionId = txnDiff
        ? r.transactionId.replace(/\d{3}$/, (m) => String(Number(m) + 5).padStart(3, "0"))
        : r.transactionId;
      base.neftDate = neftDateDiff
        ? r.neftDate.replace(/-(\d{2})$/, (_, d) =>
            "-" + String(Math.min(28, Number(d) + 1)).padStart(2, "0"))
        : r.neftDate;
    }
    matched.push(base);
  });

  // Extra uploaded-only rows (no matching system record) → "unmatched uploaded"
  const extra = Array.from({ length: Math.max(3, Math.floor(records.length * 0.1)) }, (_, k) => {
    const idx = 9000 + k;
    const pt = k % 2 === 0 ? "Cheque" : "NEFT";
    const row = {
      proposalId: `EXT-PROP-${idx}`,
      memberName: `Uploaded Member ${k + 1}`,
      premium: 3500 + k * 250,
      paymentType: pt,
      icName: "External IC",
      uploadedStatus: "Payment received (completed)",
    };
    if (pt === "Cheque") {
      row.bankName = BANKS[idx % BANKS.length];
      row.chequeNumber = String(800000 + idx);
      row.chequeDate = `2026-${String((k % 12) + 1).padStart(2, "0")}-${String((k % 28) + 1).padStart(2, "0")}`;
      row.clearingDate = `2026-${String((k % 12) + 1).padStart(2, "0")}-${String(((k + 3) % 28) + 1).padStart(2, "0")}`;
    } else {
      row.transactionId = `TXN${String(idx * 12345 + 100000).slice(-9)}`;
      row.neftDate = `2026-${String((k % 12) + 1).padStart(2, "0")}-${String((k % 28) + 1).padStart(2, "0")}`;
    }
    return row;
  });

  return [...matched, ...extra];
}

export default function Reconciliation() {
  const fileRef = useRef();
  const { addRefund } = useRefunds();

  // mode: list | upload | review | done
  const [mode, setMode] = useState("list");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Live list data — starts from BASE_DATA, updated after reconciliation
  const [listData, setListData] = useState(BASE_DATA);

  // Top filter bar
  const [topCampaign, setTopCampaign] = useState("5");
  const [topAssoc, setTopAssoc] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("5");

  // Table filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payTypeFilter, setPayTypeFilter] = useState("Cheque");

  // Reconcile review state
  const [reconcileBase, setReconcileBase] = useState([]);
  const [uploadedRows, setUploadedRows] = useState([]);
  const [rowActions, setRowActions] = useState({});
  const [rowReasons, setRowReasons] = useState({});
  const [reviewTab, setReviewTab] = useState("matched");
  // Manual matching state: expandedUnmatched = proposalId of the unmatched row being matched
  // selectedPending = id of the pending record chosen for comparison
  // manualMatches = { unmatchedProposalId: { pendingId, action, reason } }
  const [expandedUnmatched, setExpandedUnmatched] = useState(null);
  const [selectedPending, setSelectedPending] = useState(null);
  const [manualMatches, setManualMatches] = useState({});
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingDateFrom, setPendingDateFrom] = useState("");
  const [pendingDateTo, setPendingDateTo] = useState("");
  const [viewTransaction, setViewTransaction] = useState(null); // { system, uploaded }

  const handleApply = () => setCampaignFilter(topCampaign);

  const filtered = listData.filter((p) => {
    const matchCampaign =
      !campaignFilter || p.campaignId === Number(campaignFilter);
    const matchStatus = !statusFilter || p.paymentStatus === statusFilter;
    const matchPayType = !payTypeFilter || p.paymentType === payTypeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      p.memberName.toLowerCase().includes(q) ||
      p.proposalId.toLowerCase().includes(q) ||
      p.product.toLowerCase().includes(q) ||
      p.mobile.includes(q);
    return matchCampaign && matchStatus && matchPayType && matchSearch;
  });

  const pg = usePagination(filtered, 10);

  // ── start reconcile ────────────────────────────────────────────────────────
  const startReconcile = () => {
    setFile(null);
    setMode("upload");
  };

  const handleFile = (f) => {
    if (f) setFile(f);
  };

  const handleSubmitUpload = () => {
    const base = filtered; // reconcile against currently filtered records
    const uploaded = buildUploadedRows(base);
    setReconcileBase(base);
    setUploadedRows(uploaded);
    setRowActions({});
    setRowReasons({});
    setReviewTab("matched");
    setMode("review");
  };

  const setAction = (id, action) =>
    setRowActions((prev) => ({ ...prev, [id]: action }));

  const setReason = (id, reason) =>
    setRowReasons((prev) => ({ ...prev, [id]: reason }));

  const handleFinalize = () => {
    setListData((prev) =>
      prev
        .map((p) => {
          const action = rowActions[p.id];
          if (action === "accept") return { ...p, paymentStatus: "Payment received (completed)" };
          if (action === "reject") return { ...p, paymentStatus: "Payment Failed" };
          return p;
        })
        .filter((p) => p.paymentStatus !== "Payment received (completed)"),
    );

    setMode("done");
  };

  const reviewCounts = {
    total: reconcileBase.length,
    pending: reconcileBase.filter((r) => !rowActions[r.id]).length,
    accepted: Object.values(rowActions).filter((a) => a === "accept").length,
    rejected: Object.values(rowActions).filter((a) => a === "reject").length,
  };

  // Classify records into tabs by proposalId + amount match
  const uploadedMap = {};
  uploadedRows.forEach((u) => { uploadedMap[u.proposalId] = u; });
  const systemIds = new Set(reconcileBase.map((r) => r.proposalId));

  const matchedRecords = reconcileBase
    .filter((r) => uploadedMap[r.proposalId] && uploadedMap[r.proposalId].premium === r.premium)
    .map((r) => ({ system: r, uploaded: uploadedMap[r.proposalId] }));
  const amountMismatchIds = new Set(
    reconcileBase
      .filter((r) => uploadedMap[r.proposalId] && uploadedMap[r.proposalId].premium !== r.premium)
      .map((r) => r.proposalId),
  );
  const pendingRecords = reconcileBase.filter((r) => !uploadedMap[r.proposalId] || amountMismatchIds.has(r.proposalId));
  const unmatchedUploaded = uploadedRows.filter((u) => !systemIds.has(u.proposalId) || amountMismatchIds.has(u.proposalId));

  // ════════════════════════════════════════════════════════════════════════════
  // UPLOAD STEP
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === "upload") {
    return (
      <div>
        <PageHeader
          icon={<DocumentIcon />}
          title="Reconciliation — Upload"
          subtitle="Upload the IC / external data file to reconcile against filtered records"
        >
          <button className="btn btn-ghost" onClick={() => setMode("list")}>
            ← Back
          </button>
        </PageHeader>

        <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              Upload Payment Data File
            </div>
            <div
              style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}
            >
              Upload the Excel or CSV file received from the insurance company.
              The data will be matched against the{" "}
              <strong>{filtered.length}</strong> records currently filtered on
              the reconciliation page.
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "var(--brand)" : file ? "#15803d" : "var(--border)"}`,
                borderRadius: 14,
                cursor: "pointer",
                textAlign: "center",
                padding: "44px 32px",
                transition: "all .18s",
                background: dragging
                  ? "#f5f3ff"
                  : file
                    ? "#f0fdf4"
                    : "var(--surface-2)",
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div
                    style={{ fontWeight: 700, fontSize: 15, color: "#15803d" }}
                  >
                    {file.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      marginTop: 4,
                    }}
                  >
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                  <div
                    style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}
                  >
                    Drag & drop your file here
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-3)" }}>
                    or click to browse — CSV, XLSX, XLS supported
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button className="btn btn-ghost" onClick={() => setMode("list")}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={!file}
                onClick={handleSubmitUpload}
                style={{
                  opacity: file ? 1 : 0.5,
                  cursor: file ? "pointer" : "not-allowed",
                }}
              >
                Submit & Compare →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DONE STEP
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === "done") {
    return (
      <div>
        <PageHeader
          icon={<DocumentIcon />}
          title="Reconciliation Complete"
          subtitle="Summary of actions taken"
        />
        <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "44px 32px" }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>
              Reconciliation Saved
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: "var(--text-3)",
                marginBottom: 32,
              }}
            >
              {file?.name} ·{" "}
              {formatDate(new Date().toLocaleDateString("en-CA"))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
                marginBottom: 32,
              }}
            >
              {[
                {
                  label: "Total Records",
                  value: reviewCounts.total,
                  bg: "#f5f3ff",
                  color: "#7c3aed",
                },
                {
                  label: "Accepted (Payment Received)",
                  value: reviewCounts.accepted,
                  bg: "#dcfce7",
                  color: "#15803d",
                },
                {
                  label: "Payment Failed",
                  value: reviewCounts.rejected,
                  bg: "#fee2e2",
                  color: "#dc2626",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  style={{
                    background: k.bg,
                    borderRadius: 10,
                    padding: "16px",
                  }}
                >
                  <div
                    style={{ fontSize: 28, fontWeight: 800, color: k.color }}
                  >
                    {k.value}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1a1628",
                      marginTop: 4,
                    }}
                  >
                    {k.label}
                  </div>
                </div>
              ))}
            </div>
            {reviewCounts.pending > 0 && (
              <div
                style={{
                  background: "#fff3e0",
                  border: "1px solid #fbbf24",
                  borderRadius: 8,
                  padding: "10px 16px",
                  marginBottom: 20,
                  fontSize: 13,
                  color: "#a05c00",
                }}
              >
                ⚠️ {reviewCounts.pending} record(s) were not actioned.
              </div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                className="btn btn-ghost"
                onClick={() => setMode("review")}
              >
                ← Back to Review
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setMode("list");
                  setFile(null);
                  setStatusFilter("Payment Failed");
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REVIEW STEP
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === "review") {
    const allActioned = reviewCounts.pending === 0;

    return (
      <div>
        <PageHeader
          icon={<DocumentIcon />}
          title="Reconciliation Review"
          subtitle={`${file?.name} ·`}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setMode("upload")}>
              ← Re-upload
            </button>
            <button className="btn btn-primary" onClick={handleFinalize}>
              Finalise →
            </button>
          </div>
        </PageHeader>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 0, borderBottom: "2px solid var(--border)" }}>
          {[
            { key: "matched",   label: "Matched Payments",   count: matchedRecords.length,   color: "#15803d", bg: "#dcfce7" },

            { key: "pending",   label: "Pending Payments",   count: pendingRecords.length,   color: "#92400e", bg: "#fff3e0" },
            { key: "unmatched", label: "Unmatched Payments",  count: unmatchedUploaded.length, color: "#dc2626", bg: "#fee2e2" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setReviewTab(t.key)}
              style={{
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                border: "none",
                borderBottom: reviewTab === t.key ? `3px solid ${t.color}` : "3px solid transparent",
                background: reviewTab === t.key ? t.bg : "transparent",
                color: reviewTab === t.key ? t.color : "#64748b",
                transition: "all .15s",
              }}
            >
              {t.label}
              <span style={{
                marginLeft: 8,
                padding: "2px 8px",
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 800,
                background: reviewTab === t.key ? t.color : "#e2e8f0",
                color: reviewTab === t.key ? "#fff" : "#64748b",
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── PENDING TAB: Unmatched system records ─────────────────────── */}
        {reviewTab === "pending" && (
        <div className="card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap" style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
              <table style={{ fontSize: 13 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Order ID</th>
                    <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Member</th>
                    {payTypeFilter === "Cheque" && <>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Cheque No.</th>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Cheque Date</th>
                    </>}
                    {payTypeFilter === "NEFT" && <>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Transaction No.</th>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Transaction Date</th>
                    </>}
                    <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Amount</th>
                    <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRecords.length === 0 ? (
                    <tr><td colSpan={payTypeFilter === "Cheque" ? 6 : payTypeFilter === "NEFT" ? 6 : 4} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>No unmatched system records</td></tr>
                  ) : (
                    pendingRecords.map((rec) => (
                      <tr key={rec.id} style={{ background: "#f0f7ff" }}>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{rec.proposalId}</td>
                        <td style={{ fontWeight: 500 }}>{rec.memberName}</td>
                        {payTypeFilter === "Cheque" && <>
                          <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{rec.chequeNumber ?? "—"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{rec.chequeDate ? formatDate(rec.chequeDate) : "—"}</td>
                        </>}
                        {payTypeFilter === "NEFT" && <>
                          <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#0369a1" }}>{rec.transactionId ?? "—"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{rec.neftDate ? formatDate(rec.neftDate) : "—"}</td>
                        </>}
                        <td style={{ fontWeight: 600 }}>{fmt(rec.premium)}</td>
                        <td><StatusPill status={rec.paymentStatus} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* ── MATCHED TAB: System + Uploaded side-by-side ────────────────── */}
        {reviewTab === "matched" && (
        <div className="card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <div className="card-body" style={{ padding: 0 }}>
            {matchedRecords.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>
                {matchedRecords.filter(({ system }) => rowActions[system.id] === "accept").length} of {matchedRecords.length} accepted
              </span>
              {matchedRecords.some(({ system }) => rowActions[system.id] !== "accept") ? (
                <button
                  type="button"
                  onClick={() => {
                    const updates = {};
                    matchedRecords.forEach(({ system }) => { updates[system.id] = "accept"; });
                    setRowActions((prev) => ({ ...prev, ...updates }));
                  }}
                  style={{
                    padding: "7px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ✓ Accept All Matched ({matchedRecords.length})
                </button>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>✓ All matched records accepted</span>
              )}
            </div>
            )}
            <div className="table-wrap" style={{ maxHeight: "calc(100vh - 370px)", overflowY: "auto" }}>
              {payTypeFilter === "Cheque" ? (
              <table style={{ fontSize: 13 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Order ID</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Member</th>
                    <th colSpan={4} style={{ textAlign: "center", position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8", borderBottom: "2px solid #93c5fd", zIndex: 3 }}>System Record</th>
                    <th colSpan={4} style={{ textAlign: "center", position: "sticky", top: 0, background: "#fefce8", color: "#a16207", borderBottom: "2px solid #fde047", zIndex: 3 }}>Uploaded Record</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", minWidth: 230, position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Action</th>
                  </tr>
                  <tr>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Bank</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Cheque No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Cheque Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Amount</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Bank</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Cheque No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Cheque Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedRecords.length === 0 ? (
                    <tr><td colSpan={11} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>No matched records</td></tr>
                  ) : (
                    matchedRecords.map(({ system: rec, uploaded: up }) => (
                        <tr key={rec.id} style={{ background: "#fff" }}>
                          <td style={{ fontFamily: "monospace", fontSize: 11.5, color: "#7c3aed" }}>{rec.proposalId}</td>
                          <td style={{ fontWeight: 500 }}>{rec.memberName}</td>
                          <td style={{ background: "#f0f7ff" }}>{rec.bankName ?? "—"}</td>
                          <td style={{ background: "#f0f7ff", fontFamily: "monospace", fontWeight: 600 }}>{rec.chequeNumber}</td>
                          <td style={{ background: "#f0f7ff", whiteSpace: "nowrap" }}>{formatDate(rec.chequeDate)}</td>
                          <td style={{ background: "#f0f7ff", fontWeight: 600 }}>{fmt(rec.premium)}</td>
                          <td style={{ background: "#fffef0", color: up.bankName !== rec.bankName ? "#dc2626" : "inherit" }}>
                            {up.bankName ?? "—"}{up.bankName !== rec.bankName && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", fontFamily: "monospace", fontWeight: 600, color: up.chequeNumber !== rec.chequeNumber ? "#dc2626" : "inherit" }}>
                            {up.chequeNumber}{up.chequeNumber !== rec.chequeNumber && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", whiteSpace: "nowrap", color: up.chequeDate !== rec.chequeDate ? "#dc2626" : "inherit" }}>
                            {formatDate(up.chequeDate)}{up.chequeDate !== rec.chequeDate && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", fontWeight: 600, color: up.premium !== rec.premium ? "#dc2626" : "inherit" }}>
                            {fmt(up.premium)}{up.premium !== rec.premium && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td>
                            <button type="button" onClick={() => setViewTransaction({ system: rec, uploaded: up })}
                              style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #7c3aed", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                              View Transaction
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
              ) : (
              <table style={{ fontSize: 13 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Order ID</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Member</th>
                    <th colSpan={3} style={{ textAlign: "center", position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8", borderBottom: "2px solid #93c5fd", zIndex: 3 }}>System Record</th>
                    <th colSpan={4} style={{ textAlign: "center", position: "sticky", top: 0, background: "#fefce8", color: "#a16207", borderBottom: "2px solid #fde047", zIndex: 3 }}>Uploaded Record</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", minWidth: 160, position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Action</th>
                  </tr>
                  <tr>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Transaction No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Transaction Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Amount</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Member Name</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Transaction No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Transaction Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedRecords.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>No matched records</td></tr>
                  ) : (
                    matchedRecords.map(({ system: rec, uploaded: up }) => (
                        <tr key={rec.id} style={{ background: "#fff" }}>
                          <td style={{ fontFamily: "monospace", fontSize: 11.5, color: "#7c3aed" }}>{rec.proposalId}</td>
                          <td style={{ fontWeight: 500 }}>{rec.memberName}</td>
                          <td style={{ background: "#f0f7ff", fontFamily: "monospace", fontWeight: 600, color: "#0369a1" }}>{rec.transactionId}</td>
                          <td style={{ background: "#f0f7ff", whiteSpace: "nowrap" }}>{formatDate(rec.neftDate)}</td>
                          <td style={{ background: "#f0f7ff", fontWeight: 600 }}>{fmt(rec.premium)}</td>
                          <td style={{ background: "#fffef0", color: up.memberName !== rec.memberName ? "#dc2626" : "inherit" }}>
                            {up.memberName ?? "—"}{up.memberName !== rec.memberName && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", fontFamily: "monospace", fontWeight: 600, color: up.transactionId !== rec.transactionId ? "#dc2626" : "#0369a1" }}>
                            {up.transactionId ?? "—"}{up.transactionId !== rec.transactionId && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", whiteSpace: "nowrap", color: up.neftDate !== rec.neftDate ? "#dc2626" : "inherit" }}>
                            {up.neftDate ? formatDate(up.neftDate) : "—"}{up.neftDate !== rec.neftDate && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", fontWeight: 600, color: up.premium !== rec.premium ? "#dc2626" : "inherit" }}>
                            {fmt(up.premium)}{up.premium !== rec.premium && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td>
                            <button type="button" onClick={() => setViewTransaction({ system: rec, uploaded: up })}
                              style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #7c3aed", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                              View Transaction
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
        )}

        {/* ── UNMATCHED TAB: Uploaded records with no system match ───────── */}
        {reviewTab === "unmatched" && (() => {
          const isCheque = payTypeFilter === "Cheque";
          const isNeft = payTypeFilter === "NEFT";
          const colCount = isCheque ? 5 : isNeft ? 5 : 3;
          const alreadyMatchedPendingIds = new Set(Object.values(manualMatches).map((m) => m.pendingId));
          const availablePending = pendingRecords.filter((p) => !alreadyMatchedPendingIds.has(p.id));
          const activeUnmatchedRow = expandedUnmatched
            ? unmatchedUploaded.find((u) => u.proposalId === expandedUnmatched)
            : null;
          const activePendingRecord = selectedPending
            ? pendingRecords.find((p) => p.id === selectedPending)
            : null;
          const closeMatchFlow = () => {
            setExpandedUnmatched(null);
            setSelectedPending(null);
            setPendingSearch("");
            setPendingDateFrom("");
            setPendingDateTo("");
          };

          return (
          <div className="card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-wrap" style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
                <table style={{ fontSize: 13 }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                    <tr>
                      {isCheque && <>
                        <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3 }}>Cheque No.</th>
                        <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3 }}>Cheque Date</th>
                      </>}
                      {isNeft && <>
                        <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3 }}>Transaction No.</th>
                        <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3 }}>Transaction Date</th>
                      </>}
                      <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3 }}>Amount</th>
                      <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3 }}>IC Status</th>
                      <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3, minWidth: 180 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unmatchedUploaded.length === 0 ? (
                      <tr><td colSpan={colCount} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>No unmatched uploaded records</td></tr>
                    ) : (
                      unmatchedUploaded.map((up) => {
                        const mm = manualMatches[up.proposalId];
                        const isExpanded = expandedUnmatched === up.proposalId;
                        const matchedPendingRec = mm ? pendingRecords.find((p) => p.id === mm.pendingId) : null;

                        return [
                          /* ── Uploaded row ── */
                          <tr key={up.proposalId} style={{ background: mm?.action === "accept" ? "#f0fdf4" : mm?.action === "reject" ? "#fff5f5" : "#fff5f5", borderLeft: mm?.action === "accept" ? "3px solid #16a34a" : mm?.action === "reject" ? "3px solid #dc2626" : "none" }}>
                            {isCheque && <>
                              <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{up.chequeNumber ?? "—"}</td>
                              <td style={{ whiteSpace: "nowrap" }}>{up.chequeDate ? formatDate(up.chequeDate) : "—"}</td>
                            </>}
                            {isNeft && <>
                              <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#0369a1" }}>{up.transactionId ?? "—"}</td>
                              <td style={{ whiteSpace: "nowrap" }}>{up.neftDate ? formatDate(up.neftDate) : "—"}</td>
                            </>}
                            <td style={{ fontWeight: 600 }}>{fmt(up.premium)}</td>
                            <td><StatusPill status={up.uploadedStatus} /></td>
                            <td>
                              {mm?.action === "accept" && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#15803d" }}>✓ Accepted</span>
                                  <button type="button" onClick={() => setManualMatches((prev) => { const n = { ...prev }; delete n[up.proposalId]; return n; })}
                                    style={{ fontSize: 11, color: "#64748b", background: "none", border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>Undo</button>
                                </div>
                              )}
                              {mm?.action === "reject" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#dc2626" }}>✕ Rejected</span>
                                    <button type="button" onClick={() => setManualMatches((prev) => { const n = { ...prev }; delete n[up.proposalId]; return n; })}
                                      style={{ fontSize: 11, color: "#64748b", background: "none", border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>Undo</button>
                                  </div>
                                  {mm.reason && <span style={{ fontSize: 13, color: "#64748b" }}>{mm.reason}</span>}
                                </div>
                              )}
                              {!mm && !isExpanded && (
                                <button type="button" onClick={() => { setExpandedUnmatched(up.proposalId); setSelectedPending(null); }}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #7c3aed", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
                                  Match with Pending
                                </button>
                              )}
                              {!mm && isExpanded && (
                                <button type="button" onClick={closeMatchFlow}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #64748b", background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>,

                          /* ── Matched pending row shown below after action ── */
                          mm && matchedPendingRec && (
                            <tr key={`${up.proposalId}-matched`} style={{ background: "#f0f7ff", borderLeft: "3px solid #93c5fd" }}>
                              {isCheque && <>
                                <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.chequeNumber ?? "—"}</td>
                                <td style={{ whiteSpace: "nowrap", color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.chequeDate ? formatDate(matchedPendingRec.chequeDate) : "—"}</td>
                              </>}
                              {isNeft && <>
                                <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.transactionId ?? "—"}</td>
                                <td style={{ whiteSpace: "nowrap", color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.neftDate ? formatDate(matchedPendingRec.neftDate) : "—"}</td>
                              </>}
                              <td style={{ fontWeight: 600, color: "#1e40af", fontSize: 11.5 }}>{fmt(matchedPendingRec.premium)}</td>
                              <td style={{ fontSize: 13, color: "#1e40af" }}>Pending (System)</td>
                              <td style={{ fontSize: 13, color: "#64748b" }}>Matched ↑</td>
                            </tr>
                          ),
                        ];
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {expandedUnmatched && activeUnmatchedRow && (
              <PendingPickerModal
                uploaded={activeUnmatchedRow}
                availablePending={availablePending}
                isCheque={isCheque}
                isNeft={isNeft}
                search={pendingSearch}
                onSearch={setPendingSearch}
                dateFrom={pendingDateFrom}
                onDateFrom={setPendingDateFrom}
                dateTo={pendingDateTo}
                onDateTo={setPendingDateTo}
                onPick={(id) => setSelectedPending(id)}
                onClose={closeMatchFlow}
              />
            )}

            {expandedUnmatched && activeUnmatchedRow && selectedPending && activePendingRecord && (
              <MatchComparisonModal
                uploaded={activeUnmatchedRow}
                pending={activePendingRecord}
                isCheque={isCheque}
                isNeft={isNeft}
                manualMatch={manualMatches[activeUnmatchedRow.proposalId]}
                onAccept={() => {
                  setManualMatches((prev) => ({ ...prev, [activeUnmatchedRow.proposalId]: { pendingId: selectedPending, action: "accept" } }));
                  const diff = (activeUnmatchedRow.premium ?? 0) - (activePendingRecord.premium ?? 0);
                  if (diff > 0) {
                    addRefund({
                      proposalId: activePendingRecord.proposalId,
                      memberName: activePendingRecord.memberName,
                      mobile: activePendingRecord.mobile,
                      product: activePendingRecord.product,
                      icName: activePendingRecord.icName,
                      systemAmount: activePendingRecord.premium,
                      uploadedAmount: activeUnmatchedRow.premium,
                      refundAmount: diff,
                      paymentType: activePendingRecord.paymentType,
                    });
                  }
                  closeMatchFlow();
                }}
                onReject={() => {
                  setManualMatches((prev) => ({ ...prev, [activeUnmatchedRow.proposalId]: { pendingId: selectedPending, action: "reject", reason: "" } }));
                }}
                onSetReason={(reason) => {
                  setManualMatches((prev) => ({ ...prev, [activeUnmatchedRow.proposalId]: { ...prev[activeUnmatchedRow.proposalId], reason } }));
                  closeMatchFlow();
                }}
                onBack={() => setSelectedPending(null)}
                onClose={closeMatchFlow}
              />
            )}
          </div>
          );
        })()}

        {/* Transaction detail modal */}
        {viewTransaction && (
          <TransactionDetailModal
            system={viewTransaction.system}
            uploaded={viewTransaction.uploaded}
            onClose={() => setViewTransaction(null)}
          />
        )}

        {/* Sticky bottom bar */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#fff",
            borderTop: "1px solid var(--border)",
            marginTop: 20,
            padding: "14px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>
            {/* {reviewCounts.pending} record{reviewCounts.pending !== 1 ? "s" : ""}{" "}
            still pending */}
          </span>
          <button className="btn btn-primary" onClick={handleFinalize}>
            Finalise Reconciliation →
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LIST (default)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div>
      <PageHeader
        icon={<DocumentIcon />}
        title="Reconciliation"
        subtitle="Review initiated and rejected payment records"
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
            <div style={{ flex: "0 1 160px" }}>
              <label style={LABEL}>Pay Type</label>
              <select
                className="field-select"
                style={{ marginTop: 5 }}
                value={payTypeFilter}
                onChange={(e) => {
                  setPayTypeFilter(e.target.value);
                  pg.reset();
                }}
              >
                <option value="Cheque">Cheque</option>
                <option value="NEFT">NEFT</option>
              </select>
            </div>
            <div style={{ flex: "1 1 260px" }}>
              <label style={LABEL}>Campaign Name</label>
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
              <label style={LABEL}>Association</label>
              <select
                className="field-select"
                style={{ marginTop: 5 }}
                value={topAssoc}
                onChange={(e) => setTopAssoc(e.target.value)}
              >
                <option value="">All Associations</option>
                {ASSOCIATIONS.filter((a) => a.isActive).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleApply}
              style={{
                padding: "10px 32px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                background: "linear-gradient(180deg,#1565d8 0%,#104ea6 100%)",
                boxShadow: "0 2px 8px rgba(21,101,216,0.35)",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {/* Search + filters */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "flex-end",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={LABEL}>Search</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", display: "flex", pointerEvents: "none" }}>
                  <SearchIcon size={15} color="var(--text-3)" />
                </span>
                <input
                  className="field-input filter-search"
                  placeholder="Member, proposal, product, mobile…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    pg.reset();
                  }}
                  style={{ width: 260, paddingLeft: 34 }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={LABEL}>Status</label>
              <select
                className="field-select"
                style={{ width: 150 }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  pg.reset();
                }}
              >
                <option value="">All Status</option>
                <option value="Pending payment">Pending Payment</option>
                <option value="Payment Failed">Payment Failed</option>
              </select>
            </div>
            {(statusFilter || payTypeFilter || search) && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ alignSelf: "flex-end" }}
                onClick={() => {
                  setStatusFilter("");
                  setPayTypeFilter("");
                  setSearch("");
                  pg.reset();
                }}
              >
                Clear
              </button>
            )}
            <div
              style={{
                marginLeft: "auto",
                alignSelf: "flex-end",
                display: "flex",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => exportToExcel(filtered)}
                style={{
                  padding: "9px 18px",
                  borderRadius: 9,
                  border: "2px solid #0ea5e9",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#0ea5e9",
                  background: "#fff",
                  transition: "all .15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f9ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                ⬇ Export Excel
              </button>
              <button
                type="button"
                onClick={startReconcile}
                style={{
                  padding: "9px 22px",
                  borderRadius: 9,
                  border: "2px solid #a855f7",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#a855f7",
                  background: "#fff",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f5f3ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                Reconcile
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrap" style={{ maxHeight: 500, overflowY: "auto" }}>
            {payTypeFilter === "Cheque" ? (
              <table style={{ fontSize: 13, borderCollapse: "separate", borderSpacing: 0 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 3 }}>
                  <tr>
                    <th colSpan={3} style={{ textAlign: "center", background: "#fff", color: "#1a1628" }}>Member</th>
                    <th colSpan={8} style={{ textAlign: "center", background: "#f0f7ff", color: "#1d4ed8" }}>Cheque / Bank Info</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", background: "#fff" }}>Amount</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", background: "#fff" }}>Status</th>
                    <th style={{ textAlign: "center", background: "#f8fafc", color: "#64748b" }}>Meta</th>
                  </tr>
                  <tr>
                    <th style={{ background: "#fff" }}>Order ID</th>
                    <th style={{ background: "#fff" }}>Member Name</th>
                    <th style={{ background: "#fff" }}>Mobile</th>
                    <th style={{ background: "#f0f7ff" }}>Cheque No.</th>
                    <th style={{ background: "#f0f7ff" }}>Bank Name</th>
                    <th style={{ background: "#f0f7ff" }}>Cheque Date</th>
                    <th style={{ background: "#f0f7ff" }}>In Favour Of</th>
                    <th style={{ background: "#f0f7ff" }}>Deposit Location</th>
                    <th style={{ background: "#f0f7ff" }}>IFSC Code</th>
                    <th style={{ background: "#f0f7ff" }}>MICR Code</th>
                    <th style={{ background: "#f0f7ff" }}>Photo Doc</th>
                    <th style={{ background: "#f8fafc" }}>Campaign</th>
                  </tr>
                </thead>
                <tbody>
                  {pg.slice.length === 0 ? (
                    <tr>
                      <td colSpan={14} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    pg.slice.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{p.proposalId}</td>
                        <td style={{ fontWeight: 500 }}>{p.memberName}</td>
                        <td style={{ color: "#64748b" }}>{p.mobile}</td>
                        <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{p.chequeNumber ?? "—"}</td>
                        <td>{p.bankName ?? "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{p.chequeDate ? formatDate(p.chequeDate) : "—"}</td>
                        <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.inFavourOf ?? "—"}</td>
                        <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.chequeDepositLocation ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.ifscCode ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.micrCode ?? "—"}</td>
                        <td style={{ fontSize: 13, color: "#7c3aed", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.chequePhotoDocumentName ?? "—"}
                        </td>
                        <td style={{ fontWeight: 600 }}>{fmt(p.premium)}</td>
                        <td><StatusPill status={p.paymentStatus} /></td>
                        <td style={{ color: "var(--text-3)" }}>{p.campaignName ?? "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : payTypeFilter === "NEFT" ? (
              <table style={{ fontSize: 13, borderCollapse: "separate", borderSpacing: 0 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 3 }}>
                  <tr>
                    <th colSpan={3} style={{ textAlign: "center", background: "#fff", color: "#1a1628" }}>Member</th>
                    <th colSpan={8} style={{ textAlign: "center", background: "#f0f7ff", color: "#1d4ed8" }}>NEFT / Bank Info</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", background: "#fff" }}>Amount</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", background: "#fff" }}>Status</th>
                    <th style={{ textAlign: "center", background: "#f8fafc", color: "#64748b" }}>Meta</th>
                  </tr>
                  <tr>
                    <th style={{ background: "#fff" }}>Order ID</th>
                    <th style={{ background: "#fff" }}>Member Name</th>
                    <th style={{ background: "#fff" }}>Mobile</th>
                    <th style={{ background: "#f0f7ff" }}>Bank Name</th>
                    <th style={{ background: "#f0f7ff" }}>Branch Name</th>
                    <th style={{ background: "#f0f7ff" }}>Account Number</th>
                    <th style={{ background: "#f0f7ff" }}>Account Name</th>
                    <th style={{ background: "#f0f7ff" }}>IFSC Code</th>
                    <th style={{ background: "#f0f7ff" }}>Transaction ID</th>
                    <th style={{ background: "#f0f7ff" }}>NEFT Date</th>
                    <th style={{ background: "#f0f7ff" }}>Receipt Doc</th>
                    <th style={{ background: "#f8fafc" }}>Campaign</th>
                  </tr>
                </thead>
                <tbody>
                  {pg.slice.length === 0 ? (
                    <tr>
                      <td colSpan={14} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    pg.slice.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{p.proposalId}</td>
                        <td style={{ fontWeight: 500 }}>{p.memberName}</td>
                        <td style={{ color: "#64748b" }}>{p.mobile}</td>
                        <td>{p.bankName ?? "—"}</td>
                        <td>{p.branchName ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.accountNumber ?? "—"}</td>
                        <td style={{ fontWeight: 500 }}>{p.accountName ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.ifscCode ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#0369a1" }}>{p.transactionId ?? "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{p.neftDate ? formatDate(p.neftDate) : "—"}</td>
                        <td style={{ fontSize: 13, color: "#7c3aed", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.neftReceiptDocumentName ?? "—"}
                        </td>
                        <td style={{ fontWeight: 600 }}>{fmt(p.premium)}</td>
                        <td><StatusPill status={p.paymentStatus} /></td>
                        <td style={{ color: "var(--text-3)" }}>{p.campaignName ?? "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table style={{ fontSize: 13, borderCollapse: "separate", borderSpacing: 0 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 3 }}>
                  <tr>
                    <th style={{ background: "var(--card-bg, #fff)" }}>#</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Member</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Mobile</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Order ID</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Product</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>IC Name</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Premium</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Mode</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Pay Type</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Campaign</th>
                    <th style={{ background: "var(--card-bg, #fff)" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pg.slice.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    pg.slice.map((p) => (
                      <tr key={p.id}>
                        <td style={{ color: "var(--text-3)" }}>{p.id}</td>
                        <td style={{ fontWeight: 500 }}>{p.memberName}</td>
                        <td style={{ color: "#64748b" }}>{p.mobile}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{p.proposalId}</td>
                        <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.product}</td>
                        <td style={{ color: "#64748b" }}>{p.icName}</td>
                        <td style={{ fontWeight: 600 }}>{fmt(p.premium)}</td>
                        <td>
                          <span style={{ fontSize: 13, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: "#fef3c7", color: "#92400e" }}>
                            {p.paymentMode}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: "var(--text-2)" }}>{p.paymentType}</span>
                        </td>
                        <td style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.campaignName}
                        </td>
                        <td><StatusPill status={p.paymentStatus} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            total={pg.total}
            page={pg.page}
            perPage={pg.perPage}
            onPage={pg.onPage}
            onPerPage={pg.onPerPage}
          />
        </div>
      </div>
    </div>
  );
}
