import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { CampaignIcon, CalendarIcon } from '../../icons'

const MOCK = [
  { id: 1, name: 'Summer Health Drive 2025',     type: 'Promotional', startDate: '2025-06-01', endDate: '2025-06-30', targetType: 'Customer', channels: ['SMS', 'Email'],                           status: 'Active',   leads: 340, conversions: 24 },
  { id: 2, name: 'Agent Incentive Q2',           type: 'Incentive',   startDate: '2025-04-01', endDate: '2025-06-30', targetType: 'Agent',    channels: ['WhatsApp', 'Email'],                      status: 'Active',   leads: 120, conversions: 18 },
  { id: 3, name: 'Motor Renewal Reminder',       type: 'Renewal',     startDate: '2025-03-15', endDate: '2025-04-15', targetType: 'Customer', channels: ['SMS', 'WhatsApp'],                        status: 'Inactive', leads: 580, conversions: 72 },
  { id: 4, name: 'Life Insurance Awareness',     type: 'Awareness',   startDate: '2025-05-01', endDate: '2025-05-31', targetType: 'Customer', channels: ['Email', 'App Notification'],              status: 'Active',   leads: 210, conversions: 9  },
  { id: 5, name: 'Family Health Bundle Offer',   type: 'Promotional', startDate: '2025-07-01', endDate: '2025-07-31', targetType: 'Customer', channels: ['SMS', 'WhatsApp', 'Email'],               status: 'Active',   leads: 0,   conversions: 0  },
  { id: 6, name: 'Star Health Exclusive Discount',type:'Promotional',  startDate: '2025-02-01', endDate: '2025-02-28', targetType: 'Customer', channels: ['SMS'],                                    status: 'Inactive', leads: 460, conversions: 38 },
  { id: 7, name: 'New Agent Onboarding Push',    type: 'Onboarding',  startDate: '2025-01-15', endDate: '2025-02-15', targetType: 'Agent',    channels: ['WhatsApp', 'Email'],                      status: 'Inactive', leads: 95,  conversions: 14 },
  { id: 8, name: 'Monsoon Health Campaign',      type: 'Seasonal',    startDate: '2025-07-15', endDate: '2025-09-15', targetType: 'Customer', channels: ['SMS', 'WhatsApp', 'Email', 'App Notification'], status: 'Active', leads: 0, conversions: 0 },
]

const TYPE_COLORS = { Promotional: 'blue', Incentive: 'purple', Renewal: 'amber', Awareness: 'green', Onboarding: 'blue', Seasonal: 'blue' }

export default function CampaignList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = MOCK.filter(c => {
    const q = search.toLowerCase()
    return (
      (c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)) &&
      (typeFilter   ? c.type   === typeFilter   : true) &&
      (statusFilter ? c.status === statusFilter : true)
    )
  })
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',          label: '#',            style: { color: 'var(--text-3)' } },
    { key: 'name',        label: 'Campaign Name',style: { fontWeight: 500, maxWidth: 220 } },
    { key: 'type',        label: 'Type',
      render: row => <span className={`badge badge-${TYPE_COLORS[row.type] ?? 'purple'}`}>{row.type}</span> },
    { key: 'targetType',  label: 'Target',
      render: row => <span className={`badge ${row.targetType === 'Agent' ? 'badge-purple' : 'badge-blue'}`}>{row.targetType}</span> },
    { key: 'channels',    label: 'Channels',
      render: row => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {row.channels.map(ch => <span key={ch} className="badge badge-amber" style={{ fontSize: 11 }}>{ch}</span>)}
        </div>
      )},
    { key: 'period',      label: 'Period',
      render: row => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
          <CalendarIcon size={13} color="var(--text-3)" />
          {row.startDate} → {row.endDate}
        </div>
      )},
    { key: 'leads',       label: 'Leads',       style: { fontWeight: 600 } },
    { key: 'conversions', label: 'Conversions',
      render: row => (
        <span style={{ fontWeight: 600, color: row.conversions > 0 ? 'var(--green)' : 'var(--text-3)' }}>
          {row.conversions}
        </span>
      )},
    { key: 'status',      label: 'Status',      render: row => <StatusBadge status={row.status} /> },
    { key: 'actions',     label: 'Actions',
      render: row => (
        <Button variant="secondary" size="sm" onClick={() => navigate(`/campaign/${row.id}/edit`)}>Edit</Button>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<CampaignIcon />} title="Campaigns" subtitle={`${MOCK.length} campaigns registered`}>
        <Button onClick={() => navigate('/campaign/create')}>+ Add Campaign</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by name or type…"
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 170 }} value={typeFilter} onChange={e => handle(setType)(e.target.value)}>
              <option value="">All Types</option>
              {['Promotional','Incentive','Renewal','Awareness','Onboarding','Seasonal'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="field-select" style={{ width: 150 }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
              <option value="">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            {(search || typeFilter || statusFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setType)(''); handle(setStatus)('') }}>Clear</Button>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            empty={<EmptyState icon="📢" title="No campaigns found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
