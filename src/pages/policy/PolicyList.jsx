import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { PolicyIcon, DownloadPolicyIcon } from '../../icons'

const MOCK = [
  { id: 1,  proposalId: 'PRO-2025-1001', customerName: 'Rahul Singh',    mobile: '98765 43210', product: 'Star Comprehensive Health',     icName: 'Star Health',        type: 'Health', premium: 10030, sumInsured: '10L', policyNo: 'SHI/2025/001234', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-01-15', endDate: '2026-01-14' },
  { id: 2,  proposalId: 'PRO-2025-1002', customerName: 'Priya Sharma',   mobile: '87654 32109', product: 'HDFC ERGO Optima Secure',       icName: 'HDFC ERGO',          type: 'Health', premium: 7316,  sumInsured: '5L',  policyNo: 'HER/2025/002456', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-02-01', endDate: '2026-01-31' },
  { id: 3,  proposalId: 'PRO-2025-1003', customerName: 'Amit Kumar',     mobile: '76543 21098', product: 'Bajaj Allianz Comprehensive Motor', icName: 'Bajaj Allianz',   type: 'Motor',  premium: 5664,  sumInsured: 'IDV', policyNo: 'BAJ/2025/003789', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-02-10', endDate: '2026-02-09' },
  { id: 4,  proposalId: 'PRO-2025-1004', customerName: 'Sunita Rao',     mobile: '65432 10987', product: 'LIC Jeevan Anand',              icName: 'LIC',                type: 'Life',   premium: 14160, sumInsured: '25L', policyNo: 'LIC/2025/004012', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-03-01', endDate: '2055-03-01' },
  { id: 5,  proposalId: 'PRO-2025-1005', customerName: 'Vikram Nair',    mobile: '54321 09876', product: 'ICICI Lombard Complete Health', icName: 'ICICI Lombard',      type: 'Health', premium: 10738, sumInsured: '10L', policyNo: '',                paymentStatus: 'Pending', status: 'Pending',   startDate: '',           endDate: ''           },
  { id: 6,  proposalId: 'PRO-2025-1006', customerName: 'Deepa Joshi',    mobile: '43210 98765', product: 'New India Motor OD + TP',       icName: 'New India Assurance',type: 'Motor',  premium: 4248,  sumInsured: 'IDV', policyNo: 'NIA/2025/006345', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-03-20', endDate: '2026-03-19' },
  { id: 7,  proposalId: 'PRO-2025-1007', customerName: 'Ramesh Gupta',   mobile: '32109 87654', product: 'HDFC Life Sanchay Plus',        icName: 'HDFC Life',          type: 'Life',   premium: 21240, sumInsured: '50L', policyNo: '',                paymentStatus: 'Failed',  status: 'Cancelled', startDate: '',           endDate: ''           },
  { id: 8,  proposalId: 'PRO-2025-1008', customerName: 'Kavita Rao',     mobile: '21098 76543', product: 'Star Comprehensive Health',     icName: 'Star Health',        type: 'Health', premium: 10030, sumInsured: '5L',  policyNo: 'SHI/2025/008901', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-04-01', endDate: '2026-03-31' },
  { id: 9,  proposalId: 'PRO-2025-1009', customerName: 'Suresh Pillai',  mobile: '10987 65432', product: 'Bajaj Allianz Health Guard',    icName: 'Bajaj Allianz',      type: 'Health', premium: 6490,  sumInsured: '3L',  policyNo: '',                paymentStatus: 'Pending', status: 'Pending',   startDate: '',           endDate: ''           },
  { id: 10, proposalId: 'PRO-2025-1010', customerName: 'Meena Agarwal',  mobile: '99887 76655', product: 'ICICI Lombard Motor',           icName: 'ICICI Lombard',      type: 'Motor',  premium: 5192,  sumInsured: 'IDV', policyNo: 'ICL/2025/010234', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-04-15', endDate: '2026-04-14' },
]

const TYPE_COLOR = { Health: 'blue', Motor: 'amber', Life: 'purple' }

export default function PolicyList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = MOCK.filter(p => {
    const q = search.toLowerCase()
    return (
      (p.customerName.toLowerCase().includes(q) || p.proposalId.toLowerCase().includes(q) || p.policyNo.toLowerCase().includes(q)) &&
      (typeFilter   ? p.type   === typeFilter   : true) &&
      (statusFilter ? p.status === statusFilter : true)
    )
  })
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'proposalId',    label: 'Proposal ID',
      style: { fontFamily: 'monospace', fontSize: 12.5, color: 'var(--brand)', fontWeight: 600 } },
    { key: 'customerName',  label: 'Customer',
      render: row => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.customerName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{row.mobile}</div>
        </div>
      )},
    { key: 'product',       label: 'Product',     style: { maxWidth: 180, fontSize: 13 } },
    { key: 'icName',        label: 'IC',          style: { color: 'var(--text-2)', fontSize: 13 } },
    { key: 'type',          label: 'Type',
      render: row => <span className={`badge badge-${TYPE_COLOR[row.type] ?? 'blue'}`}>{row.type}</span> },
    { key: 'premium',       label: 'Premium',     style: { fontWeight: 600 },
      render: row => `₹${row.premium.toLocaleString()}` },
    { key: 'paymentStatus', label: 'Payment',     render: row => <StatusBadge status={row.paymentStatus} /> },
    { key: 'policyNo',      label: 'Policy No.',
      style: { fontFamily: 'monospace', fontSize: 12 },
      render: row => row.policyNo || <span style={{ color: 'var(--text-3)' }}>—</span> },
    { key: 'status',        label: 'Status',      render: row => <StatusBadge status={row.status} /> },
    { key: 'actions',       label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.status === 'Active' && row.policyNo && (
            <Button variant="secondary" size="sm">
              <DownloadPolicyIcon size={13} /> Download
            </Button>
          )}
          {row.paymentStatus === 'Pending' && (
            <Button variant="primary" size="sm" onClick={() => navigate('/policy/buy')}>Pay Now</Button>
          )}
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader
        icon={<PolicyIcon />}
        title="Policy Issuance"
        subtitle={`${MOCK.length} proposals · ${MOCK.filter(p => p.status === 'Active').length} active policies`}
      >
        <Button onClick={() => navigate('/policy/buy')}>+ Buy Policy</Button>
      </PageHeader>

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Proposals', value: MOCK.length,                                                    icon: '📋', color: 'var(--brand)' },
          { label: 'Active Policies', value: MOCK.filter(p => p.status === 'Active').length,                 icon: '✅', color: 'var(--green)' },
          { label: 'Pending Payment', value: MOCK.filter(p => p.paymentStatus === 'Pending').length,         icon: '⏳', color: 'var(--amber)' },
          { label: 'Total Premium',   value: `₹${(MOCK.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + p.premium, 0) / 1000).toFixed(0)}K`, icon: '💰', color: 'var(--blue)' },
        ].map(tile => (
          <div key={tile.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 26, width: 44, height: 44, borderRadius: 'var(--r-md)', background: tile.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tile.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{tile.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{tile.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by customer, proposal ID or policy no…"
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 150 }} value={typeFilter} onChange={e => handle(setType)(e.target.value)}>
              <option value="">All Types</option>
              <option>Health</option>
              <option>Motor</option>
              <option>Life</option>
            </select>
            <select className="field-select" style={{ width: 160 }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
              <option value="">All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            {(search || typeFilter || statusFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setType)(''); handle(setStatus)('') }}>Clear</Button>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            empty={<EmptyState icon="📋" title="No policies found" subtitle="Buy a new policy to get started" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
