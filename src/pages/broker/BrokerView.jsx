import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BROKER_MAP } from './brokerData'

const tabs = ['Basic Info', 'KYC', 'Contact & Address', 'Bank Details', 'Agreement']

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: 220, flexShrink: 0, fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: 'var(--text)' }}>{value || <span style={{ color: 'var(--text-3)' }}>—</span>}</span>
    </div>
  )
}

function userToBroker(u) {
  if (!u) return null
  return {
    brokerName: u.name, companyName: u.company, brokerType: u.type || 'Partnership',
    licenseNumber: u.irdaiNo, licenseValidity: '', gstNumber: u.gst || '',
    panNumber: u.pan || '', aadhaarNumber: '', kycStatus: 'Verified',
    email: u.email, mobile: u.phone, alternateContact: '', website: '',
    registeredAddress: u.address || '', communicationAddress: u.address || '',
    city: u.city || '', state: u.state || '', pincode: '',
    accountHolder: u.name, bankName: '', accountNumber: '', ifscCode: '',
    agreementStart: '', agreementEnd: '', complianceNotes: '', status: 'Active',
  }
}

export default function BrokerView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tab, setTab] = useState(0)

  const isProfile = !id
  const b = isProfile ? userToBroker(user) : BROKER_MAP[Number(id)]

  if (!b) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <div>Broker not found</div>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/broker')}>Back to list</button>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">🏢</div>
          <div>
            <div className="page-title">{isProfile ? 'My Profile' : b.brokerName}</div>
            <div className="page-subtitle">{b.companyName} · {b.licenseNumber}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate(isProfile ? '/profile/edit' : `/broker/${id}/edit`)}>✏️ Edit</button>
          <button className="btn btn-ghost" onClick={() => navigate(isProfile ? '/dashboard' : '/broker')}>← Back</button>
        </div>
      </div>

      {/* Status strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <span className={`badge ${b.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{b.status}</span>
        <span className={`badge ${b.kycStatus === 'Verified' ? 'badge-green' : b.kycStatus === 'Pending' ? 'badge-amber' : 'badge-red'}`}>KYC: {b.kycStatus}</span>
        <span className="badge badge-purple">{b.brokerType}</span>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs" style={{ padding: '0 22px' }}>
          {tabs.map((t, i) => (
            <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        <div className="card-body">
          {tab === 0 && (
            <div>
              <Row label="Broker Name"        value={b.brokerName} />
              <Row label="Company Name"       value={b.companyName} />
              <Row label="Broker Type"        value={b.brokerType} />
              <Row label="IRDAI License No."  value={b.licenseNumber} />
              <Row label="License Validity"   value={b.licenseValidity} />
              <Row label="GST Number"         value={b.gstNumber} />
            </div>
          )}
          {tab === 1 && (
            <div>
              <Row label="PAN Number"         value={b.panNumber} />
              <Row label="Aadhaar Number"     value={b.aadhaarNumber} />
              <Row label="KYC Status"         value={b.kycStatus} />
            </div>
          )}
          {tab === 2 && (
            <div>
              <Row label="Email"              value={b.email} />
              <Row label="Mobile"             value={b.mobile} />
              <Row label="Alternate Contact"  value={b.alternateContact} />
              <Row label="Website"            value={b.website} />
              <Row label="Registered Address" value={b.registeredAddress} />
              <Row label="Communication Addr" value={b.communicationAddress} />
              <Row label="City"               value={b.city} />
              <Row label="State"              value={b.state} />
              <Row label="Pincode"            value={b.pincode} />
            </div>
          )}
          {tab === 3 && (
            <div>
              <Row label="Account Holder"     value={b.accountHolder} />
              <Row label="Bank Name"          value={b.bankName} />
              <Row label="Account Number"     value={b.accountNumber} />
              <Row label="IFSC Code"          value={b.ifscCode} />
            </div>
          )}
          {tab === 4 && (
            <div>
              <Row label="Agreement Start"    value={b.agreementStart} />
              <Row label="Agreement End"      value={b.agreementEnd} />
              <Row label="Compliance Notes"   value={b.complianceNotes} />
              <Row label="Status"             value={b.status} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
