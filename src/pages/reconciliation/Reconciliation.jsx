import { useState, useRef } from "react";
import { PageHeader } from "../../components/UI";
import { DocumentIcon } from "../../icons";
import { POLICY_MOCK } from "../policy/PolicyList";
import { ASSOCIATIONS } from "../customer/orgAssocData";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";

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
  "Customer details mismatch",
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

const STATUS_META = {
  Initiated: { color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc" },
  Rejected: { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  Paid: { color: "#15803d", bg: "#dcfce7", border: "#86efac" },
};

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
  (p) => p.paymentStatus === "Initiated" || p.paymentStatus === "Rejected",
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
    accountName:               p.customerName,
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
  const m = STATUS_META[status] ?? STATUS_META.Initiated;
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

function exportToExcel(rows) {
  const headers = [
    "ID",
    "Proposal ID",
    "Customer Name",
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
        p.customerName,
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
      customerName: nameDiff
        ? r.customerName.split(" ").reverse().join(" ")
        : r.customerName,
      premium: premiumDiff ? r.premium + 500 : r.premium,
      paymentType: r.paymentType,
      icName: r.icName,
      uploadedStatus: "Paid",
    };

    if (r.paymentType === "Cheque") {
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
      customerName: `Uploaded Customer ${k + 1}`,
      premium: 3500 + k * 250,
      paymentType: pt,
      icName: "External IC",
      uploadedStatus: "Paid",
    };
    if (pt === "Cheque") {
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
  const [countAdj, setCountAdj] = useState({
    acceptedInitiated: 0,
    acceptedRejected: 0,
    movedToRejected: 0,
  });

  const handleApply = () => setCampaignFilter(topCampaign);

  const filtered = listData.filter((p) => {
    const matchCampaign =
      !campaignFilter || p.campaignId === Number(campaignFilter);
    const matchStatus = !statusFilter || p.paymentStatus === statusFilter;
    const matchPayType = !payTypeFilter || p.paymentType === payTypeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      p.customerName.toLowerCase().includes(q) ||
      p.proposalId.toLowerCase().includes(q) ||
      p.product.toLowerCase().includes(q) ||
      p.mobile.includes(q);
    return matchCampaign && matchStatus && matchPayType && matchSearch;
  });

  const pg = usePagination(filtered, 10);
  const counts = {
    All: 462 - countAdj.acceptedInitiated - countAdj.acceptedRejected,
    Initiated: 82 - countAdj.acceptedInitiated - countAdj.movedToRejected,
    Rejected: 380 - countAdj.acceptedRejected + countAdj.movedToRejected,
  };

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
    const acceptedInitiated = reconcileBase.filter(
      (r) => rowActions[r.id] === "accept" && r.paymentStatus === "Initiated",
    ).length;
    const acceptedRejected = reconcileBase.filter(
      (r) => rowActions[r.id] === "accept" && r.paymentStatus === "Rejected",
    ).length;
    const movedToRejected = reconcileBase.filter(
      (r) => rowActions[r.id] === "reject" && r.paymentStatus === "Initiated",
    ).length;

    setCountAdj((prev) => ({
      acceptedInitiated: prev.acceptedInitiated + acceptedInitiated,
      acceptedRejected: prev.acceptedRejected + acceptedRejected,
      movedToRejected: prev.movedToRejected + movedToRejected,
    }));

    setListData((prev) =>
      prev
        .map((p) => {
          const action = rowActions[p.id];
          if (action === "accept") return { ...p, paymentStatus: "Paid" };
          if (action === "reject") return { ...p, paymentStatus: "Rejected" };
          return p;
        })
        .filter((p) => p.paymentStatus !== "Paid"),
    );

    setMode("done");
  };

  const reviewCounts = {
    total: reconcileBase.length,
    pending: reconcileBase.filter((r) => !rowActions[r.id]).length,
    accepted: Object.values(rowActions).filter((a) => a === "accept").length,
    rejected: Object.values(rowActions).filter((a) => a === "reject").length,
  };

  // Classify records into tabs by matching proposalId
  const uploadedMap = {};
  uploadedRows.forEach((u) => { uploadedMap[u.proposalId] = u; });
  const systemIds = new Set(reconcileBase.map((r) => r.proposalId));

  const matchedRecords = reconcileBase
    .filter((r) => uploadedMap[r.proposalId])
    .map((r) => ({ system: r, uploaded: uploadedMap[r.proposalId] }));
  const pendingRecords = reconcileBase.filter((r) => !uploadedMap[r.proposalId]);
  const unmatchedUploaded = uploadedRows.filter((u) => !systemIds.has(u.proposalId));

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
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
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
                  label: "Accepted (Paid)",
                  value: reviewCounts.accepted,
                  bg: "#dcfce7",
                  color: "#15803d",
                },
                {
                  label: "Rejected",
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
                  setStatusFilter("Rejected");
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
          subtitle={`${file?.name} · ${reconcileBase.length} records matched`}
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
            { key: "pending",   label: "Pending",   count: pendingRecords.length,   color: "#92400e", bg: "#fff3e0" },
            { key: "matched",   label: "Matched",   count: matchedRecords.length,   color: "#15803d", bg: "#dcfce7" },
            { key: "unmatched", label: "Unmatched",  count: unmatchedUploaded.length, color: "#dc2626", bg: "#fee2e2" },
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
                    <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Proposal ID</th>
                    <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Customer</th>
                    {payTypeFilter === "Cheque" && <>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Cheque No.</th>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Cheque Date</th>
                      <th style={{ position: "sticky", top: 0, background: "#eff6ff", zIndex: 3 }}>Clearing Date</th>
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
                    <tr><td colSpan={payTypeFilter === "Cheque" ? 8 : payTypeFilter === "NEFT" ? 7 : 5} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>No unmatched system records</td></tr>
                  ) : (
                    pendingRecords.map((rec) => (
                      <tr key={rec.id} style={{ background: "#f0f7ff" }}>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{rec.proposalId}</td>
                        <td style={{ fontWeight: 500 }}>{rec.customerName}</td>
                        {payTypeFilter === "Cheque" && <>
                          <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{rec.chequeNumber ?? "—"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{rec.chequeDate ?? "—"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{rec.clearingDate ?? "—"}</td>
                        </>}
                        {payTypeFilter === "NEFT" && <>
                          <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#0369a1" }}>{rec.transactionId ?? "—"}</td>
                          <td style={{ whiteSpace: "nowrap" }}>{rec.neftDate ?? "—"}</td>
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
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Proposal ID</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Customer</th>
                    <th colSpan={4} style={{ textAlign: "center", position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8", borderBottom: "2px solid #93c5fd", zIndex: 3 }}>System Record</th>
                    <th colSpan={4} style={{ textAlign: "center", position: "sticky", top: 0, background: "#fefce8", color: "#a16207", borderBottom: "2px solid #fde047", zIndex: 3 }}>Uploaded Record</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", minWidth: 230, position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Action</th>
                  </tr>
                  <tr>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Cheque No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Cheque Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Clearing Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Amount</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Cheque No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Cheque Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Clearing Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedRecords.length === 0 ? (
                    <tr><td colSpan={11} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>No matched records</td></tr>
                  ) : (
                    matchedRecords.map(({ system: rec, uploaded: up }) => {
                      const action = rowActions[rec.id];
                      const reason = rowReasons[rec.id] ?? "";
                      const chequeNumDiff = up.chequeNumber !== rec.chequeNumber;
                      const chequeDateDiff = up.chequeDate !== rec.chequeDate;
                      const clearingDateDiff = up.clearingDate !== rec.clearingDate;
                      const premDiff = up.premium !== rec.premium;

                      return (
                        <tr key={rec.id} style={{
                          background: action === "accept" ? "#f0fdf4" : action === "reject" ? "#fff5f5" : "#fff",
                          borderLeft: `3px solid ${action === "accept" ? "#16a34a" : action === "reject" ? "#dc2626" : "transparent"}`,
                        }}>
                          <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{rec.proposalId}</td>
                          <td style={{ fontWeight: 500 }}>{rec.customerName}</td>
                          <td style={{ background: "#f0f7ff", fontFamily: "monospace", fontWeight: 600 }}>{rec.chequeNumber}</td>
                          <td style={{ background: "#f0f7ff", whiteSpace: "nowrap" }}>{rec.chequeDate}</td>
                          <td style={{ background: "#f0f7ff", whiteSpace: "nowrap" }}>{rec.clearingDate}</td>
                          <td style={{ background: "#f0f7ff", fontWeight: 600 }}>{fmt(rec.premium)}</td>
                          <td style={{ background: "#fffef0", fontFamily: "monospace", fontWeight: 600, color: chequeNumDiff ? "#dc2626" : "inherit" }}>
                            {up.chequeNumber}{chequeNumDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", whiteSpace: "nowrap", color: chequeDateDiff ? "#dc2626" : "inherit" }}>
                            {up.chequeDate}{chequeDateDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", whiteSpace: "nowrap", color: clearingDateDiff ? "#dc2626" : "inherit" }}>
                            {up.clearingDate}{clearingDateDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", fontWeight: 600, color: premDiff ? "#dc2626" : "inherit" }}>
                            {fmt(up.premium)}{premDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td>
                            {action === "accept" && (
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#15803d" }}>✓ Accepted → Paid</span>
                                <button type="button" onClick={() => setAction(rec.id, null)}
                                  style={{ fontSize: 11, color: "#64748b", background: "none", border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>Undo</button>
                              </div>
                            )}
                            {action === "reject" && (
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#dc2626" }}>✕ Rejected</span>
                                  <button type="button" onClick={() => setAction(rec.id, null)}
                                    style={{ fontSize: 11, color: "#64748b", background: "none", border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>Undo</button>
                                </div>
                                {!reason && (
                                  <select className="field-select" style={{ fontSize: 13, padding: "4px 8px" }} value={reason}
                                    onChange={(e) => setReason(rec.id, e.target.value)}>
                                    <option value="">Select reason…</option>
                                    {REJECT_REASONS.map((r) => (<option key={r}>{r}</option>))}
                                  </select>
                                )}
                                {reason && <span style={{ fontSize: 13, color: "#64748b" }}>{reason}</span>}
                              </div>
                            )}
                            {!action && (
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <button type="button" onClick={() => setAction(rec.id, "accept")}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>✓ Accept</button>
                                <button type="button" onClick={() => setAction(rec.id, "reject")}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #dc2626", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>✕ Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              ) : (
              <table style={{ fontSize: 13 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                  <tr>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Proposal ID</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Customer</th>
                    <th colSpan={3} style={{ textAlign: "center", position: "sticky", top: 0, background: "#eff6ff", color: "#1d4ed8", borderBottom: "2px solid #93c5fd", zIndex: 3 }}>System Record</th>
                    <th colSpan={3} style={{ textAlign: "center", position: "sticky", top: 0, background: "#fefce8", color: "#a16207", borderBottom: "2px solid #fde047", zIndex: 3 }}>Uploaded Record</th>
                    <th rowSpan={2} style={{ verticalAlign: "bottom", minWidth: 230, position: "sticky", top: 0, background: "#fff", zIndex: 3 }}>Action</th>
                  </tr>
                  <tr>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Transaction No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Transaction Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#eff6ff", color: "#1e40af", fontSize: 13, zIndex: 3 }}>Amount</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Transaction No.</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Transaction Date</th>
                    <th style={{ position: "sticky", top: 36, background: "#fefce8", color: "#92400e", fontSize: 13, zIndex: 3 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedRecords.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>No matched records</td></tr>
                  ) : (
                    matchedRecords.map(({ system: rec, uploaded: up }) => {
                      const action = rowActions[rec.id];
                      const reason = rowReasons[rec.id] ?? "";
                      const txnDiff = up.transactionId !== rec.transactionId;
                      const dateDiff = up.neftDate !== rec.neftDate;
                      const premDiff = up.premium !== rec.premium;

                      return (
                        <tr key={rec.id} style={{
                          background: action === "accept" ? "#f0fdf4" : action === "reject" ? "#fff5f5" : "#fff",
                          borderLeft: `3px solid ${action === "accept" ? "#16a34a" : action === "reject" ? "#dc2626" : "transparent"}`,
                        }}>
                          <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{rec.proposalId}</td>
                          <td style={{ fontWeight: 500 }}>{rec.customerName}</td>
                          {/* System record cells — blue tint */}
                          <td style={{ background: "#f0f7ff", fontFamily: "monospace", fontWeight: 600, color: "#0369a1" }}>{rec.transactionId}</td>
                          <td style={{ background: "#f0f7ff", whiteSpace: "nowrap" }}>{rec.neftDate}</td>
                          <td style={{ background: "#f0f7ff", fontWeight: 600 }}>{fmt(rec.premium)}</td>
                          {/* Uploaded record cells — yellow tint, red text on mismatch */}
                          <td style={{ background: "#fffef0", fontFamily: "monospace", fontWeight: 600, color: txnDiff ? "#dc2626" : "#0369a1" }}>
                            {up.transactionId ?? "—"}{txnDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", whiteSpace: "nowrap", color: dateDiff ? "#dc2626" : "inherit" }}>
                            {up.neftDate ?? "—"}{dateDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          <td style={{ background: "#fffef0", fontWeight: 600, color: premDiff ? "#dc2626" : "inherit" }}>
                            {fmt(up.premium)}{premDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                          </td>
                          {/* Action column */}
                          <td>
                            {action === "accept" && (
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#15803d" }}>✓ Accepted → Paid</span>
                                <button type="button" onClick={() => setAction(rec.id, null)}
                                  style={{ fontSize: 11, color: "#64748b", background: "none", border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>Undo</button>
                              </div>
                            )}
                            {action === "reject" && (
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#dc2626" }}>✕ Rejected</span>
                                  <button type="button" onClick={() => setAction(rec.id, null)}
                                    style={{ fontSize: 11, color: "#64748b", background: "none", border: "1px solid #e2e8f0", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>Undo</button>
                                </div>
                                {!reason && (
                                  <select className="field-select" style={{ fontSize: 13, padding: "4px 8px" }} value={reason}
                                    onChange={(e) => setReason(rec.id, e.target.value)}>
                                    <option value="">Select reason…</option>
                                    {REJECT_REASONS.map((r) => (<option key={r}>{r}</option>))}
                                  </select>
                                )}
                                {reason && <span style={{ fontSize: 13, color: "#64748b" }}>{reason}</span>}
                              </div>
                            )}
                            {!action && (
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <button type="button" onClick={() => setAction(rec.id, "accept")}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>✓ Accept</button>
                                <button type="button" onClick={() => setAction(rec.id, "reject")}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #dc2626", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>✕ Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
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
          const colCount = isCheque ? 6 : isNeft ? 5 : 3;
          const alreadyMatchedPendingIds = new Set(Object.values(manualMatches).map((m) => m.pendingId));
          const availablePending = pendingRecords.filter((p) => !alreadyMatchedPendingIds.has(p.id));

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
                        <th style={{ position: "sticky", top: 0, background: "#fef2f2", zIndex: 3 }}>Clearing Date</th>
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
                              <td style={{ whiteSpace: "nowrap" }}>{up.chequeDate ?? "—"}</td>
                              <td style={{ whiteSpace: "nowrap" }}>{up.clearingDate ?? "—"}</td>
                            </>}
                            {isNeft && <>
                              <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#0369a1" }}>{up.transactionId ?? "—"}</td>
                              <td style={{ whiteSpace: "nowrap" }}>{up.neftDate ?? "—"}</td>
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
                                <button type="button" onClick={() => { setExpandedUnmatched(null); setSelectedPending(null); }}
                                  style={{ padding: "5px 14px", borderRadius: 7, border: "1.5px solid #64748b", background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" }}>
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>,

                          /* ── Expanded: pending record selector + comparison ── */
                          isExpanded && (
                            <tr key={`${up.proposalId}-expand`}>
                              <td colSpan={colCount} style={{ padding: 0, background: "#f8fafc", borderTop: "2px dashed #a78bfa" }}>
                                <div style={{ padding: "14px 16px" }}>
                                  {/* Pending record selector */}
                                  <div style={{ marginBottom: 12 }}>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".5px" }}>Select a pending record to compare:</label>
                                    <select className="field-select" style={{ marginTop: 6, maxWidth: 400 }} value={selectedPending ?? ""} onChange={(e) => setSelectedPending(e.target.value ? Number(e.target.value) : null)}>
                                      <option value="">— Choose pending record —</option>
                                      {availablePending.map((p) => (
                                        <option key={p.id} value={p.id}>
                                          {p.proposalId} — {p.customerName} — {fmt(p.premium)}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Comparison table */}
                                  {selectedPending && (() => {
                                    const pr = pendingRecords.find((p) => p.id === selectedPending);
                                    if (!pr) return null;
                                    return (
                                      <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                                        <table style={{ fontSize: 13, marginBottom: 0 }}>
                                          <thead>
                                            <tr>
                                              <th style={{ background: "#f1f5f9", width: 100 }}>Source</th>
                                              {isCheque && <>
                                                <th style={{ background: "#f1f5f9" }}>Cheque No.</th>
                                                <th style={{ background: "#f1f5f9" }}>Cheque Date</th>
                                                <th style={{ background: "#f1f5f9" }}>Clearing Date</th>
                                              </>}
                                              {isNeft && <>
                                                <th style={{ background: "#f1f5f9" }}>Transaction No.</th>
                                                <th style={{ background: "#f1f5f9" }}>Transaction Date</th>
                                              </>}
                                              <th style={{ background: "#f1f5f9" }}>Amount</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {/* Pending (system) row */}
                                            <tr style={{ background: "#eff6ff" }}>
                                              <td style={{ fontWeight: 700, color: "#1d4ed8", fontSize: 12 }}>System</td>
                                              {isCheque && <>
                                                <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{pr.chequeNumber ?? "—"}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>{pr.chequeDate ?? "—"}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>{pr.clearingDate ?? "—"}</td>
                                              </>}
                                              {isNeft && <>
                                                <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#0369a1" }}>{pr.transactionId ?? "—"}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>{pr.neftDate ?? "—"}</td>
                                              </>}
                                              <td style={{ fontWeight: 600 }}>{fmt(pr.premium)}</td>
                                            </tr>
                                            {/* Uploaded row */}
                                            <tr style={{ background: "#fefce8" }}>
                                              <td style={{ fontWeight: 700, color: "#a16207", fontSize: 12 }}>Uploaded</td>
                                              {isCheque && <>
                                                <td style={{ fontFamily: "monospace", fontWeight: 600, color: up.chequeNumber !== (pr.chequeNumber ?? "") ? "#dc2626" : "inherit" }}>
                                                  {up.chequeNumber ?? "—"}{up.chequeNumber !== (pr.chequeNumber ?? "") && <span style={{ marginLeft: 4 }}>⚠</span>}
                                                </td>
                                                <td style={{ whiteSpace: "nowrap", color: up.chequeDate !== (pr.chequeDate ?? "") ? "#dc2626" : "inherit" }}>
                                                  {up.chequeDate ?? "—"}{up.chequeDate !== (pr.chequeDate ?? "") && <span style={{ marginLeft: 4 }}>⚠</span>}
                                                </td>
                                                <td style={{ whiteSpace: "nowrap", color: up.clearingDate !== (pr.clearingDate ?? "") ? "#dc2626" : "inherit" }}>
                                                  {up.clearingDate ?? "—"}{up.clearingDate !== (pr.clearingDate ?? "") && <span style={{ marginLeft: 4 }}>⚠</span>}
                                                </td>
                                              </>}
                                              {isNeft && <>
                                                <td style={{ fontFamily: "monospace", fontWeight: 600, color: up.transactionId !== (pr.transactionId ?? "") ? "#dc2626" : "#0369a1" }}>
                                                  {up.transactionId ?? "—"}{up.transactionId !== (pr.transactionId ?? "") && <span style={{ marginLeft: 4 }}>⚠</span>}
                                                </td>
                                                <td style={{ whiteSpace: "nowrap", color: up.neftDate !== (pr.neftDate ?? "") ? "#dc2626" : "inherit" }}>
                                                  {up.neftDate ?? "—"}{up.neftDate !== (pr.neftDate ?? "") && <span style={{ marginLeft: 4 }}>⚠</span>}
                                                </td>
                                              </>}
                                              <td style={{ fontWeight: 600, color: up.premium !== pr.premium ? "#dc2626" : "inherit" }}>
                                                {fmt(up.premium)}{up.premium !== pr.premium && <span style={{ marginLeft: 4 }}>⚠</span>}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>

                                        {/* Accept / Reject buttons */}
                                        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 16px", borderTop: "1px solid var(--border)", background: "#fff" }}>
                                          <button type="button" onClick={() => {
                                            setManualMatches((prev) => ({ ...prev, [up.proposalId]: { pendingId: selectedPending, action: "accept" } }));
                                            setExpandedUnmatched(null); setSelectedPending(null);
                                          }}
                                            style={{ padding: "6px 18px", borderRadius: 7, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                                            ✓ Accept
                                          </button>
                                          <button type="button" onClick={() => {
                                            setManualMatches((prev) => ({ ...prev, [up.proposalId]: { pendingId: selectedPending, action: "reject", reason: "" } }));
                                          }}
                                            style={{ padding: "6px 18px", borderRadius: 7, border: "1.5px solid #dc2626", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                                            ✕ Reject
                                          </button>
                                          {/* Reject reason inline — shown after Reject is clicked */}
                                          {manualMatches[up.proposalId]?.action === "reject" && manualMatches[up.proposalId]?.reason === "" && (
                                            <select className="field-select" style={{ fontSize: 13, padding: "4px 8px", maxWidth: 220 }} value=""
                                              onChange={(e) => {
                                                setManualMatches((prev) => ({ ...prev, [up.proposalId]: { ...prev[up.proposalId], reason: e.target.value } }));
                                                setExpandedUnmatched(null); setSelectedPending(null);
                                              }}>
                                              <option value="">Select reason…</option>
                                              {REJECT_REASONS.map((r) => (<option key={r}>{r}</option>))}
                                            </select>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </td>
                            </tr>
                          ),

                          /* ── Matched pending row shown below after action ── */
                          mm && matchedPendingRec && (
                            <tr key={`${up.proposalId}-matched`} style={{ background: "#f0f7ff", borderLeft: "3px solid #93c5fd" }}>
                              {isCheque && <>
                                <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.chequeNumber ?? "—"}</td>
                                <td style={{ whiteSpace: "nowrap", color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.chequeDate ?? "—"}</td>
                                <td style={{ whiteSpace: "nowrap", color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.clearingDate ?? "—"}</td>
                              </>}
                              {isNeft && <>
                                <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.transactionId ?? "—"}</td>
                                <td style={{ whiteSpace: "nowrap", color: "#1e40af", fontSize: 11.5 }}>{matchedPendingRec.neftDate ?? "—"}</td>
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
          </div>
          );
        })()}

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
            {reviewCounts.pending} record{reviewCounts.pending !== 1 ? "s" : ""}{" "}
            still pending
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
                background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
                boxShadow: "0 2px 8px rgba(168,85,247,0.35)",
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

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Total",
            count: counts.All,
            amount: "₹1,61,70,000",
            color: "#7c3aed",
            border: "#ddd6fe",
          },
          {
            label: "Initiated",
            count: counts.Initiated,
            amount: "₹28,70,000",
            color: "#0369a1",
            border: "#7dd3fc",
          },
          {
            label: "Rejected",
            count: counts.Rejected,
            amount: "₹1,33,00,000",
            color: "#dc2626",
            border: "#fca5a5",
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
                fontSize: 13,
                fontWeight: 700,
                color: "#64748b",
                marginTop: 6,
                textTransform: "uppercase",
                letterSpacing: ".4px",
              }}
            >
              {s.label} Transactions
            </div>
          </div>
        ))}
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
              <input
                className="field-input filter-search"
                placeholder="Customer, proposal, product, mobile…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  pg.reset();
                }}
                style={{ width: 260 }}
              />
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
                <option value="Initiated">Initiated</option>
                <option value="Rejected">Rejected</option>
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
          <div className="table-wrap">
            {payTypeFilter === "Cheque" ? (
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Payment Detail ID</th>
                    <th>Cheque No.</th>
                    <th>Amount</th>
                    <th>Bank Name</th>
                    <th>Date</th>
                    <th>In Favour Of</th>
                    <th>Photo Doc</th>
                    <th>Deposit Location</th>
                    <th>IFSC Code</th>
                    <th>MICR Code</th>
                    <th>User ID</th>
                    <th>Campaign ID</th>
                    <th>Policy ID</th>
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
                        <td style={{ color: "var(--text-3)" }}>{p.id}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{p.paymentDetailId ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{p.chequeNumber ?? "—"}</td>
                        <td style={{ fontWeight: 600 }}>{fmt(p.premium)}</td>
                        <td>{p.bankName ?? "—"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{p.chequeDate ?? "—"}</td>
                        <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.inFavourOf ?? "—"}</td>
                        <td style={{ fontSize: 13, color: "#7c3aed", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.chequePhotoDocumentName ?? "—"}
                        </td>
                        <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.chequeDepositLocation ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.ifscCode ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.micrCode ?? "—"}</td>
                        <td style={{ color: "var(--text-3)" }}>{p.userId ?? "—"}</td>
                        <td style={{ color: "var(--text-3)" }}>{p.campaignId ?? "—"}</td>
                        <td style={{ color: "var(--text-3)" }}>{p.id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : payTypeFilter === "NEFT" ? (
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Payment Detail ID</th>
                    <th>Bank Name</th>
                    <th>Branch Name</th>
                    <th>Account Number</th>
                    <th>Account Name</th>
                    <th>IFSC Code</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Receipt Doc</th>
                    <th>User ID</th>
                    <th>Campaign ID</th>
                    <th>Policy ID</th>
                  </tr>
                </thead>
                <tbody>
                  {pg.slice.length === 0 ? (
                    <tr>
                      <td colSpan={13} style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                        No records found
                      </td>
                    </tr>
                  ) : (
                    pg.slice.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed" }}>{p.paymentDetailId ?? "—"}</td>
                        <td>{p.bankName ?? "—"}</td>
                        <td>{p.branchName ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.accountNumber ?? "—"}</td>
                        <td style={{ fontWeight: 500 }}>{p.accountName ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.ifscCode ?? "—"}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 13, color: "#0369a1" }}>{p.transactionId ?? "—"}</td>
                        <td style={{ fontWeight: 600 }}>{fmt(p.premium)}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{p.neftDate ?? "—"}</td>
                        <td style={{ fontSize: 13, color: "#7c3aed", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.neftReceiptDocumentName ?? "—"}
                        </td>
                        <td style={{ color: "var(--text-3)" }}>{p.userId ?? "—"}</td>
                        <td style={{ color: "var(--text-3)" }}>{p.campaignId ?? "—"}</td>
                        <td style={{ color: "var(--text-3)" }}>{p.id}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Mobile</th>
                    <th>Proposal ID</th>
                    <th>Product</th>
                    <th>IC Name</th>
                    <th>Premium</th>
                    <th>Mode</th>
                    <th>Pay Type</th>
                    <th>Campaign</th>
                    <th>Status</th>
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
                        <td style={{ fontWeight: 500 }}>{p.customerName}</td>
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
