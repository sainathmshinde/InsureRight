import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TYPE_ICON } from './FamilyMembersSection'
import { CustomerIcon } from '../../icons'

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

// Documents mock — Aadhaar + PAN per customer
const DOCS = {
  1:  { aadhaar: { number: '2345 6789 0123', name: 'Aarav Sharma',  dob: '15/03/1990', gender: 'Male',   address: '14, Green Valley Apts, Andheri West, Mumbai – 400058', status: 'Verified' }, pan: { number: 'AABPS1234C', name: 'AARAV SHARMA',  fatherName: 'SURESH SHARMA',   dob: '15/03/1990', status: 'Verified' } },
  2:  { aadhaar: { number: '3456 7890 1234', name: 'Rohit Sharma',  dob: '20/11/1990', gender: 'Male',   address: '45 MG Road, Pune – 411001', status: 'Pending'  }, pan: { number: 'BBRPS2345D', name: 'ROHIT SHARMA',  fatherName: 'MOHAN SHARMA',    dob: '20/11/1990', status: 'Pending'  } },
  3:  { aadhaar: { number: '4567 8901 2345', name: 'Divya Nair',    dob: '05/06/1978', gender: 'Female', address: '7/B Koramangala, Bangalore – 560034',              status: 'Verified' }, pan: { number: 'CCCDN3456E', name: 'DIVYA NAIR',    fatherName: 'KRISHNA NAIR',    dob: '05/06/1978', status: 'Verified' } },
  4:  { aadhaar: { number: '5678 9012 3456', name: 'Vijay Patil',   dob: '30/09/1995', gender: 'Male',   address: '23 Shivaji Nagar, Nashik – 422001',               status: 'Rejected' }, pan: { number: 'DDPVP4567F', name: 'VIJAY PATIL',   fatherName: 'DATTATRAY PATIL', dob: '30/09/1995', status: 'Rejected' } },
  5:  { aadhaar: { number: '6789 0123 4567', name: 'Suresh Kumar',  dob: '20/03/1985', gender: 'Male',   address: '101 Deccan Gymkhana, Pune – 411004',              status: 'Verified' }, pan: { number: 'EESKP5678G', name: 'SURESH KUMAR',  fatherName: 'RAMESH KUMAR',    dob: '20/03/1985', status: 'Verified' } },
  6:  { aadhaar: { number: '7890 1234 5678', name: 'Vikram Rao',    dob: '20/08/1975', gender: 'Male',   address: 'B-5 Sector 18, Noida – 201301',                  status: 'Verified' }, pan: { number: 'FFRVR6789H', name: 'VIKRAM RAO',    fatherName: 'SUBBA RAO',       dob: '20/08/1975', status: 'Verified' } },
  7:  { aadhaar: { number: '8901 2345 6789', name: 'Kavita Pillai', dob: '01/12/1993', gender: 'Female', address: '56 Jubilee Hills, Hyderabad – 500033',            status: 'Verified' }, pan: { number: 'GGKPK7890J', name: 'KAVITA PILLAI', fatherName: 'SURESH PILLAI',   dob: '01/12/1993', status: 'Verified' } },
  8:  { aadhaar: { number: '9012 3456 7890', name: 'Arjun Singh',   dob: '22/03/1987', gender: 'Male',   address: '8 Andheri West, Mumbai – 400053',                status: 'Verified' }, pan: { number: 'HHASP8901K', name: 'ARJUN SINGH',   fatherName: 'BALVIR SINGH',    dob: '22/03/1987', status: 'Verified' } },
  9:  { aadhaar: { number: '0123 4567 8901', name: 'Priya Mehta',   dob: '10/07/1992', gender: 'Female', address: '33 Fort Kochi, Kerala – 682001',                 status: 'Verified' }, pan: { number: 'IIPMP9012L', name: 'PRIYA MEHTA',   fatherName: 'SANJAY MEHTA',    dob: '10/07/1992', status: 'Verified' } },
  10: { aadhaar: { number: '1234 5678 9012', name: 'Rahul Gupta',   dob: '05/01/1980', gender: 'Male',   address: 'C-9 Civil Lines, Delhi – 110054',                status: 'Verified' }, pan: { number: 'JJRGP0123M', name: 'RAHUL GUPTA',   fatherName: 'ANIL GUPTA',      dob: '05/01/1980', status: 'Verified' } },
  11: { aadhaar: { number: '2345 6789 1122', name: 'Ritu Singh',    dob: '18/05/1996', gender: 'Female', address: '12 Raja Park, Jaipur – 302004',                  status: 'Pending'  }, pan: null },
  12: { aadhaar: { number: '3456 7890 2233', name: 'Ajay Iyer',     dob: '30/10/1983', gender: 'Male',   address: '4 T Nagar, Chennai – 600017',                    status: 'Rejected' }, pan: { number: 'KKAIP1234N', name: 'AJAY IYER',     fatherName: 'KRISHNAN IYER',   dob: '30/10/1983', status: 'Rejected' } },
}

const STATUS_COLOR = { Verified: { bg: '#dcfce7', border: '#86efac', text: '#15803d' }, Pending: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' }, Rejected: { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c' } }

function DocCard({ type, data, customerName }) {
  const isAadhaar = type === 'aadhaar'
  const sc = STATUS_COLOR[data.status] ?? STATUS_COLOR.Pending
  return (
    <div style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
      {/* Card header bar */}
      <div style={{ background: isAadhaar ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'linear-gradient(135deg,#1d4ed8,#1e40af)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>{isAadhaar ? '🪪' : '💳'}</span>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>{isAadhaar ? 'Aadhaar Card' : 'PAN Card'}</div>
            <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 11.5 }}>{isAadhaar ? 'Unique Identification Authority of India' : 'Income Tax Department, Govt. of India'}</div>
          </div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>{data.status}</span>
      </div>

      {/* Card body — document visual */}
      <div style={{ padding: '18px 20px' }}>
        {isAadhaar ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Aadhaar Number</div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, letterSpacing: 3, color: 'var(--text)' }}>
                {'XXXX XXXX ' + data.number.slice(-4)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Name</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{data.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Date of Birth</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{data.dob}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Gender</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{data.gender}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Address</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{data.address}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>PAN Number</div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 700, letterSpacing: 3, color: 'var(--text)' }}>{data.number}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Name</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{data.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Date of Birth</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{data.dob}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 2 }}>Father's Name</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{data.fatherName}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '10px 18px', background: 'var(--surface-2)', display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm">🔍 View Full</button>
        <button className="btn btn-ghost btn-sm">⬇ Download</button>
        {data.status === 'Rejected' && <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>🔄 Re-upload</button>}
      </div>
    </div>
  )
}

const TABS = ['Policies', 'Payments', 'Interactions', 'Family', 'Documents']

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
          <div className="page-icon"><CustomerIcon /></div>
          <div>
            <div className="page-title">{c.name}</div>
            <div className="page-subtitle">{c.mobile} · {c.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-sm" onClick={() => navigate(`/customer/${id}/edit`)} style={{ color: '#6d28d9', border: '1.5px solid #7c3aed', background: '#faf5ff', fontWeight: 700 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>Edit</button>
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

          {/* Documents */}
          {tab === 4 && (() => {
            const docs = DOCS[id]
            if (!docs) return <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-3)' }}>No documents found.</div>
            return (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                  {/* Aadhaar */}
                  {docs.aadhaar
                    ? <DocCard type="aadhaar" data={docs.aadhaar} customerName={c.name} />
                    : (
                      <div style={{ border: '1.5px dashed var(--border)', borderRadius: 'var(--r-lg)', padding: '40px 24px', textAlign: 'center', color: 'var(--text-3)' }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>🪪</div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Aadhaar not uploaded</div>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>Upload Aadhaar</button>
                      </div>
                    )
                  }
                  {/* PAN */}
                  {docs.pan
                    ? <DocCard type="pan" data={docs.pan} customerName={c.name} />
                    : (
                      <div style={{ border: '1.5px dashed var(--border)', borderRadius: 'var(--r-lg)', padding: '40px 24px', textAlign: 'center', color: 'var(--text-3)' }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>💳</div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>PAN not uploaded</div>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>Upload PAN</button>
                      </div>
                    )
                  }
                </div>
                {/* Overall KYC note */}
                {c.kyc === 'Rejected' && (
                  <div style={{ marginTop: 18, display: 'flex', gap: 10, padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--r-md)' }}>
                    <span>🚫</span>
                    <div style={{ fontSize: 13, color: '#b91c1c' }}>One or more documents have been rejected. Please request the customer to resubmit correct documents to complete KYC.</div>
                  </div>
                )}
                {c.kyc === 'Pending' && (
                  <div style={{ marginTop: 18, display: 'flex', gap: 10, padding: '12px 16px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 'var(--r-md)' }}>
                    <span>⚠️</span>
                    <div style={{ fontSize: 13, color: '#92400e' }}>Documents are uploaded and pending verification. KYC will be marked Verified once approved.</div>
                  </div>
                )}
              </div>
            )
          })()}

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
