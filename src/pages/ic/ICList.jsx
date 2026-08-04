import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState, RowActionButton } from '../../components/UI'
import { InsuranceCompanyIcon, EditIcon, DeleteIcon } from '../../icons'
import { ICS } from './icData'

const INITIAL_MOCK = ICS.map(ic => ({
  id:      ic.id,
  name:    ic.icName,
  code:    ic.code,
  branch:  ic.branch,
  contact: ic.contactPerson,
  email:   ic.contactEmail,
  status:  ic.status,
}))

export default function ICList() {
  const navigate = useNavigate()
  const [rows, setRows]           = useState(INITIAL_MOCK)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')

  const handleDelete = ic => {
    if (window.confirm(`Delete insurance company "${ic.name}"? This cannot be undone.`)) {
      setRows(prev => prev.filter(r => r.id !== ic.id))
    }
  }

  const filtered = rows.filter(ic =>
    (ic.name.toLowerCase().includes(search.toLowerCase()) || ic.code.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter ? ic.status === statusFilter : true)
  )
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'name',    label: 'IC Name',        style: { fontWeight: 500 } },
    { key: 'code',    label: 'Code',           render: row => <span className="badge badge-purple">{row.code}</span> },
    { key: 'branch',  label: 'Branch' },
    { key: 'contact', label: 'Contact Person' },
    { key: 'email',   label: 'Email',          style: { color: 'var(--blue)' } },
    { key: 'status',  label: 'Status',         render: row => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 6 }}>
          <RowActionButton title="Edit" icon={EditIcon} onClick={() => navigate(`/ic/${row.id}/edit`)} />
          <RowActionButton title="Delete" icon={DeleteIcon} variant="delete" onClick={() => handleDelete(row)} />
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<InsuranceCompanyIcon />} title="Insurance Companies">
        <Button onClick={() => navigate('/ic/create')}>+ Add IC</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Search</label>
              <input className="field-input filter-search" style={{ width: '100%' }} placeholder="Search by name or code…"
                value={search} onChange={e => handle(setSearch)(e.target.value)} />
            </div>
            <div style={{ flex: '0 0 160px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Status</label>
              <select className="field-select" style={{ width: '100%' }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            {(search || statusFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setStatus)('') }}>Clear</Button>
              </div>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            stickyHeader
            empty={<EmptyState icon="🏦" title="No insurance companies found" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
