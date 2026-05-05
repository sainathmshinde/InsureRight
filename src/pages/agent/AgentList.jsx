import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { AgentIcon } from '../../icons'
import { AGENTS } from './agentData'

const MOCK = AGENTS.map(a => ({
  id:         a.id,
  name:       a.name,
  mobile:     a.mobile,
  email:      a.email,
  posLicense: a.posLicense,
  broker:     a.assignedBroker,
  status:     a.status,
}))

export default function AgentList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = MOCK.filter(a =>
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.mobile.includes(search)) &&
    (statusFilter ? a.status === statusFilter : true)
  )
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',         label: '#',           style: { color: 'var(--text-3)' } },
    { key: 'name',       label: 'Name',        style: { fontWeight: 500 } },
    { key: 'mobile',     label: 'Mobile' },
    { key: 'email',      label: 'Email',       style: { color: 'var(--blue)' } },
    { key: 'posLicense', label: 'POS License', style: { fontFamily: 'monospace', fontSize: 12.5 } },
    { key: 'broker',     label: 'Broker' },
    { key: 'status',     label: 'Status',      render: row => <StatusBadge status={row.status} /> },
    { key: 'actions',    label: 'Actions',
      render: row => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/agent/${row.id}/edit`)}>Edit</Button>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<AgentIcon />} title="Agents / POS" subtitle={`${MOCK.length} agents registered`}>
        <Button variant="secondary" onClick={() => navigate('/agent/commission')}>Commission Rules</Button>
        <Button onClick={() => navigate('/agent/create')}>+ Add Agent</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by name or mobile…"
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 150 }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
              <option value="">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            {(search || statusFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setStatus)('') }}>Clear</Button>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            empty={<EmptyState icon="👤" title="No agents found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
