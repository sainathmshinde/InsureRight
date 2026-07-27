import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useMembers } from '../../context/MemberContext'
import { UserIcon } from '../../icons'
import { TYPE_ICON } from './FamilyMembersSection'
import { MOCK, DOCS, PERSONAL, DocCard } from './Member360'
import { ORGANISATIONS, ASSOCIATIONS } from './orgAssocData'
import { formatDate } from '../../utils/date'

function calcAge(dob) {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
}

const TABS = ['Personal', 'Family', 'Documents', 'Policies', 'Payments', 'Interactions']

const KYC_CONFIG = {
  Verified: { badge: 'badge-green', icon: '✅', label: 'KYC Verified',       bannerBg: '#f0fdf4', bannerBorder: '#86efac', textColor: '#166534', descColor: '#15803d', desc: 'Your documents have been verified.' },
  Rejected: { badge: 'badge-red',   icon: '❌', label: 'KYC Rejected',       bannerBg: '#fef2f2', bannerBorder: '#fca5a5', textColor: '#991b1b', descColor: '#b91c1c', desc: 'Your documents were rejected. Please re-upload via Edit Profile.' },
  Pending:  { badge: 'badge-amber', icon: '⏳', label: 'KYC Pending Review', bannerBg: '#fffbeb', bannerBorder: '#fcd34d', textColor: '#92400e', descColor: '#b45309', desc: 'Documents submitted and awaiting verification.' },
}

export default function MemberProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { members } = useMembers()
  const [tab, setTab] = useState(0)

  if (!user) return null

  const contextMember = members.find(c => c.email === user.email)
  const kycStatus = contextMember?.kyc ?? 'Pending'
  const kyc = KYC_CONFIG[kycStatus] ?? KYC_CONFIG.Pending

  // Find matching Member 360 data by name
  const mockId = Object.keys(MOCK).find(k => MOCK[k].name === user.name)
  const c = mockId ? MOCK[mockId] : null

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><UserIcon /></div>
          <div>
            <div className="page-title">{user.name}</div>
            <div className="page-subtitle">{user.phone} · {user.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-sm" onClick={() => navigate('/profile/edit')} style={{ color: '#6d28d9', border: '1.5px solid #7c3aed', background: '#faf5ff', fontWeight: 700 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            Edit
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </div>

      {/* Summary badges */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <span className={`badge ${kyc.badge}`}>{kyc.icon} KYC: {kycStatus}</span>
        {user.city   && <span className="badge badge-blue">{user.city}</span>}
        {user.gender && <span className="badge badge-purple">{user.gender}</span>}
        {c && <span className="badge badge-purple">{c.policies.length} policies</span>}
      </div>

      {/* KYC Banner */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, background:kyc.bannerBg, border:`1.5px solid ${kyc.bannerBorder}`, borderRadius:10, padding:'14px 18px', marginBottom:20 }}>
        <span style={{ fontSize:22 }}>{kyc.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:14, color:kyc.textColor }}>{kyc.label}</div>
          <div style={{ fontSize:13, color:kyc.descColor, marginTop:3 }}>{kyc.desc}</div>
        </div>
        {kycStatus === 'Rejected' && (
          <button className="btn btn-secondary" style={{ flexShrink:0 }} onClick={() => navigate('/profile/edit')}>Re-upload Documents</button>
        )}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs" style={{ padding: '0 22px' }}>
          {TABS.map((t, i) => (
            <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        <div className="card-body">
          {/* Personal */}
          {tab === 0 && (() => {
            const nameParts = (c?.name ?? user.name).split(' ')
            const firstName = nameParts[0]
            const lastName = nameParts.slice(1).join(' ')
            const personal = mockId ? PERSONAL[Number(mockId)] : null
            const org = ORGANISATIONS.find(o => o.id === personal?.organisationId)
            const assoc = ASSOCIATIONS.find(a => a.id === personal?.associationId)
            const Row = ({ label, value }) => (
              <div style={{ display:'flex', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ width:220, flexShrink:0, fontSize:13, color:'var(--text-2)', fontWeight:500 }}>{label}</span>
                <span style={{ fontSize:13.5, color:'var(--text)' }}>{value || <span style={{ color:'var(--text-3)' }}>—</span>}</span>
              </div>
            )
            return (
              <div>
                <Row label="First Name"      value={firstName} />
                <Row label="Last Name"       value={lastName} />
                <Row label="EMP ID / PF No." value={personal?.empId} />
                <Row label="Mobile"          value={c?.mobile ?? user.phone} />
                <Row label="Email"           value={c?.email ?? user.email} />
                <Row label="Date of Birth"   value={c?.dob ?? user.dob} />
                <Row label="Gender"          value={c?.gender ?? user.gender} />
                <Row label="Organisation"    value={org?.name} />
                <Row label="Association"     value={assoc?.name} />
                <Row label="Address"         value={personal?.address} />
              </div>
            )
          })()}

          {/* Family Members */}
          {tab === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {c?.familyMembers?.length > 0 ? c.familyMembers.map(m => {
                const age = calcAge(m.dob)
                return (
                  <div key={m.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', border:'1px solid var(--border)', borderRadius:'var(--r-md)', background:'#fff' }}>
                    <div style={{ width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f3ff', borderRadius:10, fontSize:22, flexShrink:0 }}>
                      {TYPE_ICON[m.type] ?? '👤'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:13.5, color:'var(--text)' }}>{m.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2 }}>
                        {m.type}{m.gender ? ` · ${m.gender}` : ''}{age !== null ? ` · Age: ${age} yrs` : ''}{m.dob ? ` (${formatDate(m.dob)})` : ''}
                        {m.preExisting ? <span style={{ color:'#d97706', marginLeft:6 }}>⚠ {m.preExisting}</span> : null}
                      </div>
                    </div>
                    <span className="badge badge-purple" style={{ flexShrink:0 }}>{m.type}</span>
                  </div>
                )
              }) : (
                <div style={{ padding:'32px 0', textAlign:'center', color:'var(--text-3)', fontSize:13.5 }}>
                  No family members recorded.
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {tab === 2 && (() => {
            const docs = mockId ? DOCS[Number(mockId)] : null
            if (!docs) return <div style={{ padding:'32px 0', textAlign:'center', color:'var(--text-3)' }}>No documents found.</div>
            return (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:20 }}>
                  {docs.aadhaar
                    ? <DocCard type="aadhaar" data={docs.aadhaar} memberName={user.name} />
                    : (
                      <div style={{ border:'1.5px dashed var(--border)', borderRadius:'var(--r-lg)', padding:'40px 24px', textAlign:'center', color:'var(--text-3)' }}>
                        <div style={{ fontSize:36, marginBottom:10 }}>🪪</div>
                        <div style={{ fontWeight:600, marginBottom:4 }}>Aadhaar not uploaded</div>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop:12 }}>Upload Aadhaar</button>
                      </div>
                    )
                  }
                  {docs.pan
                    ? <DocCard type="pan" data={docs.pan} memberName={user.name} />
                    : (
                      <div style={{ border:'1.5px dashed var(--border)', borderRadius:'var(--r-lg)', padding:'40px 24px', textAlign:'center', color:'var(--text-3)' }}>
                        <div style={{ fontSize:36, marginBottom:10 }}>💳</div>
                        <div style={{ fontWeight:600, marginBottom:4 }}>PAN not uploaded</div>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop:12 }}>Upload PAN</button>
                      </div>
                    )
                  }
                </div>
                {kycStatus === 'Rejected' && (
                  <div style={{ marginTop:18, display:'flex', gap:10, padding:'12px 16px', background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:'var(--r-md)' }}>
                    <span>🚫</span>
                    <div style={{ fontSize:13, color:'#b91c1c' }}>One or more documents have been rejected. Please resubmit correct documents to complete KYC.</div>
                  </div>
                )}
                {kycStatus === 'Pending' && (
                  <div style={{ marginTop:18, display:'flex', gap:10, padding:'12px 16px', background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:'var(--r-md)' }}>
                    <span>⚠️</span>
                    <div style={{ fontSize:13, color:'#92400e' }}>Documents are uploaded and pending verification.</div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Policies */}
          {tab === 3 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Policy ID</th><th>Type</th><th>IC</th><th>Premium</th><th>Status</th><th>Expiry</th></tr>
                </thead>
                <tbody>
                  {c?.policies?.length > 0 ? c.policies.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontFamily:'monospace', fontSize:12.5 }}>{p.id}</td>
                      <td><span className={`badge ${p.type === 'Health' ? 'badge-green' : 'badge-blue'}`}>{p.type}</span></td>
                      <td>{p.ic}</td>
                      <td style={{ fontWeight:500 }}>₹{p.premium.toLocaleString('en-IN')}</td>
                      <td><span className={`badge ${p.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                      <td>{p.expiry}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-3)', padding:'32px 0' }}>No policies found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Payments */}
          {tab === 4 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Date</th><th>Amount</th><th>Mode</th><th>Txn ID</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {c?.payments?.length > 0 ? c.payments.map(p => (
                    <tr key={p.txnId}>
                      <td>{formatDate(p.date)}</td>
                      <td style={{ fontWeight:500 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                      <td><span className="badge badge-blue">{p.mode}</span></td>
                      <td style={{ fontFamily:'monospace', fontSize:12.5 }}>{p.txnId}</td>
                      <td><span className={`badge ${p.status === 'Success' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text-3)', padding:'32px 0' }}>No payments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Interactions */}
          {tab === 5 && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {c?.interactions?.length > 0 ? c.interactions.map((i, idx) => (
                <div key={idx} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom: idx < c.interactions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--brand-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                    {i.type === 'Call' ? '📞' : i.type === 'Email' ? '✉️' : '💬'}
                  </div>
                  <div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                      <span className="badge badge-purple">{i.type}</span>
                      <span style={{ fontSize:12, color:'var(--text-3)' }}>{formatDate(i.date)}</span>
                    </div>
                    <div style={{ fontSize:13.5, color:'var(--text)' }}>{i.note}</div>
                  </div>
                </div>
              )) : (
                <div style={{ padding:'32px 0', textAlign:'center', color:'var(--text-3)', fontSize:13.5 }}>No interactions recorded.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
