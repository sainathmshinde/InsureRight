import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, KYCBadge, Button, EmptyState, RowActionButton } from '../../components/UI'
import { BrokerIcon, ViewIcon, EditIcon, DeleteIcon } from '../../icons'
import { BROKERS } from './brokerData'
import { useToast } from '../../context/ToastContext'

const INITIAL_MOCK = BROKERS.map(b => ({
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
  const toast = useToast()
  const [rows, setRows]           = useState(INITIAL_MOCK)
  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState('')
  const [statusFilter, setStatus] = useState('')

  const handleDelete = async b => {
    if (await toast.confirm(`Delete broker "${b.name}"? This cannot be undone.`)) {
      setRows(prev => prev.filter(r => r.id !== b.id))
    }
  }

  const filtered = rows.filter(b => {
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
          <RowActionButton title="View" icon={ViewIcon} onClick={() => navigate(`/broker/${row.id}`)} />
          <RowActionButton title="Edit" icon={EditIcon} onClick={() => navigate(`/broker/${row.id}/edit`)} />
          <RowActionButton title="Delete" icon={DeleteIcon} variant="delete" onClick={() => handleDelete(row)} />
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<BrokerIcon />} title="Brokers">
        <Button onClick={() => navigate('/broker/create')}>+ Add Broker</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Search</label>
              <input className="field-input filter-search" style={{ width: '100%' }} placeholder="Search by name or company…"
                value={search} onChange={e => handle(setSearch)(e.target.value)} />
            </div>
            <div style={{ flex: '0 0 160px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Broker Type</label>
              <select className="field-select" style={{ width: '100%' }} value={typeFilter} onChange={e => handle(setType)(e.target.value)}>
                <option value="">All Types</option>
                <option>Individual</option>
                <option>Corporate</option>
              </select>
            </div>
            <div style={{ flex: '0 0 150px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Status</label>
              <select className="field-select" style={{ width: '100%' }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            {(search || typeFilter || statusFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setType)(''); handle(setStatus)('') }}>Clear</Button>
              </div>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            stickyHeader
            empty={<EmptyState icon="🏢" title="No brokers found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
