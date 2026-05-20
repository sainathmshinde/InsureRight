import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STATS = [
  { label: 'Total Agents',      value: '12',      sub: '9 active',            color: '#7c3aed', bg: '#ede9fe' },
  { label: 'Total Customers',   value: '248',     sub: '+14 this month',      color: '#1d4ed8', bg: '#dbeafe' },
  { label: 'Policies Issued',   value: '183',     sub: 'This financial year',  color: '#15803d', bg: '#dcfce7' },
  { label: 'Premium Collected', value: '₹24.5L',  sub: 'April 2025',          color: '#b45309', bg: '#fef3c7' },
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
  { label: 'Add Agent',    path: '/agent/create',    color: '#7c3aed', bg: '#ede9fe' },
  { label: 'Add Customer', path: '/customer/create', color: '#1d4ed8', bg: '#dbeafe' },
  { label: 'Add Campaign', path: '/campaign/create', color: '#15803d', bg: '#dcfce7' },
  { label: 'Add Product',  path: '/product/create',  color: '#b45309', bg: '#fef3c7' },
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
  const r = 34
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
    <div style={{ borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.07), 0 4px 18px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
      <div style={{ height: 4, background: `linear-gradient(90deg,${segments[0]?.color ?? '#7c3aed'},${segments[1]?.color ?? '#0ea5e9'})` }} />
      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 14, textAlign: 'center', letterSpacing: '.2px', textTransform: 'uppercase' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="110" height="110" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            {arcs.map((arc, i) => (
              <circle
                key={i} cx="50" cy="50" r={r}
                fill="none" stroke={arc.color} strokeWidth="22"
                strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
                strokeDashoffset={arc.dashOffset}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
              />
            ))}
            <text x="50" y="46" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="500">Total</text>
            <text x="50" y="58" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1e293b">
              {total.toLocaleString('en-IN')}
            </text>
          </svg>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {arcs.map((arc, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: arc.color, flexShrink: 0 }} />
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '.1px' }}>{arc.label}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingLeft: 15 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{arc.value.toLocaleString('en-IN')}</div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: arc.color, background: `${arc.color}1a`, padding: '2px 7px', borderRadius: 99 }}>{Math.round(arc.pct * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {note && (
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>{note}</div>
        )}
      </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 4, height: 22, borderRadius: 99, background: 'linear-gradient(180deg,#7c3aed,#0ea5e9)' }} />
            <div style={{ fontWeight: 800, fontSize: 17, color: '#1e293b' }}>Campaign MIS</div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Campaign Name</label>
              <select className="field-select" style={{ width: '100%' }} value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)}>
                <option value="">All Campaigns</option>
                {CAMPAIGNS_LIST.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Association</label>
              <select className="field-select" style={{ width: '100%' }} value={assocFilter} onChange={e => setAssocFilter(e.target.value)}>
                <option value="">All Associations</option>
                {ASSOCIATIONS_LIST.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <button
              type="button"
              onClick={handleMisSubmit}
              style={{ padding: '10px 30px', borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#0ea5e9)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, boxShadow: '0 4px 14px rgba(124,58,237,.35)' }}
            >
              Apply
            </button>
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#94a3b8', marginBottom: 20 }}>* Count indicates number of customers</div>

          {/* MIS grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            <DonutChart
              title="Customer Details"
              segments={[
                { label: 'Engaged',     value: mis.engagedCustomer,    color: '#7c3aed' },
                { label: 'Non-Engaged', value: mis.nonEngagedCustomer, color: '#f59e0b' },
              ]}
            />

            <DonutChart
              title="Policy Overview"
              segments={[
                { label: 'Policy Purchased', value: mis.policyPurchased, color: '#10b981' },
                { label: 'Policy Pending',   value: mis.policyPending,   color: '#f59e0b' },
              ]}
            />

            <DonutChart
              title="Payment Initiates"
              segments={[
                { label: 'RTGS',   value: mis.rtgsInitiated,   color: '#0ea5e9' },
                { label: 'Cheque', value: mis.chequeInitiated, color: '#6366f1' },
              ]}
            />

            <DonutChart
              title="Online vs Offline"
              segments={[
                { label: 'Online',  value: mis.onlinePurchased,  color: '#6366f1' },
                { label: 'Offline', value: mis.offlinePurchased, color: '#f59e0b' },
              ]}
              note={`of ${mis.policyPurchased.toLocaleString('en-IN')} total policies purchased`}
            />

            <DonutChart
              title="Payment Pending / Rejected"
              segments={[
                { label: 'Pending',  value: mis.paymentPending,  color: '#f59e0b' },
                { label: 'Rejected', value: mis.paymentRejected, color: '#ef4444' },
              ]}
            />

            <DonutChart
              title="Offline Purchased"
              segments={[
                { label: 'RTGS',   value: mis.rtgsPurchased,   color: '#0ea5e9' },
                { label: 'Cheque', value: mis.chequePurchased, color: '#7c3aed' },
              ]}
            />

          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bd-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.05)', border: '1px solid #e2e8f0', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 4, height: 22, borderRadius: 99, background: 'linear-gradient(180deg,#10b981,#0ea5e9)' }} />
            <div style={{ fontWeight: 800, fontSize: 16, color: '#1e293b' }}>Quick Actions</div>
          </div>
          <div className="bd-quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {QUICK_ACTIONS.map(a => (
              <button key={a.label} type="button"
                onClick={() => navigate(a.path)}
                style={{ padding: '13px 16px', borderRadius: 10, border: 'none', background: a.bg, color: a.color, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 2px 8px ${a.color}22`, transition: 'transform .15s' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 20, borderRadius: 99, background: '#7c3aed' }} />
                <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>Agents</div>
              </div>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => navigate('/agent')}>View All →</button>
            </div>
            <div className="bd-agent-cards" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RECENT_AGENTS.map(a => (
                <div key={a.name} style={{ padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#1e293b', marginBottom: 3 }}>{a.name}</div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{a.license} · {a.customers} customers</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: a.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: a.status === 'Active' ? '#15803d' : '#64748b' }}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="bd-agent-table table-wrap" style={{ display: 'none' }}>
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr><th>Name</th><th>License</th><th>Customers</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {RECENT_AGENTS.map(a => (
                    <tr key={a.name}>
                      <td style={{ fontWeight: 500 }}>{a.name}</td>
                      <td style={{ color: '#94a3b8' }}>{a.license}</td>
                      <td>{a.customers}</td>
                      <td>
                        <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: a.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: a.status === 'Active' ? '#15803d' : '#64748b' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 20, borderRadius: 99, background: '#10b981' }} />
                <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>Active Campaigns</div>
              </div>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => navigate('/campaign')}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACTIVE_CAMPAIGNS.map((c, i) => {
                const accentColors = ['#7c3aed', '#0ea5e9', '#10b981']
                return (
                  <div key={c.name} style={{ padding: '13px 15px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', borderLeft: `4px solid ${accentColors[i] ?? '#7c3aed'}` }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#1e293b', marginBottom: 6 }}>{c.name}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b' }}>
                      <span style={{ fontWeight: 600 }}>Agents: <strong style={{ color: '#1e293b' }}>{c.agents}</strong></span>
                      <span style={{ fontWeight: 600 }}>Leads: <strong style={{ color: '#1e293b' }}>{c.leads}</strong></span>
                      <span style={{ marginLeft: 'auto', padding: '1px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: c.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: c.status === 'Active' ? '#15803d' : '#64748b' }}>{c.status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

