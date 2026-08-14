import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import { Table, PageHeader, Button, EmptyState, RowActionButton } from "../../components/UI";
import { AgentIcon, UploadIcon, SearchIcon, EditIcon, DeleteIcon } from "../../icons";
import { OPERATORS } from "./agentData";
import { useToast } from "../../context/ToastContext";

const INITIAL_MOCK = OPERATORS.map((a) => ({
  id:        a.id,
  name:      a.name,
  mobile:    a.mobile,
  email:     a.email,
  agentType: a.agentType,
  status:    a.status,
}));

const AGENT_TYPE_META = {
  calling:            { label: "Calling Operator", color: "#1565d8", bg: "#e7f0fc" },
  "calling-operator": { label: "Calling Operator", color: "#1565d8", bg: "#e7f0fc" },
  sales:              { label: "Sales Operator",   color: "#15803d", bg: "#dcfce7" },
  "sales-operator":   { label: "Sales Operator",   color: "#15803d", bg: "#dcfce7" },
  "sales-manager":    { label: "Manager",          color: "#7c3aed", bg: "#f3e8ff" },
  manager:            { label: "Manager",          color: "#7c3aed", bg: "#f3e8ff" },
  "team-lead":        { label: "Team Lead",        color: "#b45309", bg: "#fffbeb" },
  leader:             { label: "Team Lead",        color: "#b45309", bg: "#fffbeb" },
};

// Designation filter groups — covers both old and new agentType key names
const DESIG_GROUPS = {
  Manager:            ["manager", "sales-manager"],
  "Team Lead":        ["team-lead", "leader"],
  "Sales Operator":   ["sales-operator", "sales"],
  "Calling Operator": ["calling-operator", "calling"],
};

const S = {
  filterLabel: {
    fontSize: 11.5, fontWeight: 700, color: "#64748b",
    textTransform: "uppercase", letterSpacing: ".4px",
  },
  searchIcon: {
    position: "absolute", left: 11, top: "50%",
    transform: "translateY(-50%)", display: "flex", pointerEvents: "none",
  },
  statusPill: (active) => ({
    display: "inline-block", padding: "2px 10px", borderRadius: 99,
    fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap",
    background: active ? "#dcfce7" : "#f1f5f9",
    color:      active ? "#15803d" : "#64748b",
    border: `1.5px solid ${active ? "#86efac" : "#e2e8f0"}`,
  }),
};

// Clickable sort header button rendered inside <th>
function SortTh({ label, colKey, sortKey, sortDir, onSort }) {
  const active = sortKey === colKey;
  return (
    <button
      type="button"
      onClick={() => onSort(colKey)}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: "inherit", fontWeight: "inherit",
        color: active ? "var(--brand)" : "inherit", fontFamily: "inherit",
      }}
    >
      {label}
      <span style={{ fontSize: 10, opacity: active ? 1 : 0.4 }}>
        {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}

export default function AgentList() {
  const navigate = useNavigate();
  const toast = useToast();

  const [rows,         setRows]         = useState(INITIAL_MOCK);
  const [search,       setSearch]       = useState("");
  const [desigFilter,  setDesigFilter]  = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey,      setSortKey]      = useState("name");
  const [sortDir,      setSortDir]      = useState("asc");

  const handleDelete = async (row) => {
    if (await toast.confirm(`Delete employee "${row.name}"? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  // 1. Filter
  const filtered = rows.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      const hit = a.name.toLowerCase().includes(q)
        || a.mobile.includes(search)
        || a.email.toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (desigFilter) {
      const group = DESIG_GROUPS[desigFilter] ?? [desigFilter];
      if (!group.includes(a.agentType)) return false;
    }
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    let av = sortKey === "agentType"
      ? (AGENT_TYPE_META[a.agentType]?.label ?? "")
      : (a[sortKey] ?? "");
    let bv = sortKey === "agentType"
      ? (AGENT_TYPE_META[b.agentType]?.label ?? "")
      : (b[sortKey] ?? "");
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  // 3. Paginate
  const pg = usePagination(sorted, 10);

  const handle = (setter) => (v) => { setter(v); pg.reset(); };

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    pg.reset();
  };

  const hasFilter = search || desigFilter || statusFilter;
  const clearAll = () => {
    handle(setSearch)("");
    handle(setDesigFilter)("");
    handle(setStatusFilter)("");
  };

  const th = (label, key) => (
    <SortTh label={label} colKey={key} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
  );

  const columns = [
    {
      key: "id",
      label: "#",
      width: 40,
      style: { color: "var(--text-3)", fontWeight: 500 },
    },
    {
      key: "name",
      label: th("Name", "name"),
      style: { fontWeight: 500 },
    },
    {
      key: "mobile",
      label: th("Mobile", "mobile"),
    },
    {
      key: "email",
      label: th("Email", "email"),
      style: { color: "var(--blue)" },
    },
    {
      key: "agentType",
      label: th("Designation", "agentType"),
      render: (row) => {
        const m = AGENT_TYPE_META[row.agentType];
        if (!m) return <span style={{ color: "var(--text-3)" }}>—</span>;
        return (
          <span style={{
            padding: "3px 10px", borderRadius: 99,
            fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap",
            background: m.bg, color: m.color,
          }}>
            {m.label}
          </span>
        );
      },
    },
    {
      key: "status",
      label: th("Status", "status"),
      render: (row) => (
        <span style={S.statusPill(row.status === "Active")}>
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      headerStyle: { textAlign: "right" },
      style: { textAlign: "right" },
      render: (row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <RowActionButton title="Edit" icon={EditIcon} onClick={() => navigate(`/agent/${row.id}/edit`)} />
          <RowActionButton title="Delete" icon={DeleteIcon} variant="delete" onClick={() => handleDelete(row)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<AgentIcon />}
        title="Employees"
        subtitle="View and manage all employees across your brokerage"
      >
        <Button variant="ghost" icon={<UploadIcon size={16} />} onClick={() => {}}>
          Export
        </Button>
        <Button variant="secondary" onClick={() => navigate("/agent/commission")}>
          Commission Rules
        </Button>
        <Button onClick={() => navigate("/agent/create")}>+ Add Employee</Button>
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
                  placeholder="Name, mobile or email…"
                  value={search}
                  onChange={(e) => handle(setSearch)(e.target.value)}
                />
              </div>
            </div>

            {/* Designation filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={S.filterLabel}>Designation</label>
              <select
                className="field-select"
                style={{ width: 170 }}
                value={desigFilter}
                onChange={(e) => handle(setDesigFilter)(e.target.value)}
              >
                <option value="">All Designations</option>
                {Object.keys(DESIG_GROUPS).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={S.filterLabel}>Status</label>
              <select
                className="field-select"
                style={{ width: 130 }}
                value={statusFilter}
                onChange={(e) => handle(setStatusFilter)(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Clear */}
            {hasFilter && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear
              </Button>
            )}
          </div>

          {/* Result count */}
          {hasFilter && (
            <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 10 }}>
              {sorted.length} employee{sorted.length !== 1 ? "s" : ""} found
            </div>
          )}

          <Table
            columns={columns}
            rows={pg.slice}
            rowKey="id"
            stickyHeader
            empty={
              <EmptyState
                icon="👤"
                title="No employees found"
                subtitle="Try adjusting your search or filters"
              />
            }
          />

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
