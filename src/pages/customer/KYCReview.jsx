import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCustomers } from '../../context/CustomerContext'
import { KYCIcon } from '../../icons'

const doc = (type, params) =>
  `/documents/preview.html?type=${type}&${new URLSearchParams(params)}`

const MOCK_KYC = {
  2: {
    name: 'Rohit Sharma', mobile: '9812000000', email: 'rohit@gmail.com',
    dob: '1990-11-20', gender: 'Male', kycStatus: 'Pending',
    aadhaar: '2345 6789 0123', pan: 'BBBRS2345E',
    address: '45, MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001',
    submittedOn: '2026-05-10',
    aadhaarFile: doc('aadhaar', { name: 'Rohit Sharma', number: '2345 6789 0123', dob: '20/11/1990', gender: 'Male' }),
    panFile:     doc('pan',     { name: 'Rohit Sharma', number: 'BBBRS2345E',     dob: '20/11/1990', gender: 'Male' }),
  },
  11: {
    name: 'Ritu Singh', mobile: '9833221100', email: 'ritu@gmail.com',
    dob: '1996-05-18', gender: 'Female', kycStatus: 'Pending',
    aadhaar: '1234 9876 5432', pan: 'KKKRS1234N',
    address: '12, Raja Park', city: 'Jaipur', state: 'Rajasthan', pincode: '302004',
    submittedOn: '2026-05-15',
    aadhaarFile: doc('aadhaar', { name: 'Ritu Singh', number: '1234 9876 5432', dob: '18/05/1996', gender: 'Female' }),
    panFile:     doc('pan',     { name: 'Ritu Singh', number: 'KKKRS1234N',     dob: '18/05/1996', gender: 'Female' }),
  },
}

function fmtDob(dob) {
  if (!dob) return '—'
  const [y, m, d] = dob.split('-')
  return `${d}/${m}/${y}`
}

function InfoRow({ label, value }) {
  return (
    <div style={S.infoRow}>
      <span style={S.infoLabel}>{label}</span>
      <span style={S.infoValue}>{value || '—'}</span>
    </div>
  )
}

function DocCard({ title, docUrl, number, submittedOn }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={S.docCard}>
      <div style={S.docCardHead}>
        <span style={S.docCardTitle}>{title}</span>
        <span style={S.docNumber}>{number}</span>
      </div>
      <div style={S.docFrame}>
        {docUrl
          ? <iframe src={docUrl} style={S.iframe} title={title} />
          : <div style={S.docPlaceholder}>No document uploaded</div>
        }
      </div>
      <div style={S.docMeta}>
        <span style={S.docMetaText}>Submitted: {submittedOn}</span>
        {docUrl && (
          <a href={docUrl} target="_blank" rel="noreferrer" style={S.docLink}>
            Open full view ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function KYCReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cust = MOCK_KYC[id]

  const { updateKycStatus } = useCustomers()
  const [action, setAction]       = useState(null) // 'approve' | 'reject' | 'done'
  const [rejectReason, setRejectReason] = useState('')
  const [doneAction, setDoneAction]     = useState(null)

  if (!cust) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>KYC record not found</div>
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigate('/customer')}>
          ← Back to Customers
        </button>
      </div>
    )
  }

  const handleApprove = () => {
    updateKycStatus(id, 'Verified')
    setDoneAction('approved')
    setAction('done')
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    updateKycStatus(id, 'Rejected')
    setDoneAction('rejected')
    setAction('done')
  }

  if (action === 'done') {
    const approved = doneAction === 'approved'
    return (
      <div style={S.doneWrap}>
        <div style={S.doneCard}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{approved ? '✅' : '❌'}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: approved ? '#166534' : '#991b1b', marginBottom: 8 }}>
            KYC {approved ? 'Approved' : 'Rejected'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 6 }}>
            {cust.name}'s KYC has been {approved ? 'approved successfully.' : 'rejected.'}
          </div>
          {!approved && rejectReason && (
            <div style={S.rejectNote}>
              Reason: {rejectReason}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/customer')}>
              ← Back to Customers
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(`/customer/${id}/360`)}>
              View 360°
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><KYCIcon /></div>
          <div>
            <div className="page-title">KYC Review</div>
            <div className="page-subtitle">{cust.name} · Submitted {cust.submittedOn}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/customer/${id}/360`)}>360° View</button>
          <button className="btn btn-ghost" onClick={() => navigate('/customer')}>← Back</button>
        </div>
      </div>

      {/* KYC Status banner */}
      <div style={S.pendingBanner}>
        <span style={{ fontSize: 18 }}>⏳</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#92400e' }}>KYC Pending Review</div>
          <div style={{ fontSize: 13.5, color: '#b45309', marginTop: 2 }}>
            Review the documents below and approve or reject the KYC for {cust.name}.
          </div>
        </div>
      </div>

      {/* Documents */}
      <div style={S.sectionTitle}>📄 Uploaded Documents</div>
      <div className="kyc-doc-grid" style={S.docGrid}>
        <DocCard
          title="Aadhaar Card"
          docUrl={cust.aadhaarFile}
          number={cust.aadhaar}
          submittedOn={cust.submittedOn}
        />
        <DocCard
          title="PAN Card"
          docUrl={cust.panFile}
          number={cust.pan}
          submittedOn={cust.submittedOn}
        />
      </div>

      {/* Basic Information */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-body">
          <div style={S.cardSectionTitle}>👤 Basic Information</div>
          <div style={S.infoGrid}>
            <InfoRow label="Full Name"   value={cust.name} />
            <InfoRow label="Mobile"      value={cust.mobile} />
            <InfoRow label="Email"       value={cust.email} />
            <InfoRow label="Date of Birth" value={fmtDob(cust.dob)} />
            <InfoRow label="Gender"      value={cust.gender} />
            <InfoRow label="Aadhaar No." value={cust.aadhaar} />
            <InfoRow label="PAN No."     value={cust.pan} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-body">
          <div style={S.cardSectionTitle}>📍 Address Details</div>
          <div style={S.infoGrid}>
            <InfoRow label="Address" value={cust.address} />
            <InfoRow label="City"    value={cust.city} />
            <InfoRow label="State"   value={cust.state} />
            <InfoRow label="Pincode" value={cust.pincode} />
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-body">
          <div style={S.cardSectionTitle}>⚖️ KYC Decision</div>

          {action === 'reject' ? (
            <div style={S.rejectPanel}>
              <label style={S.rejectLabel}>Reason for rejection</label>
              <textarea
                style={S.rejectTextarea}
                rows={3}
                placeholder="e.g. Address mismatch, blurry document, name mismatch…"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn btn-ghost" onClick={() => setAction(null)}>Cancel</button>
                <button
                  className="btn btn-danger"
                  disabled={!rejectReason.trim()}
                  onClick={handleReject}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            <div style={S.actionRow}>
              <div style={{ fontSize: 13.5, color: 'var(--text-3)', flex: 1 }}>
                Carefully review the uploaded documents and customer details before making a decision.
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="btn btn-danger"
                  onClick={() => setAction('reject')}
                >
                  ✕ Reject KYC
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleApprove}
                >
                  ✓ Approve KYC
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const S = {
  pendingBanner: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: 10,
    padding: '14px 18px', marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 600, color: 'var(--text-1)',
    marginBottom: 12, marginTop: 4,
  },
  docGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
  },
  docCard: {
    background: '#fff', border: '1.5px solid #e8e4f0', borderRadius: 12,
    overflow: 'hidden',
  },
  docCardHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderBottom: '1px solid #f0edf8',
    background: '#faf9fc',
  },
  docCardTitle: { fontSize: 13.5, fontWeight: 600, color: 'var(--text-1)' },
  docNumber:    { fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace' },
  docFrame:     { height: 240, background: '#f5f3ff', overflow: 'hidden' },
  iframe:       { width: '100%', height: '100%', border: 'none', display: 'block' },
  docPlaceholder: {
    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--text-3)', fontSize: 13,
  },
  docMeta: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderTop: '1px solid #f0edf8', background: '#faf9fc',
  },
  docMetaText: { fontSize: 12, color: 'var(--text-3)' },
  docLink:     { fontSize: 12, color: '#7c3aed', textDecoration: 'none' },
  cardSectionTitle: {
    fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 16,
  },
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 0',
  },
  infoRow: {
    display: 'flex', flexDirection: 'column', gap: 2,
    padding: '10px 0', borderBottom: '1px solid #f0edf8',
  },
  infoLabel: { fontSize: 13, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' },
  infoValue: { fontSize: 14, color: 'var(--text-1)', fontWeight: 500 },
  actionRow: {
    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
  },
  rejectPanel: {
    background: '#fff7f7', border: '1.5px solid #fecaca', borderRadius: 8, padding: 16,
  },
  rejectLabel: { fontSize: 13, fontWeight: 600, color: '#991b1b', display: 'block', marginBottom: 8 },
  rejectTextarea: {
    width: '100%', border: '1.5px solid #fca5a5', borderRadius: 8, padding: '10px 12px',
    fontSize: 13.5, fontFamily: 'inherit', color: '#1a1628', resize: 'vertical',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  },
  rejectNote: {
    marginTop: 12, background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#991b1b',
  },
  doneWrap: {
    minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  doneCard: {
    background: '#fff', border: '1.5px solid #e8e4f0', borderRadius: 16,
    padding: '48px 40px', textAlign: 'center', maxWidth: 420, width: '100%',
    boxShadow: '0 4px 24px rgba(100,80,160,.08)',
  },
}
