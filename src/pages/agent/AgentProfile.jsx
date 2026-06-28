import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AgentIcon } from '../../icons'

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: 200, flexShrink: 0, fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: 'var(--text)' }}>{value || <span style={{ color: 'var(--text-3)' }}>—</span>}</span>
    </div>
  )
}

export default function AgentProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!user) return null

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><AgentIcon /></div>
          <div>
            <div className="page-title">My Profile</div>
            <div className="page-subtitle">{user.company} · {user.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-sm" onClick={() => navigate('/profile/edit')} style={{ color: '#6d28d9', border: '1.5px solid #7c3aed', background: '#faf5ff', fontWeight: 700 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>Edit</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <span className="badge badge-green">Active</span>
        <span className="badge badge-purple">Operator</span>
      </div>

      <div className="card">
        <div className="card-body">
          <Row label="Full Name"       value={user.name} />
          <Row label="Email"           value={user.email} />
          <Row label="Mobile"          value={user.phone} />
          <Row label="Operator Type"      value={user.agentType ? user.agentType.charAt(0).toUpperCase() + user.agentType.slice(1) : null} />

        </div>
      </div>
    </div>
  )
}
