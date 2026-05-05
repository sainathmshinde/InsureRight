import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, KYCBadge, Button, EmptyState } from '../../components/UI'
import { BrokerIcon } from '../../icons'
import { BROKERS } from './brokerData'

const MOCK = BROKERS.map(b => ({
  id:      b.id,
  name:    b.brokerName,
  company: b.companyName,
  type:    b.brokerType,
  license: b.licenseNumber,
  status:  b.status,
  kyc:     b.kycStatus,
}))

export default function BrokerList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = MOCK.filter(b => {
    const q = search.toLowerCase()
    return (
      (b.name.toLowerCase().includes(q) || b.company.toLowerCase().includes(q)) &&
      (typeFilter   ? b.type   === typeFilter   : true) &&
      (statusFilter ? b.status === statusFilter : true)
    )
  })
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',      label: '#',           style: { color: 'var(--text-3)' } },
    { key: 'name',    label: 'Broker Name', style: { fontWeight: 500 } },
    { key: 'company', label: 'Company' },
    { key: 'type',    label: 'Type',
      render: row => <span className={`badge ${row.type === 'Individual' ? 'badge-blue' : 'badge-purple'}`}>{row.type}</span> },
    { key: 'license', label: 'License No.', style: { fontFamily: 'monospace', fontSize: 12.5 } },
    { key: 'kyc',     label: 'KYC',    render: row => <KYCBadge status={row.kyc} /> },
    { key: 'status',  label: 'Status', render: row => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => navigate(`/broker/${row.id}`)}>View</Button>
          <Button variant="ghost"     size="sm" onClick={() => navigate(`/broker/${row.id}/edit`)}>Edit</Button>
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<BrokerIcon />} title="Brokers" subtitle={`${MOCK.length} brokers registered`}>
        <Button onClick={() => navigate('/broker/create')}>+ Add Broker</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by name or company…"
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 160 }} value={typeFilter} onChange={e => handle(setType)(e.target.value)}>
              <option value="">All Types</option>
              <option>Individual</option>
              <option>Corporate</option>
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
            empty={<EmptyState icon="🏢" title="No brokers found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
