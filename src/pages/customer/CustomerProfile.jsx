import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCustomers } from '../../context/CustomerContext'

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: 200, flexShrink: 0, fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: 'var(--text)' }}>{value || <span style={{ color: 'var(--text-3)' }}>—</span>}</span>
    </div>
  )
}

const KYC_CONFIG = {
  Verified: { badge: 'badge-green', icon: '✅', label: 'KYC Verified',        desc: 'Your documents have been verified.',                       bannerBg: '#f0fdf4', bannerBorder: '#86efac', textColor: '#166534', descColor: '#15803d' },
  Rejected: { badge: 'badge-red',   icon: '❌', label: 'KYC Rejected',        desc: 'Your documents were rejected. Please re-upload via Edit Profile.', bannerBg: '#fef2f2', bannerBorder: '#fca5a5', textColor: '#991b1b', descColor: '#b91c1c' },
  Pending:  { badge: 'badge-amber', icon: '⏳', label: 'KYC Pending Review',  desc: 'Documents submitted and awaiting verification.',            bannerBg: '#fffbeb', bannerBorder: '#fcd34d', textColor: '#92400e', descColor: '#b45309' },
}

export default function CustomerProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { customers } = useCustomers()

  if (!user) return null

  const contextCustomer = customers.find(c => c.email === user.email)
  const kycStatus = contextCustomer?.kyc ?? 'Pending'
  const kyc = KYC_CONFIG[kycStatus] ?? KYC_CONFIG.Pending

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">👤</div>
          <div>
            <div className="page-title">My Profile</div>
            <div className="page-subtitle">{user.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/profile/edit')}>✏️ Edit</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <span className="badge badge-green">Active</span>
        <span className="badge badge-purple">Customer</span>
        <span className={`badge ${kyc.badge}`}>{kyc.icon} {kycStatus}</span>
      </div>

      {/* KYC Status Banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: kyc.bannerBg, border: `1.5px solid ${kyc.bannerBorder}`,
        borderRadius: 10, padding: '14px 18px', marginBottom: 20,
      }}>
        <span style={{ fontSize: 22 }}>{kyc.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: kyc.textColor }}>{kyc.label}</div>
          <div style={{ fontSize: 13, color: kyc.descColor, marginTop: 3 }}>{kyc.desc}</div>
        </div>
        {kycStatus === 'Rejected' && (
          <button className="btn btn-secondary" style={{ flexShrink: 0 }} onClick={() => navigate('/profile/edit')}>
            Re-upload Documents
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body">
          <Row label="Full Name" value={user.name} />
          <Row label="Email"     value={user.email} />
          <Row label="Mobile"    value={user.phone} />
          <Row label="KYC Status" value={
            <span className={`badge ${kyc.badge}`}>{kyc.icon} {kycStatus}</span>
          } />
        </div>
      </div>
    </div>
  )
}
