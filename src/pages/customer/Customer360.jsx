import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TYPE_ICON } from './FamilyMembersSection'

function calcAge(dob) {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
}

const MOCK = {
  1: {
    name: 'Anita Desai', mobile: '9876543210', email: 'anita@gmail.com',
    dob: '1985-04-12', gender: 'Female', city: 'Mumbai', state: 'Maharashtra',
    kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse',   name: 'Ravi Desai',  dob: '1982-06-15', gender: 'Male',   preExisting: '' },
      { id: 2, type: 'Son',      name: 'Aarav Desai', dob: '2010-03-20', gender: 'Male',   preExisting: '' },
      { id: 3, type: 'Daughter', name: 'Piya Desai',  dob: '2013-08-05', gender: 'Female', preExisting: 'Asthma' },
    ],
    policies: [
      { id: 'POL-2024-001', type: 'Health',  ic: 'Star Health', premium: 12500, status: 'Active',  expiry: '2025-03-31' },
      { id: 'POL-2023-088', type: 'Motor',   ic: 'HDFC ERGO',   premium: 8200,  status: 'Expired', expiry: '2024-01-15' },
    ],
    payments: [
      { date: '2024-03-15', amount: 12500, mode: 'UPI',  txnId: 'TXN9876543', status: 'Success' },
      { date: '2023-01-10', amount: 8200,  mode: 'NEFT', txnId: 'TXN1234567', status: 'Success' },
    ],
    interactions: [
      { date: '2024-04-01', type: 'Call',  note: 'Customer enquired about renewal. Explained benefits.' },
      { date: '2024-02-14', type: 'Email', note: 'Sent policy renewal reminder.' },
      { date: '2023-12-20', type: 'SMS',   note: 'Sent year-end summary.' },
    ],
  },
}

const TABS = ['Policies', 'Payments', 'Interactions', 'Family']

export default function Customer360() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const c = MOCK[id]

  if (!c) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <div>Customer not found</div>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/customer')}>Back</button>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">👥</div>
          <div>
            <div className="page-title">{c.name}</div>
            <div className="page-subtitle">{c.mobile} · {c.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/customer/${id}/edit`)}>✏️ Edit</button>
          <button className="btn btn-ghost"     onClick={() => navigate('/customer')}>← Back</button>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'KYC Status',   value: c.kyc,                   cls: c.kyc === 'Verified' ? 'badge-green' : 'badge-amber' },
          { label: 'City',         value: c.city,                   cls: 'badge-blue' },
          { label: 'Gender',       value: c.gender,                 cls: 'badge-purple' },
          { label: 'Total Policies', value: `${c.policies.length} policies`, cls: 'badge-purple' },
        ].map(s => (
          <span key={s.label} className={`badge ${s.cls}`}>{s.label}: {s.value}</span>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-sm">🔄 Renew Policy</button>
        <button className="btn btn-secondary btn-sm">📋 Endorsement</button>
        <button className="btn btn-secondary btn-sm">⏰ Send Reminder</button>
        <button className="btn btn-ghost btn-sm">📞 Call Customer</button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs" style={{ padding: '0 22px' }}>
          {TABS.map((t, i) => (
            <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        <div className="card-body">
          {/* Policies */}
          {tab === 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Policy ID</th><th>Type</th><th>IC</th><th>Premium</th><th>Status</th><th>Expiry</th></tr>
                </thead>
                <tbody>
                  {c.policies.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12.5 }}>{p.id}</td>
                      <td><span className={`badge ${p.type === 'Health' ? 'badge-green' : 'badge-blue'}`}>{p.type}</span></td>
                      <td>{p.ic}</td>
                      <td style={{ fontWeight: 500 }}>₹{p.premium.toLocaleString('en-IN')}</td>
                      <td><span className={`badge ${p.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                      <td>{p.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payments */}
          {tab === 1 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Date</th><th>Amount</th><th>Mode</th><th>Txn ID</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {c.payments.map(p => (
                    <tr key={p.txnId}>
                      <td>{p.date}</td>
                      <td style={{ fontWeight: 500 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                      <td><span className="badge badge-blue">{p.mode}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12.5 }}>{p.txnId}</td>
                      <td><span className={`badge ${p.status === 'Success' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Interaction history */}
          {tab === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {c.interactions.map((i, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: idx < c.interactions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {i.type === 'Call' ? '📞' : i.type === 'Email' ? '✉️' : '💬'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span className="badge badge-purple">{i.type}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{i.date}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--text)' }}>{i.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Family Members */}
          {tab === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.familyMembers?.length > 0 ? c.familyMembers.map(m => {
                const age = calcAge(m.dob)
                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: '#fff' }}>
                    <div style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff', borderRadius: 10, fontSize: 22, flexShrink: 0 }}>
                      {TYPE_ICON[m.type] ?? '👤'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                        {m.type}{m.gender ? ` · ${m.gender}` : ''}{age !== null ? ` · Age: ${age} yrs` : ''}{m.dob ? ` (${m.dob})` : ''}
                        {m.preExisting ? <span style={{ color: '#d97706', marginLeft: 6 }}>⚠ {m.preExisting}</span> : null}
                      </div>
                    </div>
                    <span className="badge badge-purple" style={{ flexShrink: 0 }}>{m.type}</span>
                  </div>
                )
              }) : (
                <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13.5 }}>
                  No family members recorded for this customer.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
