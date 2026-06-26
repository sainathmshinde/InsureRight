import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import {
  Table,
  PageHeader,
  StatusBadge,
  Button,
  EmptyState,
} from "../../components/UI";
import { AgentIcon } from "../../icons";
import { AGENTS } from "./agentData";

const MOCK = AGENTS.map((a) => ({
  id: a.id,
  name: a.name,
  mobile: a.mobile,
  email: a.email,
  // posLicense: a.posLicense,
  // broker:     a.assignedBroker,
  status: a.status,
}));

export default function AgentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");

  const filtered = MOCK.filter(
    (a) =>
      (a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.mobile.includes(search)) &&
      (statusFilter ? a.status === statusFilter : true),
  );
  const pg = usePagination(filtered, 10);
  const handle = (setter) => (v) => {
    setter(v);
    pg.reset();
  };

  const columns = [
    { key: "id", label: "#", style: { color: "var(--text-3)" } },
    { key: "name", label: "Name", style: { fontWeight: 500 } },
    { key: "mobile", label: "Mobile" },
    { key: "email", label: "Email", style: { color: "var(--blue)" } },
    // { key: 'posLicense', label: 'POS License', style: { fontFamily: 'monospace', fontSize: 12.5 } },
    // { key: 'broker',     label: 'Broker' },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          type="button"
          onClick={() => navigate(`/agent/${row.id}/edit`)}
          title="Edit"
          style={{
            background: "linear-gradient(135deg,#fb7185,#a855f7)",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            padding: "5px 6px",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            boxShadow: "0 2px 6px rgba(168,85,247,.30)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader icon={<AgentIcon />} title="Operators">
        <Button
          variant="secondary"
          onClick={() => navigate("/agent/commission")}
        >
          Commission Rules
        </Button>
        <Button onClick={() => navigate("/agent/create")}>+ Add Operator</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-end",
              marginBottom: 18,
              flexWrap: "wrap",
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
                style={{ width: "100%" }}
                placeholder="Search by name or mobile…"
                value={search}
                onChange={(e) => handle(setSearch)(e.target.value)}
              />
            </div>
            <div style={{ flex: "0 0 160px" }}>
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
                Status
              </label>
              <select
                className="field-select"
                style={{ width: "100%" }}
                value={statusFilter}
                onChange={(e) => handle(setStatus)(e.target.value)}
              >
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            {(search || statusFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handle(setSearch)("");
                    handle(setStatus)("");
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            stickyHeader
            empty={
              <EmptyState
                icon="👤"
                title="No operators found"
                subtitle="Try adjusting your filters"
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
