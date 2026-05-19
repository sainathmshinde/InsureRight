import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, Button, EmptyState } from '../../components/UI'
import { BankIcon } from '../../icons'
import { useOrganisations } from './OrganisationContext'

export default function OrganisationList() {
  const navigate = useNavigate()
  const { organisations } = useOrganisations()
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = organisations.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === '' ? true : statusFilter === 'Active' ? o.isActive : !o.isActive)
  )
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',          label: 'ID',          style: { fontFamily: 'monospace', color: 'var(--text-3)', fontSize: 12.5 } },
    { key: 'name',        label: 'Name',        style: { fontWeight: 500 } },
    { key: 'description', label: 'Description', style: { color: 'var(--text-2)', fontSize: 13 } },
    { key: 'isActive',    label: 'Status',
      render: row => (
        <span className={`badge ${row.isActive ? 'badge-green' : 'badge-red'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'actions', label: 'Actions',
      render: row => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/organisation/${row.id}/edit`)}>Edit</Button>
      )
    },
  ]

  return (
    <div>
      <PageHeader icon={<BankIcon />} title="Organisations" subtitle={`${organisations.length} organisations`}>
        <Button onClick={() => navigate('/organisation/create')}>+ Add Organisation</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by name…"
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
            empty={<EmptyState icon="🏦" title="No organisations found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
