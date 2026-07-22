import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Table, EmptyState } from "../../components/UI";
import { GroupIcon, SearchIcon } from "../../icons";
import {
  hierarchyRules, deleteHierarchyRule,
  DESIGNATIONS, DESIG_META, DESIG_LABEL, EMP_MAP,
} from "./agentHierarchyData";

function DesigBadge({ value }) {
  const m = DESIG_META[value];
  if (!m) return null;
  return (
    <span style={{
      display: "inline-block", padding: "3px 11px", borderRadius: 99,
      fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap",
      background: m.bg, color: m.color, border: `1.5px solid ${m.border}`,
    }}>
      {DESIG_LABEL[value]}
    </span>
  );
}

function SortTh({ label, colKey, sortKey, sortDir, onSort }) {
  const active = sortKey === colKey;
  return (
    <button
      type="button"
      onClick={() => onSort(colKey)}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: "inherit", fontWeight: "inherit", fontFamily: "inherit",
        color: active ? "var(--brand)" : "inherit",
      }}
    >
      {label}
      <span style={{ fontSize: 10, opacity: active ? 1 : 0.4 }}>
        {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}

const S = {
  filterLabel: {
    fontSize: 11.5, fontWeight: 700, color: "#64748b",
    textTransform: "uppercase", letterSpacing: ".4px",
  },
  searchIcon: {
    position: "absolute", left: 11, top: "50%",
    transform: "translateY(-50%)", display: "flex", pointerEvents: "none",
  },
};

export default function AgentHierarchy() {
  const navigate = useNavigate();
  const [tick, setTick]                 = useState(0);
  const [search, setSearch]             = useState("");
  const [reportingFilter, setReportingFilter] = useState("");
  const [reporteeFilter,  setReporteeFilter]  = useState("");
  const [sortKey, setSortKey]           = useState("");
  const [sortDir, setSortDir]           = useState("asc");

  const handleDelete = (id) => {
    deleteHierarchyRule(id);
    setTick(t => t + 1);
  };

  // Build enriched rows for filtering/sorting
  const allRows = hierarchyRules.map((r) => {
    const reportingEmp = EMP_MAP[r.reportingEmpId];
    const reporteeEmps = r.reporteeEmpIds.map(id => EMP_MAP[id]).filter(Boolean);
    return { ...r, _reportingName: reportingEmp?.name ?? "", _reporteeNames: reporteeEmps.map(e => e.name) };
  });

  // 1. Filter
  const filtered = allRows.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      const hit = r._reportingName.toLowerCase().includes(q)
        || r._reporteeNames.some(n => n.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (reportingFilter && r.reportingDesig !== reportingFilter) return false;
    if (reporteeFilter  && r.reporteeDesig  !== reporteeFilter)  return false;
    return true;
  });

  // 2. Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        let av = sortKey === "reportingDesig" ? DESIG_LABEL[a.reportingDesig]
               : sortKey === "reporteeDesig"  ? DESIG_LABEL[a.reporteeDesig]
               : sortKey === "reportingEmp"   ? a._reportingName
               : sortKey === "reporteeCount"  ? a.reporteeEmpIds.length
               : "";
        let bv = sortKey === "reportingDesig" ? DESIG_LABEL[b.reportingDesig]
               : sortKey === "reporteeDesig"  ? DESIG_LABEL[b.reporteeDesig]
               : sortKey === "reportingEmp"   ? b._reportingName
               : sortKey === "reporteeCount"  ? b.reporteeEmpIds.length
               : "";
        const cmp = typeof av === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  const rows = sorted.map((r, i) => ({ ...r, _idx: i + 1 }));

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const hasFilter = search || reportingFilter || reporteeFilter;
  const clearAll = () => { setSearch(""); setReportingFilter(""); setReporteeFilter(""); };

  const th = (label, key) => (
    <SortTh label={label} colKey={key} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
  );

  const columns = [
    {
      key: "_idx",
      label: "#",
      width: 40,
      style: { color: "var(--text-3)", fontWeight: 500 },
    },
    {
      key: "reporting",
      label: th("Reporting", "reportingEmp"),
      render: (row) => {
        const emp = EMP_MAP[row.reportingEmpId];
        return (
          <div>
            <DesigBadge value={row.reportingDesig} />
            {emp && <div style={{ marginTop: 5, fontWeight: 600, fontSize: 14 }}>{emp.name}</div>}
          </div>
        );
      },
    },
    {
      key: "arrow",
      label: "",
      width: 36,
      style: { textAlign: "center", color: "var(--text-3)", fontSize: 18 },
      render: () => "→",
    },
    {
      key: "reportee",
      label: th("Reportee", "reporteeDesig"),
      render: (row) => {
        const reportees = row.reporteeEmpIds.map(id => EMP_MAP[id]).filter(Boolean);
        return (
          <div>
            <DesigBadge value={row.reporteeDesig} />
            <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
              {reportees.length > 0 ? reportees.map(emp => (
                <span key={emp.id} style={{
                  fontSize: 12, padding: "2px 9px", borderRadius: 6, fontWeight: 500,
                  background: "var(--bg-subtle, #f1f5f9)",
                  color: "var(--text-2)", border: "1px solid var(--border)",
                }}>
                  {emp.name}
                </span>
              )) : <span style={{ fontSize: 13, color: "var(--text-3)" }}>—</span>}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      headerStyle: { textAlign: "right" },
      style: { textAlign: "right", whiteSpace: "nowrap" },
      render: (row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <button
            type="button"
            title="Edit"
            onClick={() => navigate(`/agent/hierarchy/${row.id}/edit`)}
            style={{
              background: "linear-gradient(180deg,#1565d8,#104ea6)",
              border: "none", borderRadius: 6, cursor: "pointer",
              padding: "5px 6px", color: "#fff",
              display: "inline-flex", alignItems: "center",
              boxShadow: "0 2px 6px rgba(21,101,216,.30)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
          <button
            type="button"
            title="Delete"
            onClick={() => handleDelete(row.id)}
            style={{
              background: "linear-gradient(180deg,#ef4444,#dc2626)",
              border: "none", borderRadius: 6, cursor: "pointer",
              padding: "5px 6px", color: "#fff",
              display: "inline-flex", alignItems: "center",
              boxShadow: "0 2px 6px rgba(220,38,38,.30)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<GroupIcon />}
        title="Employee Hierarchy"
        subtitle="Manage reporting relationships between employees by designation"
      >
        <Button onClick={() => navigate("/agent/hierarchy/new")}>
          + Add Hierarchy
        </Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">

          {/* Filter bar */}
          <div className="filter-bar" style={{ alignItems: "flex-end", marginBottom: 18 }}>

            {/* Search */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: "1 1 200px" }}>
              <label style={S.filterLabel}>Search</label>
              <div style={{ position: "relative" }}>
                <span style={S.searchIcon}>
                  <SearchIcon size={15} color="var(--text-3)" />
                </span>
                <input
                  className="field-input filter-search"
                  style={{ paddingLeft: 34, width: "100%" }}
                  placeholder="Employee name…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Reporting designation */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={S.filterLabel}>Reporting</label>
              <select
                className="field-select"
                style={{ width: 160 }}
                value={reportingFilter}
                onChange={e => setReportingFilter(e.target.value)}
              >
                <option value="">All</option>
                {DESIGNATIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Reportee designation */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={S.filterLabel}>Reportee</label>
              <select
                className="field-select"
                style={{ width: 160 }}
                value={reporteeFilter}
                onChange={e => setReporteeFilter(e.target.value)}
              >
                <option value="">All</option>
                {DESIGNATIONS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {hasFilter && (
              <Button variant="ghost" size="sm" onClick={clearAll}>Clear</Button>
            )}
          </div>

          {/* Result count when filtering */}
          {hasFilter && (
            <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 10 }}>
              {rows.length} rule{rows.length !== 1 ? "s" : ""} found
            </div>
          )}

          <Table
            columns={columns}
            rows={rows}
            rowKey="id"
            empty={
              <EmptyState
                icon="🏗"
                title={hasFilter ? "No hierarchy rules match your filters" : "No hierarchy defined"}
                subtitle={hasFilter ? "Try clearing the filters" : 'Click "+ Add Hierarchy" to define reporting relationships'}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
