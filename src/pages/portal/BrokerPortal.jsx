import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STATS = [
  { label: 'Total Agents',      value: '12',      sub: '9 active',           color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Total Customers',   value: '248',     sub: '+14 this month',     color: '#0a7ea4', bg: '#e0f4fb' },
  { label: 'Policies Issued',   value: '183',     sub: 'This financial year', color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'Premium Collected', value: '₹24.5L',  sub: 'April 2025',         color: '#a05c00', bg: '#fff3e0' },
]

const RECENT_AGENTS = [
  { name: 'Ravi Kulkarni',  license: 'POS-2023-001', broker: 'Mehta Insurance',   customers: 28, status: 'Active'   },
  { name: 'Pooja Desai',    license: 'POS-2023-019', broker: 'Priya Brokers',     customers: 19, status: 'Active'   },
  { name: 'Kavita Sharma',  license: 'POS-2023-045', broker: 'Shah Financial',    customers: 34, status: 'Active'   },
  { name: 'Amit Verma',     license: 'POS-2023-067', broker: 'Mehta Insurance',   customers: 22, status: 'Active'   },
  { name: 'Suresh Nair',    license: 'POS-2022-087', broker: 'AK Associates',     customers: 11, status: 'Inactive' },
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

export default function BrokerPortal() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome banner */}
      <div className="bd-banner" style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#4f1d96 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#c4b5fd', marginBottom: 6, fontWeight: 500 }}>Broker Portal</div>
        <div className="bd-banner-title" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Welcome back, {user?.name} 👋</div>
        <div style={{ fontSize: 13.5, color: '#ddd6fe' }}>{user?.company} &nbsp;·&nbsp; IRDAI {user?.irdaiNo}</div>
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

            {/* Mobile cards */}
            <div className="bd-agent-cards">
              {RECENT_AGENTS.map(a => (
                <div key={a.name} style={{ padding: '11px 13px', border: '1px solid #e8e4f0', borderRadius: 10, background: '#faf9fc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{a.name}</span>
                    <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, background: a.status === 'Active' ? '#e6f4ea' : '#f1f3f4', color: a.status === 'Active' ? '#2d7d46' : '#5f6368' }}>
                      {a.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#9d94b8' }}>
                    {a.license} &nbsp;·&nbsp; {a.customers} customers
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
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
                    <span>Type: {c.type}</span>
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
