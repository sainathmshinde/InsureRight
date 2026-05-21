import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, KYCBadge, Button, EmptyState } from '../../components/UI'
import { CustomerIcon, EditIcon } from '../../icons'
import { useAuth } from '../../context/AuthContext'
import { useCustomers, INITIAL_CUSTOMERS } from '../../context/CustomerContext'
import { ASSOCIATIONS } from './orgAssocData'

const CAMPAIGNS = [
  { id: 1,  name: 'Campaign 1' },
  { id: 5,  name: 'Campaign OPD and DIGIT PAYMENT PROTECTION' },
  { id: 6,  name: 'BPP Campaign' },
  { id: 7,  name: 'Test Campaign' },
  { id: 8,  name: 'SBI_STP_Campaign' },
  { id: 11, name: 'BPP Campaign_2026-2027' },
  { id: 12, name: 'Standalone campaign' },
]

export default function CustomerList() {
  const navigate = useNavigate();
  const [searchParams]  = useSearchParams();
  const { user } = useAuth();
  const { customers } = useCustomers();
  const [search,          setSearch]          = useState("");
  const [kycFilter,       setKycFilter]       = useState("");
  const [campaignFilter,  setCampaignFilter]  = useState(searchParams.get('campaignId') ?? "");
  const [engagedFilter,   setEngagedFilter]   = useState(searchParams.get('engaged')    ?? "");

  const scopedData =
    user?.role === "agent"
      ? customers.filter((c) => c.agentId === user.id)
      : customers;

  const filtered = scopedData.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.mobile.includes(search)) return false
    if (kycFilter      && c.kyc !== kycFilter)                    return false
    if (campaignFilter && c.campaignId !== Number(campaignFilter)) return false
    if (engagedFilter  && String(c.engaged) !== engagedFilter)    return false
    return true
  });
  const pg = usePagination(filtered, 10);
  const handle = (setter) => (v) => {
    setter(v);
    pg.reset();
  };

  const columns = [
    { key: 'id',       label: '#',        style: { color: 'var(--text-3)' } },
    { key: 'name',     label: 'Name',     style: { fontWeight: 500 } },
    { key: 'mobile',   label: 'Mobile' },
    { key: 'email',    label: 'Email',    style: { color: 'var(--blue)' } },
    { key: 'gender',   label: 'Gender' },
    { key: 'dob',      label: 'DOB' },
    { key: 'campaign', label: 'Campaign',
      render: row => row.campaignName
        ? <span style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{row.campaignName}</span>
        : <span style={{ color: 'var(--text-3)' }}>—</span>
    },
    { key: 'engaged', label: 'Engaged',
      render: row => row.engaged
        ? <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>Engaged</span>
        : <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: '#fffbeb', color: '#b45309' }}>Not Engaged</span>
    },
    { key: 'association', label: 'Association',
      render: row => {
        const assoc = ASSOCIATIONS.find(a => a.id === row.associationId)
        return assoc
          ? <span style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{assoc.name}</span>
          : <span style={{ color: 'var(--text-3)' }}>—</span>
      }
    },
    { key: 'kyc',      label: 'KYC',      render: row => row.kyc === 'Pending'
        ? <button style={S.pendingBtn} onClick={() => navigate(`/customer/${row.id}/kyc`)}>⏳ Pending</button>
        : <KYCBadge status={row.kyc} /> },
    { key: 'policies', label: 'Policies',
      render: row => (
        <span >
          {row.policies} {row.policies === 1 ? 'policy' : 'policies'}
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
          <button
            title="Edit"
            onClick={() => navigate(`/customer/${row.id}/edit`)}
            style={S.editIconBtn}
          >
            <EditIcon size={14} color="#fff" />
          </button>
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
          <div className="filter-bar" style={{ alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={S.filterLabel}>Search</label>
              <input
                className="field-input filter-search"
                placeholder="Search by name or mobile…"
                value={search}
                onChange={(e) => handle(setSearch)(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={S.filterLabel}>Campaign</label>
              <select
                className="field-select"
                style={{ width: 200 }}
                value={campaignFilter}
                onChange={(e) => { handle(setCampaignFilter)(e.target.value); handle(setEngagedFilter)("") }}
              >
                <option value="">All Campaigns</option>
                {CAMPAIGNS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={S.filterLabel}>Engagement</label>
              <select
                className="field-select"
                style={{ width: 150 }}
                value={engagedFilter}
                onChange={(e) => handle(setEngagedFilter)(e.target.value)}
                disabled={!campaignFilter}
              >
                <option value="">All Engagement</option>
                <option value="true">Engaged</option>
                <option value="false">Not Engaged</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={S.filterLabel}>KYC Status</label>
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
            </div>
            {(search || kycFilter || campaignFilter || engagedFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handle(setSearch)("");
                  handle(setKycFilter)("");
                  handle(setCampaignFilter)("");
                  handle(setEngagedFilter)("");
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
  editIconBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    boxShadow: '0 2px 6px rgba(168,85,247,0.35)',
    flexShrink: 0,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
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
