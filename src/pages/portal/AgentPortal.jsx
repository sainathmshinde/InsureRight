import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STATS = [
  { label: 'My Customers',      value: '38',      sub: '+2 this month',       color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Policies Issued',   value: '27',      sub: 'This financial year',  color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'Commission Earned', value: '₹14,200', sub: 'April 2025',          color: '#a05c00', bg: '#fff3e0' },
  { label: 'CRM Leads',         value: '18',      sub: '7 interested',        color: '#0a7ea4', bg: '#e0f4fb' },
]

const MY_CAMPAIGNS = [
  { name: 'Summer Health Drive 2025', type: 'Promotional', leads: 5,  purchased: 2 },
  { name: 'New Member Onboarding',    type: 'Onboarding',  leads: 8,  purchased: 3 },
  { name: 'Festival Season Offer',    type: 'Seasonal',    leads: 5,  purchased: 2 },
]

const RECENT_CUSTOMERS = [
  { name: 'Aarav Sharma',   policy: 'Star Comprehensive Health', status: 'Active',  renewal: '10/04/2026' },
  { name: 'Priya Mehta',    policy: 'HDFC ERGO Optima',          status: 'Active',  renewal: '11/06/2026' },
  { name: 'Rahul Gupta',    policy: 'LIC Jeevan Anand',          status: 'Active',  renewal: '22/03/2026' },
  { name: 'Meera Joshi',    policy: 'Bajaj Allianz Motor',        status: 'Renewal', renewal: '15/05/2025' },
  { name: 'Karan Patel',    policy: 'New India Motor',            status: 'Active',  renewal: '13/09/2026' },
]

const QUICK_ACTIONS = [
  { label: 'Add Customer', path: '/customer/create', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Buy Policy',   path: '/policy/buy',      color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'CRM',          path: '/crm',             color: '#0a7ea4', bg: '#e0f4fb' },
  { label: 'Commission',   path: '/agent/commission',color: '#a05c00', bg: '#fff3e0' },
]

export default function AgentPortal() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg,#0a7ea4 0%,#065f82 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#bae6fd', marginBottom: 6, fontWeight: 500 }}>Agent Portal</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Welcome back, {user?.name} 👋</div>
        <div style={{ fontSize: 13.5, color: '#e0f2fe' }}>{user?.company}</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
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
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {QUICK_ACTIONS.map(a => (
              <button key={a.label} type="button"
                onClick={() => navigate(a.path)}
                style={{ padding: '10px 22px', borderRadius: 8, border: `1.5px solid ${a.color}33`, background: a.bg, color: a.color, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* My Customers */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>My Customers</div>
              <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => navigate('/customer')}>View All</button>
            </div>
            <div className="table-wrap">
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
                        <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: c.status === 'Active' ? '#e6f4ea' : '#fff3e0', color: c.status === 'Active' ? '#2d7d46' : '#a05c00' }}>
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
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
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
