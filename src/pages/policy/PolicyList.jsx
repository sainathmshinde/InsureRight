import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { PolicyIcon, DownloadPolicyIcon } from '../../icons'
import { useAuth } from '../../context/AuthContext'
import { POLICY_TYPE_COLOR } from '../product/productData'

const MOCK = [
  { id: 1,  agentId: 'a1', customerId: 'c1', proposalId: 'PRO-2025-1001', customerName: 'Aarav Sharma',  mobile: '98765 43210', product: 'Group Health Insurance Policy for BPP_2026-2027', icName: 'SBI General Insurance',          type: 'Age Band Premium',   premium: 27777, sumInsured: '₹3L', policyNo: 'SBI/2025/001234', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-01-15', endDate: '2026-01-14' },
  { id: 2,  agentId: 'a2', customerId: 'c2', proposalId: 'PRO-2025-1002', customerName: 'Priya Mehta',   mobile: '87654 32109', product: 'Group Health Insurance Policy for BPP',          icName: 'MAGMA General Insurance',        type: 'Age Band Premium',   premium: 47221, sumInsured: '₹3L', policyNo: 'MAG/2025/002456', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-02-01', endDate: '2026-01-31' },
  { id: 3,  agentId: 'a1', customerId: 'c3', proposalId: 'PRO-2025-1003', customerName: 'Amit Kumar',    mobile: '76543 21098', product: 'SBI Base Policy',                                icName: 'SBI General Insurance',          type: 'Base Policy',        premium: 31053, sumInsured: '₹5L', policyNo: 'SBI/2025/003789', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-02-10', endDate: '2026-02-09' },
  { id: 4,  agentId: 'a2', customerId: 'c4', proposalId: 'PRO-2025-1004', customerName: 'Sunita Rao',    mobile: '65432 10987', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',          type: 'OPD',                premium: 9676,  sumInsured: '₹20K',policyNo: 'SBI/2025/004012', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-03-01', endDate: '2026-03-01' },
  { id: 5,  agentId: 'a1', customerId: 'c1', proposalId: 'PRO-2025-1005', customerName: 'Aarav Sharma',  mobile: '98765 43210', product: 'Standalone Super Top Up Policy_BPP_2026-2027',   icName: 'SBI General Insurance',          type: 'Age Band Premium',   premium: 50574, sumInsured: '₹3L', policyNo: '',                paymentStatus: 'Pending', status: 'Pending',   startDate: '',           endDate: ''           },
  { id: 6,  agentId: 'a2', customerId: 'c5', proposalId: 'PRO-2025-1006', customerName: 'Deepa Joshi',   mobile: '43210 98765', product: 'For Threshold of 3 Lakhs — Super Top Up Policy', icName: 'SBI General Insurance',          type: 'Super Top Up',       premium: 2000,  sumInsured: '₹1L', policyNo: 'SBI/2025/006345', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-03-20', endDate: '2026-03-19' },
  { id: 7,  agentId: 'a2', customerId: 'c6', proposalId: 'PRO-2025-1007', customerName: 'Ramesh Gupta',  mobile: '32109 87654', product: 'Super Top Up Policy',                            icName: 'Go Digit General Insurance',     type: 'Base Policy',        premium: 5509,  sumInsured: '₹3L', policyNo: '',                paymentStatus: 'Failed',  status: 'Cancelled', startDate: '',           endDate: ''           },
  { id: 8,  agentId: 'a2', customerId: 'c2', proposalId: 'PRO-2025-1008', customerName: 'Priya Mehta',   mobile: '87654 32109', product: 'Group Health Insurance Policy for BPP_2026-2027', icName: 'SBI General Insurance',          type: 'Age Band Premium',   premium: 19194, sumInsured: '₹3L', policyNo: 'SBI/2025/008901', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-04-01', endDate: '2026-03-31' },
  { id: 9,  agentId: 'a1', customerId: 'c3', proposalId: 'PRO-2025-1009', customerName: 'Amit Kumar',    mobile: '76543 21098', product: 'Standalone Super Top Up Policy (BPP)',            icName: 'MAGMA General Insurance',        type: 'Age Band Premium',   premium: 13178, sumInsured: '₹3L', policyNo: '',                paymentStatus: 'Pending', status: 'Pending',   startDate: '',           endDate: ''           },
  { id: 10, agentId: 'a2', customerId: 'c4', proposalId: 'PRO-2025-1010', customerName: 'Sunita Rao',    mobile: '65432 10987', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance',     type: 'OPD',                premium: 10385, sumInsured: '₹15K',policyNo: 'DIG/2025/010234', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-04-15', endDate: '2026-04-14' },
]

export { MOCK as POLICY_MOCK }

const UNIQUE_TYPES = [...new Set(MOCK.map(p => p.type))]

export default function PolicyList() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isCustomer = user?.role === 'customer'

  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState('')
  const [statusFilter, setStatus] = useState('')

  const scopedData = isCustomer ? MOCK.filter(p => p.customerId === user.id) : MOCK

  const filtered = scopedData.filter(p => {
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
    ...(!isCustomer ? [{
      key: 'customerName', label: 'Customer',
      render: row => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.customerName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{row.mobile}</div>
        </div>
      ),
    }] : []),
    { key: 'product',       label: 'Product',     style: { maxWidth: 180, fontSize: 13 } },
    { key: 'icName',        label: 'IC',          style: { color: 'var(--text-2)', fontSize: 13 } },
    { key: 'type',          label: 'Type',
      render: row => <span className={`badge badge-${POLICY_TYPE_COLOR[row.type] ?? 'blue'}`}>{row.type}</span> },
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
        title={isCustomer ? 'My Policies' : 'Policy Issuance'}
        subtitle={isCustomer
          ? `${scopedData.length} policies · ${scopedData.filter(p => p.status === 'Active').length} active`
          : `${MOCK.length} proposals · ${MOCK.filter(p => p.status === 'Active').length} active policies`}
      >
        <Button onClick={() => navigate('/policy/buy')}>+ Buy Policy</Button>
      </PageHeader>

      {/* Summary tiles */}
      <div className="pl-tiles" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: isCustomer ? 'My Policies'    : 'Total Proposals', value: scopedData.length,                                                         icon: '📋', color: 'var(--brand)' },
          { label: 'Active Policies',              value: scopedData.filter(p => p.status === 'Active').length,                                          icon: '✅', color: 'var(--green)' },
          { label: 'Pending Payment',              value: scopedData.filter(p => p.paymentStatus === 'Pending').length,                                  icon: '⏳', color: 'var(--amber)' },
          { label: isCustomer ? 'Premium Paid'   : 'Total Premium',   value: `₹${(scopedData.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + p.premium, 0) / 1000).toFixed(1)}K`, icon: '💰', color: 'var(--blue)' },
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
            <input className="field-input filter-search" placeholder={isCustomer ? "Search by proposal ID or policy no…" : "Search by customer, proposal ID or policy no…"}
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 175 }} value={typeFilter} onChange={e => handle(setType)(e.target.value)}>
              <option value="">All Types</option>
              {UNIQUE_TYPES.map(t => <option key={t}>{t}</option>)}
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

          {/* ── Mobile cards (hidden on desktop) ── */}
          <div className="pl-cards">
            {pg.slice.length === 0
              ? <EmptyState icon="📋" title="No policies found" subtitle="Buy a new policy to get started" />
              : pg.slice.map(row => {
                const BADGE_HEX = { blue: '#2563eb', green: '#16a34a', amber: '#d97706', purple: '#7c3aed', red: '#dc2626', gray: '#6b7280' }
                const BADGE_BG  = { blue: '#dbeafe', green: '#dcfce7', amber: '#fef3c7', purple: '#ede9fe', red: '#fee2e2', gray: '#f3f4f6' }
                const colorKey  = POLICY_TYPE_COLOR[row.type] ?? 'blue'
                const typeColor = BADGE_HEX[colorKey]
                const typeBg    = BADGE_BG[colorKey]
                return (
                  <div key={row.id} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--surface)', overflow: 'hidden' }}>
                    {/* Card header */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3, lineHeight: 1.3 }}>{row.product}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{row.icName}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                        <StatusBadge status={row.status} />
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: typeBg, color: typeColor }}>{row.type}</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Annual Premium</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--brand)' }}>₹{row.premium.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Sum Insured</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{row.sumInsured}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Payment</div>
                        <StatusBadge status={row.paymentStatus} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Valid Until</div>
                        <div style={{ fontWeight: 500, fontSize: 12.5 }}>{row.endDate || '—'}</div>
                      </div>
                      {!isCustomer && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Customer</div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{row.customerName} · {row.mobile}</div>
                        </div>
                      )}
                      {row.policyNo && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Policy No.</div>
                          <div style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--brand)' }}>{row.policyNo}</div>
                        </div>
                      )}
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Proposal ID</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-2)' }}>{row.proposalId}</div>
                      </div>
                    </div>

                    {/* Card actions */}
                    {(row.status === 'Active' && row.policyNo || row.paymentStatus === 'Pending') && (
                      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', gap: 8 }}>
                        {row.status === 'Active' && row.policyNo && (
                          <Button variant="secondary" size="sm" style={{ flex: 1, justifyContent: 'center' }}>
                            ⬇ Download Policy
                          </Button>
                        )}
                        {row.paymentStatus === 'Pending' && (
                          <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => navigate('/policy/buy')}>
                            💳 Pay Now
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>

          {/* ── Desktop table (hidden on mobile) ── */}
          <div className="pl-table-wrap">
            <Table
              columns={columns}
              rows={pg.slice}
              empty={<EmptyState icon="📋" title="No policies found" subtitle="Buy a new policy to get started" />}
            />
          </div>

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
