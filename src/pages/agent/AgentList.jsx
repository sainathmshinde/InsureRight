import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { AgentIcon } from '../../icons'

const MOCK = [
  { id: 1,  name: 'Ravi Kulkarni',  mobile: '9876543210', email: 'ravi@email.com',  posLicense: 'POS-2023-001', broker: 'Mehta Insurance',  status: 'Active'   },
  { id: 2,  name: 'Pooja Desai',    mobile: '9812345678', email: 'pooja@email.com', posLicense: 'POS-2023-019', broker: 'Priya Brokers',    status: 'Active'   },
  { id: 3,  name: 'Suresh Nair',    mobile: '9800112233', email: 'suresh@email.com',posLicense: 'POS-2022-087', broker: 'AK Associates',    status: 'Inactive' },
  { id: 4,  name: 'Kavita Sharma',  mobile: '9898989898', email: 'kavita@email.com',posLicense: 'POS-2023-045', broker: 'Shah Financial',   status: 'Active'   },
  { id: 5,  name: 'Amit Verma',     mobile: '9090909090', email: 'amit@email.com',  posLicense: 'POS-2023-067', broker: 'Mehta Insurance',  status: 'Active'   },
  { id: 6,  name: 'Sneha Patil',    mobile: '9911223344', email: 'sneha@email.com', posLicense: 'POS-2022-133', broker: 'Nair & Co.',       status: 'Active'   },
  { id: 7,  name: 'Rahul Singh',    mobile: '9922334455', email: 'rahul@email.com', posLicense: 'POS-2021-200', broker: 'Joshi Brokers',    status: 'Inactive' },
  { id: 8,  name: 'Priya Menon',    mobile: '9933445566', email: 'priya@email.com', posLicense: 'POS-2023-088', broker: 'Shah Financial',   status: 'Active'   },
  { id: 9,  name: 'Kiran Reddy',    mobile: '9944556677', email: 'kiran@email.com', posLicense: 'POS-2023-099', broker: 'Rao & Partners',   status: 'Active'   },
  { id: 10, name: 'Neha Gupta',     mobile: '9955667788', email: 'neha@email.com',  posLicense: 'POS-2022-155', broker: 'Priya Brokers',    status: 'Active'   },
  { id: 11, name: 'Ajay Tiwari',    mobile: '9966778899', email: 'ajay@email.com',  posLicense: 'POS-2023-120', broker: 'Mehta Insurance',  status: 'Active'   },
  { id: 12, name: 'Divya Iyer',     mobile: '9977889900', email: 'divya@email.com', posLicense: 'POS-2022-177', broker: 'Pillai Associates',status: 'Inactive' },
]

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
