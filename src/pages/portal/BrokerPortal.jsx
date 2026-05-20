import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STATS = [
  { label: 'Total Agents',      value: '12',      sub: '9 active',            color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Total Customers',   value: '248',     sub: '+14 this month',      color: '#0a7ea4', bg: '#e0f4fb' },
  { label: 'Policies Issued',   value: '183',     sub: 'This financial year',  color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'Premium Collected', value: '₹24.5L',  sub: 'April 2025',          color: '#a05c00', bg: '#fff3e0' },
]

const RECENT_AGENTS = [
  { name: 'Ravi Kulkarni',  license: 'POS-2023-001', broker: 'Mehta Insurance',  customers: 28, status: 'Active'   },
  { name: 'Pooja Desai',    license: 'POS-2023-019', broker: 'Priya Brokers',    customers: 19, status: 'Active'   },
  { name: 'Kavita Sharma',  license: 'POS-2023-045', broker: 'Shah Financial',   customers: 34, status: 'Active'   },
  { name: 'Amit Verma',     license: 'POS-2023-067', broker: 'Mehta Insurance',  customers: 22, status: 'Active'   },
  { name: 'Suresh Nair',    license: 'POS-2022-087', broker: 'AK Associates',    customers: 11, status: 'Inactive' },
]

const ACTIVE_CAMPAIGNS = [
  { name: 'BPP Campaign_2026-2027', agents: 3, leads: 21, status: 'Active'    },
  { name: 'SBI_STP_Campaign',       agents: 2, leads: 38, status: 'Completed' },
  { name: 'BPP Campaign',           agents: 3, leads: 36, status: 'Completed' },
]

const QUICK_ACTIONS = [
  { label: 'Add Agent',    path: '/agent/create',    color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Add Customer', path: '/customer/create', color: '#0a7ea4', bg: '#e0f4fb' },
  { label: 'Add Campaign', path: '/campaign/create', color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'Add Product',  path: '/product/create',  color: '#a05c00', bg: '#fff3e0' },
]

const CAMPAIGNS_LIST = [
  'Campaign 1',
  'Campaign OPD and DIGIT PAYMENT PROTECTION',
  'BPP Campaign',
  'Test Campaign',
  'SBI_STP_Campaign',
  'BPP Campaign_2026-2027',
  'Standalone campaign',
]

const ASSOCIATIONS_LIST = [
  'Mehta Insurance', 'Priya Brokers', 'Shah Financial',
  'AK Associates', 'Nair & Co.', 'Rao & Partners',
]

// Mock MIS datasets keyed by campaign name; default = all campaigns combined
const MIS_DATA = {
  '': {
    engagedCustomer: 30692, nonEngagedCustomer: 3186,
    policyPurchased: 21090, policyPending: 9602,
    onlinePurchased: 18042, offlinePurchased: 3048,
    rtgsInitiated: 221,     chequeInitiated: 124,
    rtgsPurchased: 2128,    chequePurchased: 920,
    paymentPending: 8657,   paymentRejected: 945,
  },
  'BPP Campaign_2026-2027': {
    engagedCustomer: 12400, nonEngagedCustomer: 1100,
    policyPurchased: 8800,  policyPending: 3600,
    onlinePurchased: 7200,  offlinePurchased: 1600,
    rtgsInitiated: 98,      chequeInitiated: 62,
    rtgsPurchased: 980,     chequePurchased: 420,
    paymentPending: 3100,   paymentRejected: 320,
  },
  'SBI_STP_Campaign': {
    engagedCustomer: 9800, nonEngagedCustomer: 980,
    policyPurchased: 6900, policyPending: 2900,
    onlinePurchased: 5800, offlinePurchased: 1100,
    rtgsInitiated: 72,     chequeInitiated: 41,
    rtgsPurchased: 710,    chequePurchased: 290,
    paymentPending: 2400,  paymentRejected: 280,
  },
  'BPP Campaign': {
    engagedCustomer: 5200, nonEngagedCustomer: 620,
    policyPurchased: 3600, policyPending: 1600,
    onlinePurchased: 2900, offlinePurchased: 700,
    rtgsInitiated: 38,     chequeInitiated: 18,
    rtgsPurchased: 430,    chequePurchased: 170,
    paymentPending: 1300,  paymentRejected: 190,
  },
  'Campaign OPD and DIGIT PAYMENT PROTECTION': {
    engagedCustomer: 7840, nonEngagedCustomer: 960,
    policyPurchased: 5200, policyPending: 2640,
    onlinePurchased: 4100, offlinePurchased: 1100,
    rtgsInitiated: 54,     chequeInitiated: 28,
    rtgsPurchased: 680,    chequePurchased: 310,
    paymentPending: 2100,  paymentRejected: 380,
  },
  'Campaign 1': {
    engagedCustomer: 2100, nonEngagedCustomer: 310,
    policyPurchased: 1400, policyPending: 700,
    onlinePurchased: 1100, offlinePurchased: 300,
    rtgsInitiated: 8,      chequeInitiated: 3,
    rtgsPurchased: 180,    chequePurchased: 80,
    paymentPending: 560,   paymentRejected: 90,
  },
}

// ── MIS sub-components ─────────────────────────────────────────────────────────
function DonutChart({ title, segments, note }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const r = 36
  const circumference = 2 * Math.PI * r
  let cum = 0
  const arcs = segments.map(seg => {
    const pct        = total > 0 ? seg.value / total : 0
    const dash       = pct * circumference
    const dashOffset = circumference - cum
    cum += dash
    return { ...seg, dash, dashOffset, pct }
  })
  return (
    <div style={{ border: '1.5px solid #d4c9f0', borderRadius: 14, padding: '18px 16px 14px', background: '#fff', boxShadow: '0 2px 12px rgba(124,58,237,.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <svg width="120" height="120" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
          {arcs.map((arc, i) => (
            <circle
              key={i} cx="50" cy="50" r={r}
              fill="none" stroke={arc.color} strokeWidth="22"
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={arc.dashOffset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
            />
          ))}
          <text x="50" y="46" textAnchor="middle" fontSize="7" fontWeight="600" fill="#9d94b8">Total</text>
          <text x="50" y="58" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1a1628">
            {total.toLocaleString('en-IN')}
          </text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {arcs.map((arc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: arc.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12, color: '#5c5573', fontWeight: 600, lineHeight: 1.3 }}>{arc.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1628', flexShrink: 0 }}>{arc.value.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, color: '#9d94b8', width: 28, textAlign: 'right', flexShrink: 0 }}>{Math.round(arc.pct * 100)}%</div>
            </div>
          ))}
        </div>
      </div>
      {note && (
        <div style={{ fontSize: 11.5, color: '#9d94b8', marginTop: 10, textAlign: 'center' }}>{note}</div>
      )}
      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', textAlign: 'center', borderTop: '1px solid #ede9f8', paddingTop: 10, marginTop: 12 }}>{title}</div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BrokerPortal() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [campaignFilter, setCampaignFilter] = useState('Campaign OPD and DIGIT PAYMENT PROTECTION')
  const [assocFilter,    setAssocFilter]    = useState('')
  const [mis, setMis] = useState(MIS_DATA['Campaign OPD and DIGIT PAYMENT PROTECTION'] ?? MIS_DATA[''])

  const handleMisSubmit = () => {
    const data = MIS_DATA[campaignFilter] ?? MIS_DATA['']
    setMis(data)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── MIS Section ── */}
      <div className="card">
        <div className="card-body">

          {/* MIS header */}
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1628', marginBottom: 16 }}>Campaign MIS</div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9d94b8', marginBottom: 5 }}>Campaign Name</label>
              <select className="field-select" style={{ width: '100%' }} value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)}>
                <option value="">All Campaigns</option>
                {CAMPAIGNS_LIST.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9d94b8', marginBottom: 5 }}>Association</label>
              <select className="field-select" style={{ width: '100%' }} value={assocFilter} onChange={e => setAssocFilter(e.target.value)}>
                <option value="">All Associations</option>
                {ASSOCIATIONS_LIST.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <button
              type="button"
              onClick={handleMisSubmit}
              style={{ padding: '9px 28px', borderRadius: 8, background: '#7c3aed', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
            >
              Submit
            </button>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1628', marginBottom: 20 }}>* Count indicates number of customers</div>

          {/* MIS grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            <DonutChart
              title="Customer Details"
              segments={[
                { label: 'Engaged',     value: mis.engagedCustomer,    color: '#7c3aed' },
                { label: 'Non-Engaged', value: mis.nonEngagedCustomer, color: '#0a7ea4' },
              ]}
            />

            <DonutChart
              title="Policy Overview"
              segments={[
                { label: 'Policy Purchased', value: mis.policyPurchased, color: '#7c3aed' },
                { label: 'Policy Pending',   value: mis.policyPending,   color: '#0a7ea4' },
              ]}
            />

            <DonutChart
              title="Payment Initiates"
              segments={[
                { label: 'RTGS',   value: mis.rtgsInitiated,   color: '#7c3aed' },
                { label: 'Cheque', value: mis.chequeInitiated, color: '#0a7ea4' },
              ]}
            />

            <DonutChart
              title="Online vs Offline"
              segments={[
                { label: 'Online',  value: mis.onlinePurchased,  color: '#7c3aed' },
                { label: 'Offline', value: mis.offlinePurchased, color: '#0a7ea4' },
              ]}
              note={`of ${mis.policyPurchased.toLocaleString('en-IN')} total policies purchased`}
            />

            <DonutChart
              title="Payment Pending / Rejected"
              segments={[
                { label: 'Pending',  value: mis.paymentPending,  color: '#d97706' },
                { label: 'Rejected', value: mis.paymentRejected, color: '#e5383b' },
              ]}
            />

            <DonutChart
              title="Offline Purchased"
              segments={[
                { label: 'RTGS',   value: mis.rtgsPurchased,   color: '#7c3aed' },
                { label: 'Cheque', value: mis.chequePurchased, color: '#0a7ea4' },
              ]}
            />

          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bd-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1628', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: '#9d94b8', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <div className="card-body">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Quick Actions</div>
          <div className="bd-quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {QUICK_ACTIONS.map(a => (
              <button key={a.label} type="button"
                onClick={() => navigate(a.path)}
                style={{ padding: '10px 16px', borderRadius: 8, border: `1.5px solid ${a.color}33`, background: a.bg, color: a.color, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                + {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bd-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Agents */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Agents</div>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => navigate('/agent')}>View All</button>
            </div>
            <div className="bd-agent-cards">
              {RECENT_AGENTS.map(a => (
                <div key={a.name} style={{ padding: '11px 13px', border: '1px solid #e8e4f0', borderRadius: 10, background: '#faf9fc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{a.name}</span>
                    <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: a.status === 'Active' ? '#e6f4ea' : '#f1f3f4', color: a.status === 'Active' ? '#2d7d46' : '#5f6368' }}>
                      {a.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9d94b8' }}>{a.license} &nbsp;·&nbsp; {a.customers} customers</div>
                </div>
              ))}
            </div>
            <div className="bd-agent-table table-wrap">
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr><th>Name</th><th>License</th><th>Customers</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {RECENT_AGENTS.map(a => (
                    <tr key={a.name}>
                      <td style={{ fontWeight: 500 }}>{a.name}</td>
                      <td style={{ color: '#9d94b8' }}>{a.license}</td>
                      <td>{a.customers}</td>
                      <td>
                        <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: a.status === 'Active' ? '#e6f4ea' : '#f1f3f4', color: a.status === 'Active' ? '#2d7d46' : '#5f6368' }}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Active Campaigns</div>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => navigate('/campaign')}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVE_CAMPAIGNS.map(c => (
                <div key={c.name} style={{ padding: '12px 14px', border: '1px solid #e8e4f0', borderRadius: 10, background: '#faf9fc' }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#9d94b8', flexWrap: 'wrap' }}>
                    <span>Agents: {c.agents}</span>
                    <span>Leads: {c.leads}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
