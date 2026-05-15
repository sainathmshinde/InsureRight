import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ── Sales agent (Ravi Kulkarni) data ─────────────────────────────────────────
const SALES_STATS = [
  { label: 'My Customers',    value: '8', sub: '+3 this month',       color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Policies Issued', value: '5', sub: 'This financial year', color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'CRM Leads',       value: '8', sub: '3 interested',        color: '#0a7ea4', bg: '#e0f4fb' },
]
const SALES_CAMPAIGNS = [
  { name: 'Summer Health Drive 2025',  type: 'Promotional', leads: 5, purchased: 2 },
  { name: 'Renewal Reminder Q2',       type: 'Renewal',     leads: 4, purchased: 2 },
  { name: 'Motor Insurance Awareness', type: 'Awareness',   leads: 3, purchased: 1 },
]
// Customers with purchased policies (CRM leads 1,6,9,11,14 assigned to Ravi)
const SALES_RECENT_CUSTOMERS = [
  { name: 'Aarav Sharma',  policy: 'Star Comprehensive Health', status: 'Active',  renewal: '10/04/2026' },
  { name: 'Divya Nair',    policy: 'Bajaj Allianz Health Guard', status: 'Active',  renewal: '01/05/2026' },
  { name: 'Vikram Rao',    policy: 'HDFC ERGO Optima Secure',   status: 'Active',  renewal: '03/05/2026' },
  { name: 'Rahul Gupta',   policy: 'Star Comprehensive Health', status: 'Active',  renewal: '22/03/2026' },
  { name: 'Kavita Pillai', policy: 'Bajaj Allianz Comprehensive', status: 'Renewal', renewal: '28/04/2025' },
]

// ── Calling agent (Pooja Desai) data ─────────────────────────────────────────
const CALLING_STATS = [
  { label: 'Leads Claimed',    value: '38', sub: '+2 this month',       color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Converted',        value: '27', sub: 'This financial year', color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'Active Campaigns', value: '3',  sub: '7 interested leads',  color: '#0a7ea4', bg: '#e0f4fb' },
]
const CALLING_CAMPAIGNS = [
  { name: 'Summer Health Drive 2025', type: 'Promotional', leads: 5, purchased: 2 },
  { name: 'New Member Onboarding',    type: 'Onboarding',  leads: 8, purchased: 3 },
  { name: 'Festival Season Offer',    type: 'Seasonal',    leads: 5, purchased: 2 },
]
const CALLING_RECENT_CUSTOMERS = [
  { name: 'Aarav Sharma',  policy: 'Star Comprehensive Health', status: 'Active',  renewal: '10/04/2026' },
  { name: 'Priya Mehta',   policy: 'HDFC ERGO Optima Secure',   status: 'Active',  renewal: '11/06/2026' },
  { name: 'Rahul Gupta',   policy: 'Star Comprehensive Health', status: 'Active',  renewal: '22/03/2026' },
  { name: 'Sneha Iyer',    policy: '—',                         status: 'Prospect',renewal: '—'          },
  { name: 'Rohan Verma',   policy: '—',                         status: 'Prospect',renewal: '—'          },
]

const QUICK_ACTIONS = [
  { label: 'Add Customer', path: '/customer/create', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Buy Policy',   path: '/policy/buy',      color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'CRM',          path: '/crm',             color: '#0a7ea4', bg: '#e0f4fb' },
]

export default function AgentPortal() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const isSales     = user?.agentType === 'sales'
  const STATS            = isSales ? SALES_STATS            : CALLING_STATS
  const MY_CAMPAIGNS     = isSales ? SALES_CAMPAIGNS        : CALLING_CAMPAIGNS
  const RECENT_CUSTOMERS = isSales ? SALES_RECENT_CUSTOMERS : CALLING_RECENT_CUSTOMERS
  const custLabel        = isSales ? 'My Customers' : 'My Leads'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome banner */}
      <div className="ap-banner" style={{ background: 'linear-gradient(135deg,#0a7ea4 0%,#065f82 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#bae6fd', marginBottom: 6, fontWeight: 500 }}>Agent Portal</div>
        <div className="ap-banner-title" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Welcome back, {user?.name} 👋</div>
        <div style={{ fontSize: 13.5, color: '#e0f2fe' }}>{user?.company}</div>
      </div>

      {/* Stats */}
      <div className="ap-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
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
          <div className="ap-quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {QUICK_ACTIONS.map(a => (
              <button key={a.label} type="button"
                onClick={() => navigate(a.path)}
                style={{ padding: '10px 16px', borderRadius: 8, border: `1.5px solid ${a.color}33`, background: a.bg, color: a.color, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ap-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* My Customers / Leads */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{custLabel}</div>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => navigate('/customer')}>View All</button>
            </div>

            {/* Mobile cards */}
            <div className="ap-cust-cards">
              {RECENT_CUSTOMERS.map(c => (
                <div key={c.name} style={{ padding: '11px 13px', border: '1px solid #e8e4f0', borderRadius: 10, background: '#faf9fc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</span>
                    <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: c.status === 'Active' ? '#e6f4ea' : c.status === 'Renewal' ? '#fff3e0' : '#f1f3f4', color: c.status === 'Active' ? '#2d7d46' : c.status === 'Renewal' ? '#a05c00' : '#5f6368' }}>
                      {c.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9d94b8' }}>{c.policy}</div>
                  {c.renewal !== '—' && (
                    <div style={{ fontSize: 11.5, color: '#9d94b8', marginTop: 2 }}>Renewal: {c.renewal}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="ap-cust-table table-wrap">
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr><th>Name</th><th>Policy</th><th>Renewal</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {RECENT_CUSTOMERS.map(c => (
                    <tr key={c.name}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td style={{ color: '#9d94b8', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.policy}</td>
                      <td>{c.renewal}</td>
                      <td>
                        <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: c.status === 'Active' ? '#e6f4ea' : c.status === 'Renewal' ? '#fff3e0' : '#f1f3f4', color: c.status === 'Active' ? '#2d7d46' : c.status === 'Renewal' ? '#a05c00' : '#5f6368' }}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Assigned Campaigns */}
        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>My Campaigns</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MY_CAMPAIGNS.map(c => (
                <div key={c.name} style={{ padding: '12px 14px', border: '1px solid #e8e4f0', borderRadius: 10, background: '#faf9fc' }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 6 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: '#9d94b8' }}>{c.type}</span>
                    <span style={{ color: '#0a7ea4', fontWeight: 500 }}>{c.leads} Leads</span>
                    <span style={{ color: '#2d7d46', fontWeight: 500 }}>{c.purchased} Purchased</span>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px', marginTop: 12 }} onClick={() => navigate('/crm')}>Open CRM →</button>
          </div>
        </div>

      </div>
    </div>
  )
}
