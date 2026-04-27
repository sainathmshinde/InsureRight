import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { InsuranceCompanyIcon } from '../../icons'

const MOCK = [
  { id: 1, name: 'Star Health Insurance',  code: 'SHI', contact: 'Ravi Sharma',   email: 'api@starhealth.in',         status: 'Active'   },
  { id: 2, name: 'HDFC ERGO',              code: 'HER', contact: 'Neha Joshi',    email: 'api@hdfcergo.com',          status: 'Active'   },
  { id: 3, name: 'ICICI Lombard',          code: 'ICL', contact: 'Amit Patel',    email: 'api@icicilombard.com',      status: 'Active'   },
  { id: 4, name: 'Bajaj Allianz',          code: 'BAJ', contact: 'Sunita Rao',    email: 'api@bajajallianz.com',      status: 'Inactive' },
  { id: 5, name: 'New India Assurance',    code: 'NIA', contact: 'Prakash Mehta', email: 'api@newindia.co.in',        status: 'Active'   },
  { id: 6, name: 'United India Insurance', code: 'UII', contact: 'Rekha Nair',    email: 'api@uiic.co.in',            status: 'Active'   },
  { id: 7, name: 'Reliance General',       code: 'RGI', contact: 'Suresh Kumar',  email: 'api@reliancegeneral.in',    status: 'Active'   },
  { id: 8, name: 'Tata AIG',               code: 'TAI', contact: 'Aarti Singh',   email: 'api@tataaig.com',           status: 'Inactive' },
  { id: 9, name: 'Oriental Insurance',     code: 'OIC', contact: 'Vijay Sharma',  email: 'api@orientalinsurance.in',  status: 'Active'   },
]

export default function ICList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = MOCK.filter(ic =>
    (ic.name.toLowerCase().includes(search.toLowerCase()) || ic.code.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter ? ic.status === statusFilter : true)
  )
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',      label: '#',              style: { color: 'var(--text-3)' } },
    { key: 'name',    label: 'IC Name',        style: { fontWeight: 500 } },
    { key: 'code',    label: 'Code',           render: row => <span className="badge badge-purple">{row.code}</span> },
    { key: 'contact', label: 'Contact Person' },
    { key: 'email',   label: 'Email',          style: { color: 'var(--blue)' } },
    { key: 'status',  label: 'Status',         render: row => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => navigate(`/ic/${row.id}/edit`)}>Edit</Button>
          <Button variant="ghost"     size="sm" onClick={() => navigate(`/ic/${row.id}/integration`)}>Integration</Button>
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<InsuranceCompanyIcon />} title="Insurance Companies" subtitle={`${MOCK.length} companies onboarded`}>
        <Button onClick={() => navigate('/ic/create')}>+ Add IC</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by name or code…"
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
            empty={<EmptyState icon="🏦" title="No insurance companies found" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
