import { useState } from "react";
import { PageHeader, Button, EmptyState } from "../../components/UI";
import { RefundIcon } from "../../icons";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import { useRefunds } from "../../context/RefundContext";

const STATUS_COLORS = {
  Pending:   { bg: "#fffbeb", color: "#92400e", border: "#fcd34d" },
  Approved:  { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  Processed: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  Rejected:  { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
};

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] ?? STATUS_COLORS.Pending;
  return (
    <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

export default function RefundList() {
  const { refunds } = useRefunds();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = refunds.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.proposalId.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.mobile.includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pg = usePagination(filtered, 10);
  const handle = (setter) => (v) => { setter(v); pg.reset(); };

  const stickyTh = { position: "sticky", top: 0, zIndex: 2, background: "var(--card-bg, #fff)", borderBottom: "2px solid var(--border)" };

  return (
    <div>
      <PageHeader icon={<RefundIcon />} title="Refunds" />

      <div className="card">
        <div className="card-body">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label style={labelStyle}>Search</label>
              <input
                className="field-input filter-search"
                style={{ width: "100%" }}
                placeholder="Search by Order ID, name or mobile..."
                value={search}
                onChange={(e) => handle(setSearch)(e.target.value)}
              />
            </div>
            <div style={{ flex: "0 0 160px" }}>
              <label style={labelStyle}>Status</label>
              <select className="field-select" style={{ width: "100%" }} value={statusFilter} onChange={(e) => handle(setStatusFilter)(e.target.value)}>
                <option value="">All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Processed</option>
                <option>Rejected</option>
              </select>
            </div>
            {(search || statusFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(""); handle(setStatusFilter)(""); }}>Clear</Button>
              </div>
            )}
          </div>

          <div className="table-wrap" style={{ maxHeight: 500, overflowY: "auto" }}>
            <table style={{ fontSize: 13, borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={stickyTh}>Order ID</th>
                  <th style={stickyTh}>Customer</th>
                  <th style={stickyTh}>Mobile</th>
                  <th style={stickyTh}>Product</th>
                  <th style={stickyTh}>IC</th>
                  <th style={stickyTh}>System Amount</th>
                  <th style={stickyTh}>Uploaded Amount</th>
                  <th style={stickyTh}>Refund Amount</th>
                  <th style={stickyTh}>Pay Type</th>
                  <th style={stickyTh}>Request Date</th>
                  <th style={stickyTh}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pg.slice.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ padding: 0 }}>
                      <EmptyState icon="💸" title="No refund records found" subtitle="Try adjusting your filters" />
                    </td>
                  </tr>
                ) : (
                  pg.slice.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: "monospace", fontSize: 13, color: "#7c3aed", fontWeight: 600 }}>{r.proposalId}</td>
                      <td style={{ fontWeight: 500 }}>{r.customerName}</td>
                      <td style={{ color: "#64748b" }}>{r.mobile}</td>
                      <td style={{ fontSize: 12.5, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.product}</td>
                      <td style={{ color: "#64748b", fontSize: 13 }}>{r.icName}</td>
                      <td style={{ fontWeight: 600 }}>{fmt(r.systemAmount)}</td>
                      <td style={{ fontWeight: 600 }}>{fmt(r.uploadedAmount)}</td>
                      <td style={{ fontWeight: 700, color: "#dc2626" }}>{fmt(r.refundAmount)}</td>
                      <td>
                        <span style={{ fontSize: 12.5, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: r.paymentType === "Cheque" ? "#fef3c7" : "#dbeafe", color: r.paymentType === "Cheque" ? "#92400e" : "#1d4ed8" }}>
                          {r.paymentType}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>{r.requestDate}</td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 11.5,
  fontWeight: 700,
  color: "#64748b",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: ".4px",
};
