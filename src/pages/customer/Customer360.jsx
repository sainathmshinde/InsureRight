import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TYPE_ICON } from './FamilyMembersSection'

function calcAge(dob) {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
}

const MOCK = {
  1: {
    name: 'Aarav Sharma', mobile: '9876543210', email: 'aarav@gmail.com',
    dob: '1990-03-15', gender: 'Male', city: 'Mumbai', state: 'Maharashtra', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse',   name: 'Priya Sharma', dob: '1992-07-22', gender: 'Female', preExisting: '' },
      { id: 2, type: 'Son',      name: 'Aryan Sharma', dob: '2016-02-10', gender: 'Male',   preExisting: '' },
      { id: 3, type: 'Daughter', name: 'Aanya Sharma', dob: '2019-09-05', gender: 'Female', preExisting: '' },
    ],
    policies: [
      { id: 'POL-2025-001', type: 'Health', ic: 'Star Health',   premium: 8500, status: 'Active',      expiry: '2026-04-10' },
      { id: 'POL-2025-002', type: 'Motor',  ic: 'Bajaj Allianz', premium: 4800, status: 'Renewal Due', expiry: '2025-05-20' },
    ],
    payments: [
      { date: '2025-04-10', amount: 8500, mode: 'UPI',  txnId: 'TXN8765432', status: 'Success' },
      { date: '2025-05-18', amount: 4800, mode: 'NEFT', txnId: 'TXN8765433', status: 'Success' },
    ],
    interactions: [
      { date: '2025-04-18', type: 'Call',  note: 'Policy issued after CRM lead conversion. Customer very satisfied.' },
      { date: '2025-04-10', type: 'Email', note: 'Policy documents sent to registered email.' },
      { date: '2025-03-20', type: 'Call',  note: 'Discussed plan options. Customer agreed on Star Comprehensive Health.' },
    ],
  },
  2: {
    name: 'Rohit Sharma', mobile: '9812000000', email: 'rohit@gmail.com',
    dob: '1990-11-20', gender: 'Male', city: 'Pune', state: 'Maharashtra', kyc: 'Pending',
    familyMembers: [],
    policies: [],
    payments: [],
    interactions: [
      { date: '2025-04-05', type: 'Call', note: 'Introduced health insurance plans. KYC documents requested.' },
    ],
  },
  3: {
    name: 'Divya Nair', mobile: '9911223344', email: 'divya@gmail.com',
    dob: '1978-06-05', gender: 'Female', city: 'Bangalore', state: 'Karnataka', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse',   name: 'Sandeep Nair', dob: '1975-04-10', gender: 'Male',   preExisting: '' },
      { id: 2, type: 'Son',      name: 'Rohan Nair',   dob: '2005-08-15', gender: 'Male',   preExisting: '' },
      { id: 3, type: 'Daughter', name: 'Ankita Nair',  dob: '2008-11-20', gender: 'Female', preExisting: '' },
    ],
    policies: [
      { id: 'POL-2025-006', type: 'Health', ic: 'Bajaj Allianz', premium: 6490, status: 'Active', expiry: '2026-05-08' },
    ],
    payments: [
      { date: '2025-05-08', amount: 6490, mode: 'UPI', txnId: 'TXN9112233', status: 'Success' },
    ],
    interactions: [
      { date: '2025-05-01', type: 'Call',  note: 'Assigned to sales agent. Finalised family floater health plan.' },
      { date: '2025-04-20', type: 'Email', note: 'Sent brochure for Bajaj Allianz Health Guard family plan.' },
    ],
  },
  4: {
    name: 'Vijay Patil', mobile: '9011223344', email: 'vijay@gmail.com',
    dob: '1995-09-30', gender: 'Male', city: 'Nashik', state: 'Maharashtra', kyc: 'Rejected',
    familyMembers: [],
    policies: [],
    payments: [],
    interactions: [
      { date: '2025-03-10', type: 'Call', note: 'KYC rejected due to address mismatch. Requested fresh documents.' },
    ],
  },
  5: {
    name: 'Suresh Kumar', mobile: '9988001122', email: 'suresh@gmail.com',
    dob: '1985-03-20', gender: 'Male', city: 'Pune', state: 'Maharashtra', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse', name: 'Meena Kumar', dob: '1987-06-12', gender: 'Female', preExisting: '' },
      { id: 2, type: 'Son',    name: 'Aryan Kumar', dob: '2014-03-05', gender: 'Male',   preExisting: '' },
    ],
    policies: [
      { id: 'POL-2025-013', type: 'Health', ic: 'Star Health', premium: 10030, status: 'Active', expiry: '2026-04-20' },
    ],
    payments: [
      { date: '2025-04-20', amount: 10030, mode: 'Card', txnId: 'TXN9988001', status: 'Success' },
    ],
    interactions: [
      { date: '2025-04-18', type: 'Call',  note: 'Customer interested in family health plan. Assigned to Ravi.' },
      { date: '2025-04-14', type: 'Email', note: 'Sent premium comparison for family floater plans.' },
    ],
  },
  6: {
    name: 'Vikram Rao', mobile: '9944556677', email: 'vikram@gmail.com',
    dob: '1975-08-20', gender: 'Male', city: 'Noida', state: 'Uttar Pradesh', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse',   name: 'Sunita Rao',  dob: '1978-02-14', gender: 'Female', preExisting: '' },
      { id: 2, type: 'Son',      name: 'Karthik Rao', dob: '2003-07-19', gender: 'Male',   preExisting: '' },
      { id: 3, type: 'Daughter', name: 'Preethi Rao', dob: '2007-01-08', gender: 'Female', preExisting: '' },
    ],
    policies: [
      { id: 'POL-2025-009', type: 'Health', ic: 'HDFC ERGO', premium: 7316, status: 'Active', expiry: '2026-05-10' },
      { id: 'POL-2024-032', type: 'Motor',  ic: 'ICICI Lombard', premium: 5192, status: 'Active', expiry: '2025-08-12' },
    ],
    payments: [
      { date: '2025-05-10', amount: 7316, mode: 'NEFT', txnId: 'TXN9944556', status: 'Success' },
      { date: '2024-08-12', amount: 5192, mode: 'UPI',  txnId: 'TXN9944557', status: 'Success' },
    ],
    interactions: [
      { date: '2025-05-03', type: 'Call',  note: 'Renewed health plan for family. Discussed motor insurance add-ons.' },
      { date: '2025-04-25', type: 'Email', note: 'Sent renewal reminder for HDFC ERGO Optima.' },
    ],
  },
  7: {
    name: 'Kavita Pillai', mobile: '9899112233', email: 'kavita@gmail.com',
    dob: '1993-12-01', gender: 'Female', city: 'Hyderabad', state: 'Telangana', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse', name: 'Arun Pillai', dob: '1990-05-22', gender: 'Male', preExisting: '' },
    ],
    policies: [
      { id: 'POL-2025-014', type: 'Motor', ic: 'Bajaj Allianz', premium: 5664, status: 'Renewal Due', expiry: '2025-04-28' },
    ],
    payments: [
      { date: '2024-04-28', amount: 5664, mode: 'Card', txnId: 'TXN8991122', status: 'Success' },
    ],
    interactions: [
      { date: '2025-04-21', type: 'Call',  note: 'Renewal reminder sent. Customer confirmed she will renew shortly.' },
      { date: '2025-04-10', type: 'Email', note: 'Sent renewal notice for Bajaj Allianz Motor policy.' },
    ],
  },
  8: {
    name: 'Arjun Singh', mobile: '9922334455', email: 'arjun@gmail.com',
    dob: '1987-03-22', gender: 'Male', city: 'Mumbai', state: 'Maharashtra', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse', name: 'Neha Singh', dob: '1989-09-30', gender: 'Female', preExisting: '' },
      { id: 2, type: 'Son',    name: 'Dev Singh',  dob: '2015-12-10', gender: 'Male',   preExisting: '' },
    ],
    policies: [],
    payments: [],
    interactions: [
      { date: '2025-05-02', type: 'Call',  note: 'Interested in family health plan. Proposal under discussion.' },
      { date: '2025-04-28', type: 'Email', note: 'Sent premium quotes for Star and HDFC health plans.' },
    ],
  },
  9: {
    name: 'Priya Mehta', mobile: '9812345678', email: 'priya@gmail.com',
    dob: '1992-07-10', gender: 'Female', city: 'Kochi', state: 'Kerala', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse',   name: 'Raj Mehta',  dob: '1989-03-25', gender: 'Male',   preExisting: '' },
      { id: 2, type: 'Daughter', name: 'Sara Mehta', dob: '2019-06-18', gender: 'Female', preExisting: '' },
    ],
    policies: [
      { id: 'POL-2025-002', type: 'Health', ic: 'HDFC ERGO', premium: 7316, status: 'Active', expiry: '2026-06-11' },
    ],
    payments: [
      { date: '2025-06-11', amount: 7316, mode: 'UPI', txnId: 'TXN9812345', status: 'Success' },
    ],
    interactions: [
      { date: '2025-04-18', type: 'Call',  note: 'Confirmed interest. Assigned to sales agent Ravi for proposal.' },
      { date: '2025-04-14', type: 'Call',  note: 'Explained plan features. Requested brochure on WhatsApp.' },
    ],
  },
  10: {
    name: 'Rahul Gupta', mobile: '9966778899', email: 'rahul@gmail.com',
    dob: '1980-01-05', gender: 'Male', city: 'Delhi', state: 'Delhi', kyc: 'Verified',
    familyMembers: [
      { id: 1, type: 'Spouse',   name: 'Pooja Gupta',     dob: '1983-11-28', gender: 'Female', preExisting: '' },
      { id: 2, type: 'Son',      name: 'Siddharth Gupta', dob: '2008-04-15', gender: 'Male',   preExisting: '' },
      { id: 3, type: 'Daughter', name: 'Ananya Gupta',    dob: '2012-09-03', gender: 'Female', preExisting: '' },
    ],
    policies: [
      { id: 'POL-2025-011', type: 'Health', ic: 'Star Health', premium: 10030, status: 'Active', expiry: '2026-03-22' },
    ],
    payments: [
      { date: '2025-03-22', amount: 10030, mode: 'Card', txnId: 'TXN9966778', status: 'Success' },
    ],
    interactions: [
      { date: '2025-03-22', type: 'Call',  note: 'Policy issued. Customer very satisfied with quick process.' },
      { date: '2025-03-20', type: 'Email', note: 'Proposal documents sent for review and signature.' },
      { date: '2025-03-16', type: 'Call',  note: 'First contact from CRM campaign. Very receptive to health plan.' },
    ],
  },
  11: {
    name: 'Ritu Singh', mobile: '9833221100', email: 'ritu@gmail.com',
    dob: '1996-05-18', gender: 'Female', city: 'Jaipur', state: 'Rajasthan', kyc: 'Pending',
    familyMembers: [],
    policies: [],
    payments: [],
    interactions: [
      { date: '2025-04-12', type: 'Call', note: 'KYC verification pending. Customer to submit Aadhaar copy.' },
    ],
  },
  12: {
    name: 'Ajay Iyer', mobile: '9822110099', email: 'ajay@gmail.com',
    dob: '1983-10-30', gender: 'Male', city: 'Chennai', state: 'Tamil Nadu', kyc: 'Rejected',
    familyMembers: [],
    policies: [],
    payments: [],
    interactions: [
      { date: '2025-03-28', type: 'Call', note: 'KYC rejected. PAN card details did not match. Requested resubmission.' },
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
