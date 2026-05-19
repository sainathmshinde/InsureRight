import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { CampaignIcon, CalendarIcon } from '../../icons'

const MOCK = [
  { id: 1,  name: 'Campaign 1',                                startDate: '2024-09-20', endDate: '2025-07-29', isCampaignOpen: true,  isActive: true, documentName: null,                     templateName: null,                  sentStatus: null },
  { id: 5,  name: 'Campaign OPD and DIGIT PAYMENT PROTECTION', startDate: '2025-01-31', endDate: '2025-03-31', isCampaignOpen: false, isActive: true, documentName: null,                     templateName: null,                  sentStatus: null },
  { id: 6,  name: 'BPP Campaign',                              startDate: '2025-02-19', endDate: '2025-03-24', isCampaignOpen: true,  isActive: true, documentName: 'cyber_opd_new_design.pdf', templateName: 'cyber_opd_new_design', sentStatus: null },
  { id: 7,  name: 'Test Campaign',                              startDate: '2025-08-03', endDate: '2025-08-29', isCampaignOpen: true,  isActive: true, documentName: null,                     templateName: null,                  sentStatus: 0    },
  { id: 8,  name: 'SBI_STP_Campaign',                          startDate: '2025-09-18', endDate: '2026-03-10', isCampaignOpen: true,  isActive: true, documentName: null,                     templateName: null,                  sentStatus: 0    },
  { id: 11, name: 'BPP Campaign_2026-2027',                    startDate: '2026-03-16', endDate: '2026-05-31', isCampaignOpen: true,  isActive: true, documentName: null,                     templateName: null,                  sentStatus: 0    },
  { id: 12, name: 'Standalone campaign',                        startDate: '2026-02-28', endDate: '2026-04-29', isCampaignOpen: true,  isActive: true, documentName: null,                     templateName: null,                  sentStatus: 0    },
]

function computeStatus(row) {
  if (!row.isActive) return 'Inactive'
  if (!row.isCampaignOpen) return 'Closed'
  const now = new Date(), start = new Date(row.startDate), end = new Date(row.endDate)
  if (now < start) return 'Scheduled'
  if (now > end)   return 'Completed'
  return 'Active'
}

const MOCK_WITH_STATUS = MOCK.map(r => ({ ...r, status: computeStatus(r) }))

export default function CampaignList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')
  const [openFilter, setOpen]     = useState('')

  const filtered = MOCK_WITH_STATUS.filter(c => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) &&
      (statusFilter ? c.status === statusFilter : true) &&
      (openFilter   ? String(c.isCampaignOpen) === openFilter : true)
    )
  })
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',   label: '#', style: { color: 'var(--text-3)', fontFamily: 'monospace' } },
    { key: 'name', label: 'Campaign Name', style: { fontWeight: 500, minWidth: 220 } },
    { key: 'period', label: 'Period',
      render: row => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
          <CalendarIcon size={13} color="var(--text-3)" />
          {row.startDate} → {row.endDate}
        </div>
      )},
    { key: 'isCampaignOpen', label: 'Open',
      render: row => (
        <span className={`badge ${row.isCampaignOpen ? 'badge-green' : 'badge-red'}`}>
          {row.isCampaignOpen ? 'Open' : 'Closed'}
        </span>
      )},
    { key: 'sentStatus', label: 'Sent',
      render: row => row.sentStatus === null
        ? <span style={{ color: 'var(--text-3)' }}>—</span>
        : <span className={`badge ${row.sentStatus ? 'badge-green' : 'badge-amber'}`}>{row.sentStatus ? 'Sent' : 'Pending'}</span>
    },
    { key: 'status', label: 'Status', render: row => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Actions',
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
            <input className="field-input filter-search" placeholder="Search by campaign name…"
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 160 }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
              <option value="">All Status</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Scheduled</option>
              <option>Closed</option>
              <option>Inactive</option>
            </select>
            <select className="field-select" style={{ width: 150 }} value={openFilter} onChange={e => handle(setOpen)(e.target.value)}>
              <option value="">Open / Closed</option>
              <option value="true">Open</option>
              <option value="false">Closed</option>
            </select>
            {(search || statusFilter || openFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setStatus)(''); handle(setOpen)('') }}>Clear</Button>
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
