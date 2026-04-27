import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, KYCBadge, Button, EmptyState } from '../../components/UI'
import { BrokerIcon } from '../../icons'

const MOCK = [
  { id: 1,  name: 'Rahul Mehta',   company: 'Mehta Insurance',    type: 'Individual', license: 'IRDAI-2023-001', status: 'Active',   kyc: 'Verified' },
  { id: 2,  name: 'Priya Brokers', company: 'Priya Brokers Pvt',  type: 'Corporate',  license: 'IRDAI-2023-045', status: 'Active',   kyc: 'Verified' },
  { id: 3,  name: 'Anil Kumar',    company: 'AK Associates',       type: 'Individual', license: 'IRDAI-2022-112', status: 'Inactive', kyc: 'Pending'  },
  { id: 4,  name: 'Sunita Shah',   company: 'Shah Financial',      type: 'Corporate',  license: 'IRDAI-2023-078', status: 'Active',   kyc: 'Verified' },
  { id: 5,  name: 'Vikram Nair',   company: 'Nair & Co.',          type: 'Individual', license: 'IRDAI-2023-091', status: 'Active',   kyc: 'Verified' },
  { id: 6,  name: 'Deepa Joshi',   company: 'Joshi Brokers',       type: 'Corporate',  license: 'IRDAI-2022-055', status: 'Active',   kyc: 'Verified' },
  { id: 7,  name: 'Ramesh Gupta',  company: 'Gupta Insure',        type: 'Individual', license: 'IRDAI-2021-200', status: 'Inactive', kyc: 'Rejected' },
  { id: 8,  name: 'Kavita Rao',    company: 'Rao & Partners',      type: 'Corporate',  license: 'IRDAI-2023-033', status: 'Active',   kyc: 'Verified' },
  { id: 9,  name: 'Suresh Pillai', company: 'Pillai Associates',   type: 'Individual', license: 'IRDAI-2022-178', status: 'Active',   kyc: 'Pending'  },
  { id: 10, name: 'Meena Agarwal', company: 'Agarwal Finance',     type: 'Corporate',  license: 'IRDAI-2023-060', status: 'Active',   kyc: 'Verified' },
  { id: 11, name: 'Arjun Tiwari',  company: 'Tiwari Brokerage',    type: 'Individual', license: 'IRDAI-2023-112', status: 'Active',   kyc: 'Verified' },
  { id: 12, name: 'Pooja Iyer',    company: 'Iyer Insurance',      type: 'Corporate',  license: 'IRDAI-2022-099', status: 'Inactive', kyc: 'Pending'  },
]

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
