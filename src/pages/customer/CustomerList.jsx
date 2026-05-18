import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import {
  Table,
  PageHeader,
  KYCBadge,
  Button,
  EmptyState,
} from "../../components/UI";
import { CustomerIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";
import { useCustomers, INITIAL_CUSTOMERS } from "../../context/CustomerContext";

export default function CustomerList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers } = useCustomers();
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("");

  const scopedData =
    user?.role === "agent"
      ? customers.filter((c) => c.agentId === user.id)
      : customers;

  const filtered = scopedData.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search)) &&
      (kycFilter ? c.kyc === kycFilter : true),
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
    { key: "gender", label: "Gender" },
    { key: "dob", label: "DOB" },
    {
      key: "kyc",
      label: "KYC",
      render: (row) =>
        row.kyc === "Pending" ? (
          <button
            style={S.pendingBtn}
            onClick={() => navigate(`/customer/${row.id}/kyc`)}
          >
            ⏳ Pending
          </button>
        ) : (
          <KYCBadge status={row.kyc} />
        ),
    },
    {
      key: "policies",
      label: "Policies",
      render: (row) => (
        <span>
          {row.policies} {row.policies === 1 ? "policy" : "policies"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/policy/buy?customerId=${row.id}`)}
          >
            Buy Policy
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/customer/${row.id}/360`)}
          >
            360°
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/customer/${row.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<CustomerIcon />}
        title={user?.role === "agent" ? "My Customers" : "Customers"}
        subtitle={`${scopedData.length} customers`}
      >
        <Button onClick={() => navigate("/customer/create")}>
          + Add Customer
        </Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input
              className="field-input filter-search"
              placeholder="Search by name or mobile…"
              value={search}
              onChange={(e) => handle(setSearch)(e.target.value)}
            />
            <select
              className="field-select"
              style={{ width: 160 }}
              value={kycFilter}
              onChange={(e) => handle(setKycFilter)(e.target.value)}
            >
              <option value="">All KYC Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
            {(search || kycFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handle(setSearch)("");
                  handle(setKycFilter)("");
                }}
              >
                Clear
              </Button>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            empty={
              <EmptyState
                icon="👤"
                title="No customers found"
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

const S = {
  pendingBtn: {
    background: "#fffbeb",
    border: "1.5px solid #fcd34d",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    color: "#92400e",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    transition: "background .15s",
  },
};

export { INITIAL_CUSTOMERS as CUSTOMER_MOCK };
