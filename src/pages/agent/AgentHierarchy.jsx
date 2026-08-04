import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Button, Table, EmptyState, RowActionButton } from "../../components/UI";
import { GroupIcon, SearchIcon, EditIcon, DeleteIcon } from "../../icons";
import {
  hierarchyRules, deleteHierarchyRule,
  DESIGNATIONS, DESIG_LABEL, EMP_MAP,
} from "./agentHierarchyData";

const empLabel = (emp) => emp ? `${emp.name} (${DESIG_LABEL[emp.designation] ?? emp.designation})` : "";

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
    return {
      ...r,
      _reportingName: reportingEmp?.name ?? "",
      _reportingDesig: reportingEmp?.designation ?? "",
      _reporteeNames: reporteeEmps.map(e => e.name),
      _reporteeDesigs: reporteeEmps.map(e => e.designation),
    };
  });

  // 1. Filter
  const filtered = allRows.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      const hit = r._reportingName.toLowerCase().includes(q)
        || r._reporteeNames.some(n => n.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (reportingFilter && r._reportingDesig !== reportingFilter) return false;
    if (reporteeFilter  && !r._reporteeDesigs.includes(reporteeFilter)) return false;
    return true;
  });

  // 2. Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        let av = sortKey === "reportingDesig" ? DESIG_LABEL[a._reportingDesig]
               : sortKey === "reportingEmp"   ? a._reportingName
               : sortKey === "reporteeCount"  ? a.reporteeEmpIds.length
               : "";
        let bv = sortKey === "reportingDesig" ? DESIG_LABEL[b._reportingDesig]
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
        return emp
          ? <div style={{ fontWeight: 600, fontSize: 14 }}>{empLabel(emp)}</div>
          : <span style={{ fontSize: 13, color: "var(--text-3)" }}>—</span>;
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
      label: "Reportee",
      render: (row) => {
        const reportees = row.reporteeEmpIds.map(id => EMP_MAP[id]).filter(Boolean);
        return reportees.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {reportees.map(emp => (
              <span key={emp.id} style={{
                fontSize: 12, padding: "2px 9px", borderRadius: 6, fontWeight: 500,
                background: "var(--bg-subtle, #f1f5f9)",
                color: "var(--text-2)", border: "1px solid var(--border)",
              }}>
                {empLabel(emp)}
              </span>
            ))}
          </div>
        ) : <span style={{ fontSize: 13, color: "var(--text-3)" }}>—</span>;
      },
    },
    {
      key: "actions",
      label: "Actions",
      headerStyle: { textAlign: "right" },
      style: { textAlign: "right", whiteSpace: "nowrap" },
      render: (row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <RowActionButton title="Edit" icon={EditIcon} onClick={() => navigate(`/agent/hierarchy/${row.id}/edit`)} />
          <RowActionButton title="Delete" icon={DeleteIcon} variant="delete" onClick={() => handleDelete(row.id)} />
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
