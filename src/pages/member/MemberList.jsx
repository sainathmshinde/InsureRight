import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, KYCBadge, Button, EmptyState } from '../../components/UI'
import { MemberIcon, EditIcon, ViewIcon, UploadIcon, SearchIcon } from '../../icons'
import { useAuth } from '../../context/AuthContext'
import { useMembers, INITIAL_MEMBERS } from '../../context/MemberContext'
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

export default function MemberList() {
  const navigate = useNavigate();
  const [searchParams]  = useSearchParams();
  const { user } = useAuth();
  const { members } = useMembers();
  const [search,          setSearch]          = useState("");
  const [kycFilter,       setKycFilter]       = useState("");
  const [campaignFilter,  setCampaignFilter]  = useState(searchParams.get('campaignId') ?? "");
  const [engagedFilter,   setEngagedFilter]   = useState(searchParams.get('engaged')    ?? "");

  const scopedData =
    user?.role === "agent"
      ? members.filter((c) => c.agentId === user.id)
      : members;

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
    { key: 'name',     label: 'Name',     style: { fontWeight: 500 } },
    { key: 'mobile',   label: 'Mobile' },
    { key: 'email',    label: 'Email',    style: { color: 'var(--blue)' } },
    { key: 'gender',   label: 'Gender' },
    { key: 'dob',      label: 'DOB' },
    { key: 'association', label: 'Association',
      render: row => {
        const assoc = ASSOCIATIONS.find(a => a.id === row.associationId)
        return assoc
          ? <span title={assoc.name} style={S.truncate}>{assoc.name}</span>
          : <span style={{ color: 'var(--text-3)' }}>—</span>
      }
    },
    { key: 'engaged', label: 'Engaged',
      render: row => row.engaged
        ? <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>Engaged</span>
        : <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: '#fffbeb', color: '#b45309' }}>Not Engaged</span>
    },
    { key: 'kyc',      label: 'KYC',      render: row => row.kyc === 'Pending'
        ? <button style={S.pendingBtn} onClick={() => navigate(`/member/${row.id}/kyc`)}>⏳ Pending</button>
        : <KYCBadge status={row.kyc} /> },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Button
            variant="primary"
            size="sm"
            style={S.buyPolicyBtn}
            onClick={() => navigate(`/policy/buy?memberId=${row.id}`)}
          >
            Buy Policy
          </Button>
          <button
            title="View 360°"
            onClick={() => navigate(`/member/${row.id}/360`)}
            style={S.iconBtn}
          >
            <ViewIcon size={14} color="var(--text-2)" />
          </button>
          <button
            title="Edit"
            onClick={() => navigate(`/member/${row.id}/edit`)}
            style={S.iconBtn}
          >
            <EditIcon size={14} color="var(--text-2)" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={<MemberIcon />}
        title={user?.role === "agent" ? "My Members" : "Members"}
        subtitle="View and manage all members across campaigns and associations"
      >
        <Button variant="ghost" icon={<UploadIcon size={16} />} onClick={() => {}}>
          Export
        </Button>
        <Button onClick={() => navigate("/member/create")}>
          + Add Member
        </Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar" style={{ alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={S.filterLabel}>Search</label>
              <div style={{ position: 'relative' }}>
                <span style={S.searchIcon}>
                  <SearchIcon size={15} color="var(--text-3)" />
                </span>
                <input
                  className="field-input filter-search"
                  style={{ paddingLeft: 34 }}
                  placeholder="Search by name, mobile or email…"
                  value={search}
                  onChange={(e) => handle(setSearch)(e.target.value)}
                />
              </div>
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
            stickyHeader
            empty={
              <EmptyState
                icon="👤"
                title="No members found"
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
  buyPolicyBtn: {
    fontSize: 9,
    padding: 0,
    width: 68,
    height: 30,
    justifyContent: 'center',
  },
  iconBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    border: '1px solid var(--border)',
    cursor: 'pointer',
    background: '#fff',
    flexShrink: 0,
  },
  searchIcon: {
    position: 'absolute',
    left: 11,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    pointerEvents: 'none',
  },
  truncate: {
    display: 'inline-block',
    maxWidth: 160,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'bottom',
    fontSize: 13,
    color: 'var(--text-2)',
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

export { INITIAL_MEMBERS as MEMBER_MOCK };
