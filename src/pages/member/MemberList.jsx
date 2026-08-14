import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, KYCBadge, Button, EmptyState, RowActionButton } from '../../components/UI'
import { MemberIcon, EditIcon, ViewIcon, CartIcon, UploadIcon, SearchIcon, DeleteIcon } from '../../icons'
import { useAuth } from '../../context/AuthContext'
import { useMembers, INITIAL_MEMBERS } from '../../context/MemberContext'
import { ASSOCIATIONS } from './orgAssocData'
import { formatDate } from '../../utils/date'
import { getActivePromoCampaigns } from '../campaign/campaignStore'
import { useToast } from '../../context/ToastContext'

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
  const toast = useToast();
  const [searchParams]  = useSearchParams();
  const { user } = useAuth();
  const { members, deleteMember } = useMembers();
  const [search,          setSearch]          = useState("");
  const [kycFilter,       setKycFilter]       = useState("");
  const [campaignFilter,  setCampaignFilter]  = useState(searchParams.get('campaignId') ?? "");
  const [engagedFilter,   setEngagedFilter]   = useState(searchParams.get('engaged')    ?? "");
  const [campaignPrompt,  setCampaignPrompt]  = useState(null); // { member, campaign }

  const handleBuyPolicy = (member) => {
    const [campaign] = getActivePromoCampaigns(member.associationId);
    if (campaign) setCampaignPrompt({ member, campaign });
    else navigate(`/policy/buy?memberId=${member.id}`);
  };

  const handleDelete = async (member) => {
    if (await toast.confirm(`Delete member "${member.name}"? This cannot be undone.`)) {
      deleteMember(member.id);
    }
  };

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
    { key: 'dob',      label: 'DOB',      render: row => formatDate(row.dob) },
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
          <RowActionButton title="Buy Policy" icon={CartIcon} onClick={() => handleBuyPolicy(row)} />
          <RowActionButton title="View 360°" icon={ViewIcon} onClick={() => navigate(`/member/${row.id}/360`)} />
          <RowActionButton title="Edit" icon={EditIcon} onClick={() => navigate(`/member/${row.id}/edit`)} />
          <RowActionButton title="Delete" icon={DeleteIcon} variant="delete" onClick={() => handleDelete(row)} />
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

      {campaignPrompt && (
        <>
          <div onClick={() => setCampaignPrompt(null)} style={S.overlay} />
          <div style={S.promptCard}>
            <div style={S.promptHeader}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1628' }}>
                🎉 {campaignPrompt.member.name} qualifies for a campaign offer
              </span>
              <button onClick={() => setCampaignPrompt(null)} style={S.closeBtn}>×</button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div
                onClick={() => navigate(`/policy/buy?memberId=${campaignPrompt.member.id}&campaignId=${campaignPrompt.campaign.id}`)}
                style={S.bannerFrame}
              >
                <img
                  src={campaignPrompt.campaign.campaignImage}
                  alt={campaignPrompt.campaign.name}
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: 13, color: '#6b7fa0', textAlign: 'center', lineHeight: 1.5 }}>
                {campaignPrompt.member.name} is eligible for <strong>{campaignPrompt.campaign.name}</strong> — tap the banner to buy with this offer applied.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate(`/policy/buy?memberId=${campaignPrompt.member.id}`)}
                >
                  Continue without offer
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/policy/buy?memberId=${campaignPrompt.member.id}&campaignId=${campaignPrompt.campaign.id}`)}
                >
                  View Offer &amp; Buy →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000,
  },
  promptCard: {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    background: '#fff', borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,.25)',
    width: '90%', maxWidth: 560, zIndex: 1001, overflow: 'hidden',
  },
  promptHeader: {
    padding: '18px 22px', borderBottom: '1.5px solid #f0edf8',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
  },
  closeBtn: {
    width: 30, height: 30, borderRadius: 8, border: '1.5px solid var(--border)',
    background: '#faf9fc', cursor: 'pointer', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-2)', flexShrink: 0,
  },
  bannerFrame: {
    width: '100%', cursor: 'pointer', borderRadius: 12, overflow: 'hidden',
    border: '1.5px solid #c7d2fe', boxShadow: '0 4px 20px rgba(79,70,229,.14)',
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
