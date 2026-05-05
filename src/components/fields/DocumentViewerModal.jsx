import { useEffect, useState } from 'react'

const OVERLAY = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: 20,
}
const MODAL = {
  background: '#e8e8e8', borderRadius: 14, width: '100%', maxWidth: 640,
  maxHeight: '94vh', display: 'flex', flexDirection: 'column',
  boxShadow: '0 28px 80px rgba(0,0,0,0.5)', overflow: 'hidden',
}

function parseDocUrl(value) {
  if (typeof value !== 'string') return null
  const idx = value.indexOf('?')
  if (idx === -1) return null
  const p = new URLSearchParams(value.slice(idx + 1))
  return {
    type:    p.get('type')    || 'pan',
    name:    p.get('name')    || '',
    number:  p.get('number')  || '',
    dob:     p.get('dob')     || '',
    gender:  p.get('gender')  || '',
    bank:    p.get('bank')    || '',
    account: p.get('account') || '',
    ifsc:    p.get('ifsc')    || '',
    company: p.get('company') || '',
    start:   p.get('start')   || '',
    end:     p.get('end')     || '',
  }
}

function fmtDate(d) {
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) }
  catch { return d }
}

const Wrap = ({ children, bg = '#c8c8c8' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '32px 24px', background: bg, minHeight: 320 }}>
    {children}
  </div>
)

/* ═══════════════════════════════════════════════════════════
   PAN CARD  —  matches real NSDL/UTI PAN card layout
═══════════════════════════════════════════════════════════ */
function PANCard({ p }) {
  const initials = p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <Wrap bg="#b0b0b0">
      {/* Card: 85.6 × 54mm aspect, landscape */}
      <div style={{
        width: 500, background: '#fdf8ee',
        borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        border: '1px solid #d4c89a', fontFamily: 'Arial, sans-serif',
      }}>

        {/* ── Tricolour top stripe ── */}
        <div style={{ display: 'flex', height: 6 }}>
          <div style={{ flex: 1, background: '#FF9933' }} />
          <div style={{ flex: 1, background: '#FFFFFF', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }} />
          <div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* ── Blue header band ── */}
        <div style={{
          background: '#003580', padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {/* Ashoka Lion emblem (simulated) */}
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#ffd700', border: '2px solid #ffaa00',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 16,
          }}>🦁</div>
          <div>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 900, letterSpacing: 1 }}>
              INCOME TAX DEPARTMENT
            </div>
            <div style={{ color: '#cdd9f0', fontSize: 9.5, letterSpacing: 0.5 }}>
              GOVERNMENT OF INDIA
            </div>
          </div>
          <div style={{ marginLeft: 'auto', color: '#cdd9f0', fontSize: 9, textAlign: 'right', lineHeight: 1.5 }}>
            आयकर विभाग<br />भारत सरकार
          </div>
        </div>

        {/* ── Card body ── */}
        <div style={{ display: 'flex', padding: '14px 16px', gap: 16 }}>

          {/* Left: photo + signature */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Photo box */}
            <div style={{
              width: 76, height: 92,
              border: '1.5px solid #9a8450',
              background: 'linear-gradient(160deg,#e8e0cc,#d4c8a4)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              borderRadius: 3,
            }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#6b5a32', lineHeight: 1 }}>{initials}</div>
              <div style={{ fontSize: 7, color: '#8a7248', marginTop: 4, letterSpacing: 1 }}>PHOTO</div>
            </div>
            {/* Signature line */}
            <div style={{ width: 76, borderTop: '1px solid #6b5a32', paddingTop: 3, textAlign: 'center' }}>
              <div style={{ fontSize: 7, color: '#6b5a32', letterSpacing: 0.3 }}>Signature / अनुक्षेप</div>
            </div>
          </div>

          {/* Right: details */}
          <div style={{ flex: 1 }}>
            {/* PAN Number — most prominent */}
            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 26, fontWeight: 900, letterSpacing: 4,
              color: '#003580', marginBottom: 10,
              textShadow: '0 1px 0 rgba(255,255,255,0.8)',
            }}>
              {p.number}
            </div>

            <PField label="नाम / Name" value={p.name.toUpperCase()} large />
            <PField label="पिता का नाम / Father's Name" value="AS PER RECORDS" />
            <PField label="जन्म की तारीख / Date of Birth" value={p.dob} />
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          background: '#f0e8d0', borderTop: '1px solid #d4c89a',
          padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 8, color: '#6b5a32' }}>
            Permanent Account Number • स्थायी खाता संख्या
          </div>
          <div style={{ fontSize: 8, color: '#003580', fontWeight: 700 }}>
            www.incometax.gov.in
          </div>
        </div>
      </div>
    </Wrap>
  )
}
function PField({ label, value, large }) {
  return (
    <div style={{ marginBottom: large ? 8 : 6 }}>
      <div style={{ fontSize: 7.5, color: '#8a7248', letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: large ? 14 : 12, fontWeight: large ? 800 : 600, color: '#1a1a1a', marginTop: 1 }}>{value}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   AADHAAR CARD  —  matches UIDAI mAadhaar format
═══════════════════════════════════════════════════════════ */
function AadhaarCard({ p }) {
  const initials = p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const num = p.number.replace(/\s/g, '')
  const masked = `XXXX  XXXX  ${num.slice(-4) || 'XXXX'}`

  return (
    <Wrap bg="#a8b8c8">
      <div style={{ width: 480, fontFamily: 'Arial, sans-serif' }}>

        {/* ── FRONT SIDE ── */}
        <div style={{
          background: '#fff', borderRadius: '10px 10px 0 0',
          overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          border: '1px solid #ccc', borderBottom: 'none',
        }}>
          {/* Header bar */}
          <div style={{
            background: 'linear-gradient(90deg,#003580,#0057a8)',
            padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 19, fontWeight: 900, fontStyle: 'italic', letterSpacing: 1 }}>आधार</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, marginTop: -2 }}>AADHAAR</div>
            </div>
            {/* UIDAI logo area */}
            <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ fontSize: 9, lineHeight: 1.7 }}>
                भारत सरकार | Government of India<br />
                भारतीय विशिष्ट पहचान प्राधिकरण<br />
                Unique Identification Authority of India
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            background: '#f5f9ff', borderBottom: '1px solid #d0dff0',
            padding: '3px 16px', fontSize: 9, color: '#003580', fontStyle: 'italic',
          }}>
            मेरा आधार, मेरी पहचान &nbsp;|&nbsp; My Aadhaar, My Identity
          </div>

          {/* Body */}
          <div style={{ padding: '14px 16px', display: 'flex', gap: 16 }}>
            {/* Photo */}
            <div style={{
              width: 80, height: 98, border: '1.5px solid #b0b8cc',
              background: 'linear-gradient(160deg,#dce8f8,#b8cce8)',
              borderRadius: 4, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#003580', lineHeight: 1 }}>{initials}</div>
              <div style={{ fontSize: 7, color: '#4a6a9a', marginTop: 4, letterSpacing: 1 }}>PHOTO</div>
            </div>

            {/* Details */}
            <div style={{ flex: 1 }}>
              <AField label="नाम / Name" value={p.name} large />
              <AField label="जन्म तिथि / Date of Birth" value={p.dob} />
              <AField label="लिंग / Gender" value={p.gender} />
            </div>
          </div>

          {/* Aadhaar Number band */}
          <div style={{
            background: 'linear-gradient(90deg,#003580,#0057a8)',
            padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {/* Simulated QR code */}
            <div style={{
              width: 52, height: 52,
              background: 'repeating-conic-gradient(#fff 0% 25%,#003580 0% 50%) 0 0/6px 6px',
              borderRadius: 4, border: '3px solid #fff', flexShrink: 0,
            }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, marginBottom: 4, letterSpacing: 0.5 }}>
                आधार संख्या / Aadhaar Number
              </div>
              <div style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 24, fontWeight: 900, letterSpacing: 6, color: '#fff',
              }}>
                {masked}
              </div>
            </div>
            {/* Fingerprint icon */}
            <div style={{ fontSize: 28, opacity: 0.6 }}>🫱</div>
          </div>
        </div>

        {/* ── BACK SIDE ── */}
        <div style={{
          background: '#f8faff', borderRadius: '0 0 10px 10px',
          border: '1px solid #ccc', borderTop: '2px dashed #99b0cc',
          padding: '12px 16px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        }}>
          <div style={{ fontSize: 9, color: '#003580', fontWeight: 700, marginBottom: 6 }}>पता / Address</div>
          <div style={{ fontSize: 11, color: '#333', lineHeight: 1.7 }}>
            S/O As per records, District, State — 000000
          </div>
          <div style={{ marginTop: 10, fontSize: 8, color: '#888', borderTop: '1px solid #dde5f0', paddingTop: 6 }}>
            This card is the property of UIDAI. If found, please return to any Aadhaar enrolment centre.
          </div>
        </div>
      </div>
    </Wrap>
  )
}
function AField({ label, value, large }) {
  return (
    <div style={{ marginBottom: large ? 9 : 6 }}>
      <div style={{ fontSize: 7.5, color: '#4a6a9a', letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: large ? 15 : 12, fontWeight: large ? 800 : 600, color: '#111', marginTop: 1 }}>{value}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PASSPORT PHOTO
═══════════════════════════════════════════════════════════ */
function ProfilePhoto({ p, fileUrl }) {
  const initials = p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <Wrap bg="#c0c0c0">
      <div style={{ textAlign: 'center' }}>
        {/* Photo card (passport studio style) */}
        <div style={{
          background: '#fff', padding: '16px 16px 12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'inline-block',
          borderRadius: 4,
        }}>
          {/* The actual photo: 35mm×45mm → ratio 7:9 */}
          <div style={{
            width: 175, height: 225,
            background: fileUrl ? 'transparent' : '#fff',
            border: '1px solid #ccc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative',
          }}>
            {fileUrl ? (
              <img src={fileUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', width: '100%' }}>
                {/* Sky background */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg,#e8f4ff 0%,#d0e8ff 40%,#fff 40%)',
                }} />
                {/* Silhouette */}
                <div style={{ position: 'relative', zIndex: 1, paddingTop: 30 }}>
                  {/* Head */}
                  <div style={{
                    width: 68, height: 68, borderRadius: '50%',
                    background: '#c8a882', margin: '0 auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, fontWeight: 900, color: '#7a5c38',
                  }}>
                    {initials}
                  </div>
                  {/* Shoulders */}
                  <div style={{
                    width: 130, height: 90, borderRadius: '50% 50% 0 0',
                    background: '#4a5568', margin: '-10px auto 0',
                  }} />
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: '#555', fontFamily: 'Arial' }}>
            {p.name}
          </div>
        </div>

        {/* Studio spec label */}
        <div style={{
          marginTop: 14, background: '#fff', display: 'inline-block',
          padding: '8px 20px', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          fontSize: 11, color: '#444', lineHeight: 1.8,
        }}>
          <strong>Passport Size Photograph</strong><br />
          Size: 35 mm × 45 mm &nbsp;|&nbsp; Background: White<br />
          Face: Front facing, Eyes open &nbsp;|&nbsp; Recent colour photo
        </div>
      </div>
    </Wrap>
  )
}

/* ═══════════════════════════════════════════════════════════
   CANCELLED CHEQUE  —  matches standard bank cheque format
═══════════════════════════════════════════════════════════ */
function CancelledCheque({ p }) {
  const today = new Date().toLocaleDateString('en-IN')
  const acNum = p.account.replace(/\D/g, '')
  const micrAc = acNum.padEnd(15, '0').slice(0, 15)

  return (
    <Wrap bg="#b8b8b8">
      <div style={{ width: 520, fontFamily: 'Arial, sans-serif' }}>
        <div style={{
          background: '#fffef8', borderRadius: 8, overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.28)',
          border: '1px solid #c8c0a0',
        }}>
          {/* Bank letterhead */}
          <div style={{
            padding: '12px 18px', borderBottom: '3px solid #003580',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#fff',
          }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#003580', letterSpacing: 0.5 }}>{p.bank}</div>
              <div style={{ fontSize: 9.5, color: '#555', marginTop: 2 }}>A Scheduled Commercial Bank &nbsp;|&nbsp; IFSC: <strong>{p.ifsc}</strong></div>
            </div>
            {/* Cheque number */}
            <div style={{ textAlign: 'right', fontSize: 10, color: '#666' }}>
              <div style={{ fontFamily: 'Courier New', fontSize: 13, fontWeight: 700, color: '#333' }}>000123</div>
              <div>Cheque No.</div>
            </div>
          </div>

          {/* Branch + Date row */}
          <div style={{ padding: '8px 18px', display: 'flex', justifyContent: 'space-between', background: '#f8f6ee', borderBottom: '1px solid #e0d8b8' }}>
            <div style={{ fontSize: 10, color: '#555' }}>Branch: Main Branch, City</div>
            <div style={{ display: 'flex', gap: 4, fontSize: 10 }}>
              <span style={{ color: '#555' }}>Date:</span>
              {today.split('/').map((part, i) => (
                <span key={i} style={{
                  border: '1px solid #aaa', padding: '1px 6px', minWidth: 24,
                  textAlign: 'center', fontFamily: 'Courier New', fontWeight: 700, fontSize: 11,
                }}>{part}</span>
              ))}
            </div>
          </div>

          {/* Cheque body */}
          <div style={{ padding: '14px 18px', position: 'relative', background: '#fffef8' }}>
            {/* CANCELLED watermark */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%) rotate(-22deg)',
              fontSize: 44, fontWeight: 900, letterSpacing: 8,
              color: 'rgba(180,0,0,0.13)', border: '6px solid rgba(180,0,0,0.13)',
              padding: '4px 16px', borderRadius: 4, pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              CANCELLED
            </div>

            <ChqRow label="Pay to" value={p.name} />
            <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'flex-end' }}>
              <ChqRow label="Rupees (in words)" value="**  CANCELLED  **" style={{ flex: 1 }} />
              <div style={{
                border: '2px solid #333', padding: '5px 12px', fontFamily: 'Courier New',
                fontSize: 14, fontWeight: 900, minWidth: 90, textAlign: 'center',
                background: '#fff',
              }}>
                ₹ — — —
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 18 }}>
              <div style={{ fontSize: 10, color: '#555' }}>
                A/c No:&nbsp;
                <span style={{ fontFamily: 'Courier New', fontWeight: 700, fontSize: 12 }}>{p.account}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 160, borderTop: '1px solid #555', paddingTop: 4, fontSize: 10, color: '#666' }}>
                  Authorised Signatory
                </div>
              </div>
            </div>
          </div>

          {/* MICR band */}
          <div style={{
            background: '#f0ece0', borderTop: '2px dashed #c0b880',
            padding: '8px 18px', display: 'flex', justifyContent: 'space-between',
            fontFamily: 'Courier New, monospace', fontSize: 13, color: '#222', letterSpacing: 1,
          }}>
            <span>⑆{micrAc}⑆</span>
            <span>⑆{p.ifsc.slice(0, 4)}0{p.ifsc.slice(5)}⑆</span>
            <span>⑆000123⑆</span>
          </div>
        </div>

        <div style={{ marginTop: 10, fontSize: 10, color: '#666', textAlign: 'center' }}>
          This is a cancelled cheque for bank account verification purposes only.
        </div>
      </div>
    </Wrap>
  )
}
function ChqRow({ label, value, style }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-end', ...style }}>
      <span style={{ fontSize: 10.5, color: '#555', whiteSpace: 'nowrap' }}>{label} :</span>
      <span style={{ flex: 1, borderBottom: '1.5px solid #333', paddingBottom: 2, fontSize: 13, fontWeight: 700, minWidth: 0 }}>{value}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   AGREEMENT DOCUMENT  —  A4 letterhead format
═══════════════════════════════════════════════════════════ */
function Agreement({ p }) {
  return (
    <Wrap bg="#aaaaaa">
      <div style={{
        width: 520, background: '#fff', fontFamily: 'Times New Roman, serif',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)', position: 'relative',
      }}>
        {/* Letterhead top border */}
        <div style={{ height: 6, background: 'linear-gradient(90deg,#003580,#0057a8,#003580)' }} />

        <div style={{ padding: '28px 44px 36px' }}>
          {/* Company header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #003580', paddingBottom: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#003580', letterSpacing: 2, fontFamily: 'Arial' }}>
              INSURE RIGHT
            </div>
            <div style={{ fontSize: 10, color: '#555', marginTop: 3, letterSpacing: 0.5, fontFamily: 'Arial' }}>
              Insurance Broking Services Pvt. Ltd. &nbsp;|&nbsp; IRDAI Reg. No. CB-XXXX/2020
            </div>
            <div style={{ fontSize: 9.5, color: '#777', marginTop: 2, fontFamily: 'Arial' }}>
              CIN: U66010MH2020PTC345678 &nbsp;|&nbsp; www.insureright.in
            </div>
          </div>

          {/* Document title */}
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 2, fontFamily: 'Arial', textDecoration: 'underline' }}>
              Broker Commission Agreement
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 10, background: '#e8f0fe', color: '#003580', padding: '3px 14px', border: '1px solid #93c5fd', fontFamily: 'Arial' }}>
              Agreement Period: {fmtDate(p.start)} — {fmtDate(p.end)}
            </span>
          </div>

          {/* Ref + Date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 16, color: '#333' }}>
            <span>Ref No: IR/BRK/{new Date(p.start).getFullYear()}/{String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}</span>
            <span>Date: {fmtDate(p.start)}</span>
          </div>

          {/* Body text */}
          <div style={{ fontSize: 11.5, lineHeight: 1.95, color: '#222', textAlign: 'justify' }}>
            <p style={{ marginBottom: 12 }}>
              This Agreement is entered into on <strong>{fmtDate(p.start)}</strong> between{' '}
              <strong>Insure Right Insurance Broking Pvt. Ltd.</strong>, having its registered
              office at Mumbai, Maharashtra (hereinafter referred to as <em>"the Company"</em>),
              and <strong>{p.name}</strong>, operating under the trade name{' '}
              <strong>{p.company}</strong> (hereinafter referred to as <em>"the Broker"</em>).
            </p>

            {[
              ['1. Appointment', `The Company hereby appoints ${p.name} as an authorized Broker for soliciting and procuring insurance business in accordance with IRDAI (Insurance Brokers) Regulations, 2018.`],
              ['2. Commission', 'The Broker shall be entitled to commission as per IRDAI approved rates. Commissions shall be credited within 30 (thirty) working days of premium receipt and realization.'],
              ['3. Obligations', 'The Broker shall maintain a valid IRDAI license, comply with all KYC requirements, and ensure proper documentation for each policyholder.'],
              ['4. Confidentiality', 'Both parties shall maintain strict confidentiality of customer data, business plans, and proprietary information. This obligation shall survive termination for a period of 3 years.'],
              ['5. Termination', 'This Agreement may be terminated by either party with 30 days written notice. The Company may terminate immediately for regulatory violations or material breach.'],
            ].map(([title, text]) => (
              <div key={title} style={{ marginBottom: 11 }}>
                <strong>{title}:</strong> {text}
              </div>
            ))}
          </div>

          {/* Signature block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36 }}>
            {[
              { who: p.name, role: p.company, sub: 'Broker' },
              { who: 'Authorised Signatory', role: 'Insure Right Insurance Broking Pvt. Ltd.', sub: 'Company' },
            ].map(({ who, role, sub }) => (
              <div key={sub} style={{ width: '44%' }}>
                <div style={{ height: 36 }} />{/* space for actual signature */}
                <div style={{ borderTop: '1.5px solid #333', paddingTop: 5 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#111' }}>{who}</div>
                  <div style={{ fontSize: 10, color: '#555' }}>{role}</div>
                  <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>({sub})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom border */}
        <div style={{ height: 5, background: 'linear-gradient(90deg,#003580,#0057a8,#003580)' }} />
      </div>
    </Wrap>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN MODAL
═══════════════════════════════════════════════════════════ */
export function DocumentViewerModal({ value, onClose }) {
  const [objectUrl, setObjectUrl] = useState(null)
  const isFile = value instanceof File
  const docInfo = parseDocUrl(value)

  useEffect(() => {
    if (!isFile) return
    const url = URL.createObjectURL(value)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value, isFile])

  const DOC_TITLES = { pan: 'PAN Card', aadhaar: 'Aadhaar Card', photo: 'Passport Photo', cheque: 'Cancelled Cheque', agreement: 'Agreement Document' }
  const isPlainUrl = typeof value === 'string' && !docInfo
  const title = isFile
    ? value.name
    : docInfo
      ? `${DOC_TITLES[docInfo.type] || docInfo.type} — ${docInfo.name}`
      : isPlainUrl
        ? decodeURIComponent(value.split('/').pop().split('?')[0])
        : ''

  const handleDownload = () => {
    if (!objectUrl) return
    Object.assign(document.createElement('a'), { href: objectUrl, download: value.name }).click()
  }

  const renderContent = () => {
    if (isFile) {
      const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(value.name)
      if (isImage && objectUrl)
        return <Wrap><img src={objectUrl} alt={value.name} style={{ maxWidth: '100%', maxHeight: '74vh', borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} /></Wrap>
      if (objectUrl)
        return <iframe src={objectUrl} title={value.name} style={{ width: '100%', height: '74vh', border: 'none', display: 'block' }} />
    }

    if (isPlainUrl)
      return <iframe src={value} title={title} style={{ width: '100%', height: '74vh', border: 'none', display: 'block' }} />

    if (docInfo) {
      switch (docInfo.type) {
        case 'pan':       return <PANCard p={docInfo} />
        case 'aadhaar':   return <AadhaarCard p={docInfo} />
        case 'photo':     return <ProfilePhoto p={docInfo} fileUrl={isFile && objectUrl ? objectUrl : null} />
        case 'cheque':    return <CancelledCheque p={docInfo} />
        case 'agreement': return <Agreement p={docInfo} />
        default:          return null
      }
    }

    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: '#999' }}>No preview available</div>
  }

  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={MODAL} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid #ddd', background: '#fff', flexShrink: 0 }}>
          <span style={{ fontSize: 17 }}>📄</span>
          <span style={{ flex: 1, fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#222' }}>{title}</span>
          {(isFile || isPlainUrl) && (
            <a
              href={isFile ? objectUrl : value}
              download={isFile ? value.name : title}
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', color: '#555', marginRight: 4, textDecoration: 'none' }}
            >
              ⬇ Download
            </a>
          )}
          <button onClick={onClose} style={{ fontSize: 20, border: 'none', background: 'transparent', cursor: 'pointer', color: '#888', lineHeight: 1, padding: '2px 6px' }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
