import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, KYCBadge, Button, EmptyState } from '../../components/UI'
import { CustomerIcon } from '../../icons'
import { useAuth } from '../../context/AuthContext'

// agentId 'a1' = Ravi Kulkarni (sales), 'a2' = Pooja Desai (calling)
const MOCK = [
  { id: 1,  name: 'Aarav Sharma',  mobile: '9876543210', email: 'aarav@gmail.com',  dob: '1990-03-15', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1' },
  { id: 2,  name: 'Rohit Sharma',  mobile: '9812000000', email: 'rohit@gmail.com',  dob: '1990-11-20', gender: 'Male',   kyc: 'Pending',   policies: 0, agentId: 'a2' },
  { id: 3,  name: 'Divya Nair',    mobile: '9911223344', email: 'divya@gmail.com',  dob: '1978-06-05', gender: 'Female', kyc: 'Verified',  policies: 3, agentId: 'a1' },
  { id: 4,  name: 'Vijay Patil',   mobile: '9011223344', email: 'vijay@gmail.com',  dob: '1995-09-30', gender: 'Male',   kyc: 'Rejected',  policies: 0, agentId: 'a2' },
  { id: 5,  name: 'Suresh Kumar',  mobile: '9988001122', email: 'suresh@gmail.com', dob: '1985-03-20', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1' },
  { id: 6,  name: 'Vikram Rao',    mobile: '9944556677', email: 'vikram@gmail.com', dob: '1975-08-20', gender: 'Male',   kyc: 'Verified',  policies: 2, agentId: 'a1' },
  { id: 7,  name: 'Kavita Pillai', mobile: '9899112233', email: 'kavita@gmail.com', dob: '1993-12-01', gender: 'Female', kyc: 'Verified',  policies: 1, agentId: 'a1' },
  { id: 8,  name: 'Arjun Singh',   mobile: '9922334455', email: 'arjun@gmail.com',  dob: '1987-03-22', gender: 'Male',   kyc: 'Verified',  policies: 0, agentId: 'a1' },
  { id: 9,  name: 'Priya Mehta',   mobile: '9812345678', email: 'priya@gmail.com',  dob: '1992-07-10', gender: 'Female', kyc: 'Verified',  policies: 1, agentId: 'a1' },
  { id: 10, name: 'Rahul Gupta',   mobile: '9966778899', email: 'rahul@gmail.com',  dob: '1980-01-05', gender: 'Male',   kyc: 'Verified',  policies: 1, agentId: 'a1' },
  { id: 11, name: 'Ritu Singh',    mobile: '9833221100', email: 'ritu@gmail.com',   dob: '1996-05-18', gender: 'Female', kyc: 'Pending',   policies: 0, agentId: 'a2' },
  { id: 12, name: 'Ajay Iyer',     mobile: '9822110099', email: 'ajay@gmail.com',   dob: '1983-10-30', gender: 'Male',   kyc: 'Rejected',  policies: 0, agentId: 'a2' },
]

export default function CustomerList() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch]     = useState('')
  const [kycFilter, setKycFilter] = useState('')

  const scopedData = user?.role === 'agent' ? MOCK.filter(c => c.agentId === user.id) : MOCK

  const filtered = scopedData.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search)) &&
    (kycFilter ? c.kyc === kycFilter : true)
  )
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',       label: '#',        style: { color: 'var(--text-3)' } },
    { key: 'name',     label: 'Name',     style: { fontWeight: 500 } },
    { key: 'mobile',   label: 'Mobile' },
    { key: 'email',    label: 'Email',    style: { color: 'var(--blue)' } },
    { key: 'gender',   label: 'Gender' },
    { key: 'dob',      label: 'DOB' },
    { key: 'kyc',      label: 'KYC',      render: row => <KYCBadge status={row.kyc} /> },
    { key: 'policies', label: 'Policies',
      render: row => (
        <span className="badge badge-purple">
          {row.policies} {row.policies === 1 ? 'policy' : 'policies'}
        </span>
      )},
    { key: 'actions',  label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => navigate(`/customer/${row.id}/360`)}>360°</Button>
          <Button variant="ghost"     size="sm" onClick={() => navigate(`/customer/${row.id}/edit`)}>Edit</Button>
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<CustomerIcon />} title={user?.role === 'agent' ? 'My Customers' : 'Customers'} subtitle={`${scopedData.length} customers`}>
        <Button onClick={() => navigate('/customer/create')}>+ Add Customer</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by name or mobile…"
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 160 }} value={kycFilter} onChange={e => handle(setKycFilter)(e.target.value)}>
              <option value="">All KYC Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
            {(search || kycFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setKycFilter)('') }}>Clear</Button>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            empty={<EmptyState icon="👤" title="No customers found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}

export { MOCK as CUSTOMER_MOCK }
