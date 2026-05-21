import { useState, useRef } from "react";
import { UploadIcon, DocumentIcon, CheckIcon } from "../../icons";

// ── Mock database records ────────────────────────────────────────────────────
const DB_RECORDS = [
  { policyNo: "POL-2025-001", customerName: "Aarav Sharma",   mobile: "9876543210", icName: "Star Health Insurance", premium: 8500,  sumInsured: 500000, status: "Active",   policyType: "Health" },
  { policyNo: "POL-2025-002", customerName: "Rohit Sharma",   mobile: "9812000000", icName: "HDFC ERGO",             premium: 6200,  sumInsured: 300000, status: "Active",   policyType: "Health" },
  { policyNo: "POL-2025-003", customerName: "Divya Nair",     mobile: "9911223344", icName: "ICICI Lombard",         premium: 9100,  sumInsured: 500000, status: "Active",   policyType: "Health" },
  { policyNo: "POL-2025-004", customerName: "Vijay Patil",    mobile: "9011223344", icName: "Bajaj Allianz",         premium: 4800,  sumInsured: 0,      status: "Lapsed",   policyType: "Motor"  },
  { policyNo: "POL-2025-005", customerName: "Suresh Kumar",   mobile: "9988001122", icName: "Star Health Insurance", premium: 14000, sumInsured: 300000, status: "Active",   policyType: "Health" },
  { policyNo: "POL-2025-006", customerName: "Vikram Rao",     mobile: "9944556677", icName: "HDFC ERGO",             premium: 6200,  sumInsured: 250000, status: "Active",   policyType: "Health" },
  { policyNo: "POL-2025-007", customerName: "Kavita Pillai",  mobile: "9899112233", icName: "LIC",                   premium: 12000, sumInsured: 1000000,status: "Active",   policyType: "Life"   },
  { policyNo: "POL-2025-008", customerName: "Arjun Singh",    mobile: "9922334455", icName: "Bajaj Allianz",         premium: 4800,  sumInsured: 0,      status: "Active",   policyType: "Motor"  },
];

// External records: some match, some have discrepancies, one is new
const EXT_RECORDS = [
  { policyNo: "POL-2025-001", customerName: "Aarav Sharma",   mobile: "9876543210", icName: "Star Health Insurance", premium: 8500,  sumInsured: 500000, status: "Active",   policyType: "Health" },
  { policyNo: "POL-2025-002", customerName: "Rohit Sharma",   mobile: "9812000000", icName: "HDFC ERGO",             premium: 6500,  sumInsured: 300000, status: "Active",   policyType: "Health" }, // premium diff
  { policyNo: "POL-2025-003", customerName: "Divya Nair",     mobile: "9911223344", icName: "ICICI Lombard",         premium: 9100,  sumInsured: 750000, status: "Active",   policyType: "Health" }, // sumInsured diff
  { policyNo: "POL-2025-004", customerName: "Vijay Patil",    mobile: "9011223344", icName: "Bajaj Allianz",         premium: 4800,  sumInsured: 0,      status: "Active",   policyType: "Motor"  }, // status diff
  { policyNo: "POL-2025-005", customerName: "Suresh Kumar",   mobile: "9988001122", icName: "New India Assurance",   premium: 14000, sumInsured: 300000, status: "Active",   policyType: "Health" }, // icName diff
  { policyNo: "POL-2025-006", customerName: "Vikram Rao",     mobile: "9944556677", icName: "HDFC ERGO",             premium: 6200,  sumInsured: 250000, status: "Active",   policyType: "Health" },
  { policyNo: "POL-2025-007", customerName: "Kavitha Pillai", mobile: "9899112233", icName: "LIC",                   premium: 12000, sumInsured: 1000000,status: "Active",   policyType: "Life"   }, // name typo
  { policyNo: "POL-2025-008", customerName: "Arjun Singh",    mobile: "9922334455", icName: "Bajaj Allianz",         premium: 5200,  sumInsured: 0,      status: "Lapsed",   policyType: "Motor"  }, // premium + status diff
  { policyNo: "POL-2025-009", customerName: "Priya Mehta",    mobile: "9812345678", icName: "ICICI Lombard",         premium: 9100,  sumInsured: 500000, status: "Active",   policyType: "Health" }, // new in external
];

const COMPARE_FIELDS = [
  { key: "customerName", label: "Customer Name"     },
  { key: "mobile",       label: "Mobile"            },
  { key: "icName",       label: "Insurance Company" },
  { key: "policyType",   label: "Policy Type"       },
  { key: "premium",      label: "Premium (₹)",      format: v => v ? `₹${Number(v).toLocaleString("en-IN")}` : "—" },
  { key: "sumInsured",   label: "Sum Insured (₹)",  format: v => v ? `₹${Number(v).toLocaleString("en-IN")}` : "—" },
  { key: "status",       label: "Status"            },
];

function buildRows() {
  const dbMap = Object.fromEntries(DB_RECORDS.map(r => [r.policyNo, r]));
  const extMap = Object.fromEntries(EXT_RECORDS.map(r => [r.policyNo, r]));
  const allKeys = [...new Set([...Object.keys(dbMap), ...Object.keys(extMap)])].sort();

  return allKeys.map(policyNo => {
    const db  = dbMap[policyNo]  ?? null;
    const ext = extMap[policyNo] ?? null;
    const diffs = db && ext
      ? COMPARE_FIELDS.filter(f => String(db[f.key]) !== String(ext[f.key])).map(f => f.key)
      : [];
    const recordType = !db ? "new" : !ext ? "missing" : diffs.length === 0 ? "match" : "mismatch";
    return { policyNo, db, ext, diffs, recordType, action: "pending", narration: "" };
  });
}

const INITIAL_ROWS = buildRows();

const RECORD_BADGE = {
  match:    { label: "Match",    bg: "#e6f4ea", color: "#2d7d46" },
  mismatch: { label: "Mismatch", bg: "#fff3e0", color: "#a05c00" },
  new:      { label: "New",      bg: "#e0f4fb", color: "#0a7ea4" },
  missing:  { label: "Missing",  bg: "#fce7f3", color: "#9d174d" },
};

const ACTION_STYLE = {
  accepted: { bg: "#e6f4ea", color: "#2d7d46", border: "#2d7d46" },
  rejected: { bg: "#fce7f3", color: "#9d174d", border: "#9d174d" },
  hold:     { bg: "#fff3e0", color: "#a05c00", border: "#a05c00" },
  pending:  { bg: "#f5f3ff", color: "#7c3aed", border: "#7c3aed" },
};

const FILTER_TABS = ["All", "Pending", "Mismatch", "New", "Missing", "Accepted", "Rejected", "Hold"];

function Val({ value, isDiff }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 5,
      background: isDiff ? "#fff3e0" : "transparent",
      color: isDiff ? "#a05c00" : "inherit",
      fontWeight: isDiff ? 700 : "inherit",
      border: isDiff ? "1px solid #fbbf24" : "none",
      fontSize: 13,
    }}>
      {value || <span style={{ color: "#bbb", fontStyle: "italic" }}>—</span>}
    </span>
  );
}

export default function Reconciliation() {
  const [step, setStep]       = useState("upload"); // upload | review | done
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [rows, setRows]       = useState(INITIAL_ROWS);
  const [filter, setFilter]   = useState("All");
  const [expanded, setExpanded] = useState({});
  const fileRef = useRef();

  const updateRow = (policyNo, patch) =>
    setRows(prev => prev.map(r => r.policyNo === policyNo ? { ...r, ...patch } : r));

  const toggleExpand = (policyNo) =>
    setExpanded(prev => ({ ...prev, [policyNo]: !prev[policyNo] }));

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = () => {
    setRows(INITIAL_ROWS.map(r => ({ ...r, action: "pending", narration: "" })));
    setStep("review");
  };

  const handleFinalize = () => setStep("done");

  const counts = {
    total:    rows.length,
    pending:  rows.filter(r => r.action === "pending").length,
    accepted: rows.filter(r => r.action === "accepted").length,
    rejected: rows.filter(r => r.action === "rejected").length,
    hold:     rows.filter(r => r.action === "hold").length,
    match:    rows.filter(r => r.recordType === "match").length,
    mismatch: rows.filter(r => r.recordType === "mismatch").length,
    new:      rows.filter(r => r.recordType === "new").length,
    missing:  rows.filter(r => r.recordType === "missing").length,
  };

  const filtered = rows.filter(r => {
    if (filter === "All")      return true;
    if (filter === "Pending")  return r.action === "pending";
    if (filter === "Accepted") return r.action === "accepted";
    if (filter === "Rejected") return r.action === "rejected";
    if (filter === "Hold")     return r.action === "hold";
    if (filter === "Mismatch") return r.recordType === "mismatch";
    if (filter === "New")      return r.recordType === "new";
    if (filter === "Missing")  return r.recordType === "missing";
    return true;
  });

  // ── Upload step ─────────────────────────────────────────────────────────────
  if (step === "upload") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-row">
            <div className="page-icon"><DocumentIcon /></div>
            <div>
              <div className="page-title">Reconciliation</div>
              <div className="page-subtitle">Upload external data and reconcile with database records</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Step 1 — Upload External Data</div>
            <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <span>
                Upload the file received from the external source (insurance company, aggregator, or IC portal).
                Supported formats: CSV, XLSX, XLS.
              </span>
              <a
                href="/reconciliation_sample.csv"
                download="reconciliation_sample.csv"
                style={{ whiteSpace: "nowrap", fontSize: 12.5, fontWeight: 600, color: "var(--brand)", textDecoration: "none", border: "1px solid var(--brand)", borderRadius: 6, padding: "4px 12px", flexShrink: 0 }}
              >
                ⬇ Download Sample CSV
              </a>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "var(--brand)" : file ? "#2d7d46" : "var(--border)"}`,
                borderRadius: 14,
                background: dragging ? "#f5f3ff" : file ? "#e6f4ea" : "var(--surface-2)",
                padding: "48px 32px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all .18s",
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={e => handleFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#2d7d46" }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <UploadIcon style={{ width: 40, height: 40, color: "var(--brand)", marginBottom: 12 }} />
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                    Drag & drop your file here
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-3)" }}>
                    or click to browse — CSV, XLSX, XLS supported
                  </div>
                </>
              )}
            </div>

            {/* Campaign */}
            <div style={{ marginTop: 24 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 6 }}>
                Campaign
              </label>
              <select className="field-select" style={{ width: "100%" }}>
                <option value="">All Campaigns</option>
                <option>Campaign 1</option>
                <option>Campaign OPD and DIGIT PAYMENT PROTECTION</option>
                <option>BPP Campaign</option>
                <option>Test Campaign</option>
                <option>SBI_STP_Campaign</option>
                <option>BPP Campaign_2026-2027</option>
                <option>Standalone campaign</option>
              </select>
            </div>

            <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                disabled={!file}
                onClick={handleImport}
                style={{ opacity: file ? 1 : 0.5 }}
              >
                Import & Compare →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Done step ────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-row">
            <div className="page-icon"><DocumentIcon /></div>
            <div>
              <div className="page-title">Reconciliation Complete</div>
              <div className="page-subtitle">Summary of reconciliation actions</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="card-body" style={{ textAlign: "center", padding: "40px 32px" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Reconciliation Saved</div>
            <div style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 32 }}>
              {file?.name} · {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 32 }}>
              {[
                { label: "Total Records", value: counts.total,    bg: "#f5f3ff", color: "#7c3aed" },
                { label: "Accepted",      value: counts.accepted, bg: "#e6f4ea", color: "#2d7d46" },
                { label: "Rejected",      value: counts.rejected, bg: "#fce7f3", color: "#9d174d" },
                { label: "On Hold",       value: counts.hold,     bg: "#fff3e0", color: "#a05c00" },
              ].map(k => (
                <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: "16px" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1628", marginTop: 4 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {counts.pending > 0 && (
              <div style={{ background: "#fff3e0", border: "1px solid #fbbf24", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#a05c00" }}>
                ⚠️ {counts.pending} record(s) still pending — review before closing.
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={() => { setStep("review"); }}>← Back to Review</button>
              <button className="btn btn-primary" onClick={() => { setStep("upload"); setFile(null); }}>New Reconciliation</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Review step ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><DocumentIcon /></div>
          <div>
            <div className="page-title">Reconciliation Review</div>
            <div className="page-subtitle">
              {file?.name} · Compare database entries with uploaded data
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setStep("upload")}>← Re-upload</button>
          <button
            className="btn btn-primary"
            onClick={handleFinalize}
          >
            Finalise Reconciliation
          </button>
        </div>
      </div>

      {/* KPI summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Records", value: counts.total,    bg: "#f5f3ff", color: "#7c3aed" },
          { label: "Pending",       value: counts.pending,  bg: "#ede9fe", color: "#6d28d9" },
          { label: "Mismatches",    value: counts.mismatch, bg: "#fff3e0", color: "#a05c00" },
          { label: "New Records",   value: counts.new,      bg: "#e0f4fb", color: "#0a7ea4" },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: "14px 18px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1a1628", marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Action summary pills */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { key: "accepted", label: `✓ Accepted: ${counts.accepted}`, ...ACTION_STYLE.accepted },
          { key: "rejected", label: `✗ Rejected: ${counts.rejected}`, ...ACTION_STYLE.rejected },
          { key: "hold",     label: `⏸ On Hold: ${counts.hold}`,       ...ACTION_STYLE.hold     },
          { key: "match",    label: `= Matched: ${counts.match}`,       bg: "#e6f4ea", color: "#2d7d46", border: "#2d7d46" },
        ].map(p => (
          <span key={p.key} style={{
            padding: "4px 14px", borderRadius: 99, fontSize: 12.5, fontWeight: 600,
            background: p.bg, color: p.color, border: `1px solid ${p.border}33`,
          }}>
            {p.label}
          </span>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {FILTER_TABS.map(t => (
          <button key={t} type="button" onClick={() => setFilter(t)}
            style={{
              padding: "6px 16px", borderRadius: 99, fontSize: 12.5, fontWeight: 600,
              border: "1.5px solid", cursor: "pointer", fontFamily: "inherit",
              borderColor: filter === t ? "var(--brand)" : "var(--border)",
              background: filter === t ? "var(--brand)" : "#fff",
              color: filter === t ? "#fff" : "var(--text-2)",
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Reconciliation cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 && (
          <div className="card">
            <div className="card-body" style={{ textAlign: "center", color: "var(--text-3)", padding: "40px" }}>
              No records in this filter.
            </div>
          </div>
        )}

        {filtered.map(row => {
          const badge = RECORD_BADGE[row.recordType];
          const actionStyle = ACTION_STYLE[row.action] ?? ACTION_STYLE.pending;
          const isOpen = expanded[row.policyNo] ?? (row.recordType !== "match");

          return (
            <div key={row.policyNo} className="card" style={{ border: `1.5px solid ${row.diffs.length > 0 || row.recordType !== "match" ? "#fbbf2444" : "var(--border)"}` }}>
              {/* Card header */}
              <div
                style={{ padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, borderBottom: isOpen ? "1px solid var(--border)" : "none" }}
                onClick={() => toggleExpand(row.policyNo)}
              >
                <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "monospace", color: "var(--brand)" }}>
                  {row.policyNo}
                </span>
                <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: badge.bg, color: badge.color }}>
                  {badge.label}
                </span>
                {row.diffs.length > 0 && (
                  <span style={{ fontSize: 12, color: "#a05c00" }}>
                    {row.diffs.length} field{row.diffs.length > 1 ? "s" : ""} differ
                  </span>
                )}
                <span style={{ marginLeft: "auto", padding: "2px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: actionStyle.bg, color: actionStyle.color, border: `1px solid ${actionStyle.border}33` }}>
                  {row.action.charAt(0).toUpperCase() + row.action.slice(1)}
                </span>
                <span style={{ fontSize: 16, color: "var(--text-3)", marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {isOpen && (
                <div style={{ padding: "0 20px 20px" }}>

                  {/* Side-by-side comparison */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16, marginBottom: 16 }}>

                    {/* DB column */}
                    <div style={{ background: "#f8f9ff", border: "1px solid #e0dff0", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ background: "#a855f7", color: "#fff", padding: "8px 14px", fontWeight: 700, fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}>
                        🗄️ Database Record
                      </div>
                      {row.db ? (
                        <table style={{ width: "100%", fontSize: 12.5, borderCollapse: "collapse" }}>
                          <tbody>
                            {COMPARE_FIELDS.map(f => {
                              const isDiff = row.diffs.includes(f.key);
                              const val = f.format ? f.format(row.db[f.key]) : (row.db[f.key] || "—");
                              return (
                                <tr key={f.key} style={{ borderBottom: "1px solid #e8e4f0" }}>
                                  <td style={{ padding: "7px 12px", color: "var(--text-3)", fontWeight: 600, width: "40%", whiteSpace: "nowrap" }}>{f.label}</td>
                                  <td style={{ padding: "7px 12px" }}><Val value={val} isDiff={isDiff} /></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: "20px 14px", color: "var(--text-3)", fontStyle: "italic", fontSize: 13 }}>
                          No matching record in database
                        </div>
                      )}
                    </div>

                    {/* External column */}
                    <div style={{ background: "#f0fdf4", border: "1px solid #d1fae5", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ background: "#0a7ea4", color: "#fff", padding: "8px 14px", fontWeight: 700, fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}>
                        📤 External Source
                      </div>
                      {row.ext ? (
                        <table style={{ width: "100%", fontSize: 12.5, borderCollapse: "collapse" }}>
                          <tbody>
                            {COMPARE_FIELDS.map(f => {
                              const isDiff = row.diffs.includes(f.key);
                              const val = f.format ? f.format(row.ext[f.key]) : (row.ext[f.key] || "—");
                              return (
                                <tr key={f.key} style={{ borderBottom: "1px solid #d1fae5" }}>
                                  <td style={{ padding: "7px 12px", color: "var(--text-3)", fontWeight: 600, width: "40%", whiteSpace: "nowrap" }}>{f.label}</td>
                                  <td style={{ padding: "7px 12px" }}><Val value={val} isDiff={isDiff} /></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: "20px 14px", color: "var(--text-3)", fontStyle: "italic", fontSize: 13 }}>
                          No matching record in uploaded file
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Narration */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 5 }}>
                      Narration / Remarks
                    </label>
                    <textarea
                      rows={2}
                      className="input"
                      style={{ width: "100%", resize: "vertical", fontSize: 13 }}
                      placeholder="Add a narration or reason for the action taken…"
                      value={row.narration}
                      onChange={e => updateRow(row.policyNo, { narration: e.target.value })}
                    />
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, color: "var(--text-3)", fontWeight: 600 }}>Action:</span>
                    {[
                      { key: "accepted", label: "✓ Accept",   style: ACTION_STYLE.accepted },
                      { key: "rejected", label: "✗ Reject",   style: ACTION_STYLE.rejected },
                      { key: "hold",     label: "⏸ Hold",     style: ACTION_STYLE.hold     },
                    ].map(btn => (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => updateRow(row.policyNo, { action: row.action === btn.key ? "pending" : btn.key })}
                        style={{
                          padding: "7px 20px", borderRadius: 7, fontSize: 13, fontWeight: 700,
                          cursor: "pointer", fontFamily: "inherit",
                          border: `1.5px solid ${btn.style.border}`,
                          background: row.action === btn.key ? btn.style.bg : "#fff",
                          color: row.action === btn.key ? btn.style.color : "var(--text-2)",
                          boxShadow: row.action === btn.key ? `0 0 0 3px ${btn.style.border}22` : "none",
                          transition: "all .12s",
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}

                    {row.recordType === "match" && row.action === "pending" && (
                      <span style={{ marginLeft: 8, fontSize: 12, color: "#2d7d46", fontStyle: "italic" }}>
                        ✓ Records match — no action required
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom finalise bar */}
      {filtered.length > 0 && (
        <div style={{
          position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid var(--border)",
          marginTop: 24, padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>
            {counts.pending} record{counts.pending !== 1 ? "s" : ""} still pending
          </span>
          <button className="btn btn-primary" onClick={handleFinalize}>
            Finalise Reconciliation →
          </button>
        </div>
      )}
    </div>
  );
}
