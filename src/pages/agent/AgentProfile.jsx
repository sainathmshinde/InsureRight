import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
          <div className="page-icon">👤</div>
          <div>
            <div className="page-title">My Profile</div>
            <div className="page-subtitle">{user.company} · {user.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/profile/edit')}>✏️ Edit</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <span className="badge badge-green">Active</span>
        <span className="badge badge-purple">Agent</span>
      </div>

      <div className="card">
        <div className="card-body">
          <Row label="Full Name"       value={user.name} />
          <Row label="Email"           value={user.email} />
          <Row label="Mobile"          value={user.phone} />
          <Row label="Broker / Firm"   value={user.company} />
        </div>
      </div>
    </div>
  )
}
