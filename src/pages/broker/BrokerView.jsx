import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const MOCK_DATA = {
  1: {
    brokerName: 'Rahul Mehta', companyName: 'Mehta Insurance', brokerType: 'Individual',
    licenseNumber: 'IRDAI-2023-001', licenseValidity: '2026-12-31', gstNumber: '27ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F', aadhaarNumber: '1234 5678 9012', kycStatus: 'Verified',
    email: 'rahul@mehtains.com', mobile: '+91 98765 43210', alternateContact: '+91 87654 32109', website: 'https://mehtains.com',
    registeredAddress: '201, Mehta House, Andheri West', communicationAddress: '201, Mehta House, Andheri West',
    city: 'Mumbai', state: 'Maharashtra', pincode: '400058',
    accountHolder: 'Rahul Mehta', bankName: 'HDFC Bank', accountNumber: '50100XXXXXXXXXX', ifscCode: 'HDFC0001234',
    agreementStart: '2023-01-01', agreementEnd: '2025-12-31', complianceNotes: 'All documents verified.', status: 'Active',
  },
}

const tabs = ['Basic Info', 'KYC', 'Contact & Address', 'Bank Details', 'Agreement']

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: 220, flexShrink: 0, fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: 'var(--text)' }}>{value || <span style={{ color: 'var(--text-3)' }}>—</span>}</span>
    </div>
  )
}

export default function BrokerView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const b = MOCK_DATA[id]

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
            <div className="page-title">{b.brokerName}</div>
            <div className="page-subtitle">{b.companyName} · {b.licenseNumber}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/broker/${id}/edit`)}>✏️ Edit</button>
          <button className="btn btn-ghost" onClick={() => navigate('/broker')}>← Back</button>
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
