import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/* ── nav structure ───────────────────────────────────── */
const NAV = [
  {
    key: 'account', label: 'Account', icon: '🏢',
    children: [
      { key: 'account-org',      label: 'Organisation Profile' },
      { key: 'account-contact',  label: 'Contact Details'      },
      { key: 'account-gst',      label: 'GST Information'      },
      { key: 'account-billing',  label: 'Payments & Billing'   },
      { key: 'account-invoices', label: 'Invoices'             },
    ],
  },
  {
    key: 'subscription', label: 'Subscription', icon: '📦',
    children: [
      { key: 'sub-app',    label: 'App Access'    },
      { key: 'sub-module', label: 'Module Access' },
      { key: 'sub-page',   label: 'Page Access'   },
    ],
  },
  {
    key: 'settings', label: 'Settings', icon: '⚙️',
    children: [
      { key: 'settings-users', label: 'Admin Users' },
    ],
  },
]

/* ── mock data ───────────────────────────────────────── */
const ORG = {
  name: 'K.M. Dastur & Co. Insurance Brokers Pvt. Ltd.',
  shortName: 'KM Dastur',
  type: 'Insurance Broker',
  irdai: 'CB-456/2008',
  pan: 'AABCK1234M',
  cin: 'U66010MH2008PTC180123',
  address: '14th Floor, Maker Chambers IV, Nariman Point',
  city: 'Mumbai', state: 'Maharashtra', pin: '400021',
  website: 'www.kmdastur.com',
  logo: '🏦',
}
const CONTACTS = [
  { role: 'Primary Contact',   name: 'Rajiv Dastur',   email: 'rajiv@kmdastur.com',   phone: '+91 98201 00001', dept: 'Management'  },
  { role: 'Operations Head',   name: 'Meena Joshi',    email: 'meena@kmdastur.com',   phone: '+91 98201 00002', dept: 'Operations'  },
  { role: 'Compliance Officer',name: 'Arun Mehta',     email: 'arun@kmdastur.com',    phone: '+91 98201 00003', dept: 'Compliance'  },
  { role: 'Support Email',     name: '—',              email: 'support@kmdastur.com', phone: '1800-XXX-XXXX',   dept: 'Support'     },
]
const GST = {
  gstin: '27AABCK1234M1ZB',
  state: 'Maharashtra',
  stateCode: '27',
  hsnCode: '997134',
  hsnDesc: 'Services related to insurance',
  taxRate: '18%',
  filingFreq: 'Monthly',
  lastFiled: 'Mar 2026',
}
const INVOICES = [
  { no: 'INV-2026-003', date: '01 Mar 2026', desc: 'Platform subscription — Mar 2026', amount: '₹12,500', gst: '₹2,250', total: '₹14,750', status: 'Paid'    },
  { no: 'INV-2026-002', date: '01 Feb 2026', desc: 'Platform subscription — Feb 2026', amount: '₹12,500', gst: '₹2,250', total: '₹14,750', status: 'Paid'    },
  { no: 'INV-2026-001', date: '01 Jan 2026', desc: 'Platform subscription — Jan 2026', amount: '₹12,500', gst: '₹2,250', total: '₹14,750', status: 'Paid'    },
  { no: 'INV-2025-012', date: '01 Dec 2025', desc: 'Platform subscription — Dec 2025', amount: '₹12,500', gst: '₹2,250', total: '₹14,750', status: 'Paid'    },
  { no: 'INV-2026-004', date: '01 Apr 2026', desc: 'Platform subscription — Apr 2026', amount: '₹12,500', gst: '₹2,250', total: '₹14,750', status: 'Due'     },
]
const PORTALS = [
  { key: 'broker',   label: 'Broker Portal',   icon: '🏢', desc: 'Full broker management suite',      enabled: true,  plan: 'Enterprise' },
  { key: 'agent',    label: 'Agent Portal',    icon: '👤', desc: 'Agent onboarding & commissions',    enabled: true,  plan: 'Enterprise' },
  { key: 'customer', label: 'Customer Portal', icon: '🧑', desc: 'Customer-facing insurance portal',  enabled: true,  plan: 'Enterprise' },
  { key: 'admin',    label: 'Admin Console',   icon: '⚙️', desc: 'Platform configuration & billing',  enabled: true,  plan: 'Enterprise' },
]
const MODULES = [
  { module: 'Policy Management',  broker: true,  agent: true,  customer: true  },
  { module: 'CRM',                broker: true,  agent: true,  customer: false },
  { module: 'Campaign Manager',   broker: true,  agent: false, customer: false },
  { module: 'IC Integration',     broker: true,  agent: false, customer: false },
  { module: 'Commission Tracker', broker: true,  agent: true,  customer: false },
  { module: 'Insurance Compare',  broker: true,  agent: true,  customer: true  },
  { module: 'Claims',             broker: true,  agent: true,  customer: true  },
  { module: 'Reports & Analytics',broker: true,  agent: false, customer: false },
]
const PAGE_ACCESS = [
  { page: 'Dashboard',        broker: true,  agent: true,  customer: true,  path: '/dashboard'        },
  { page: 'Policy List',      broker: true,  agent: true,  customer: true,  path: '/policy'           },
  { page: 'Buy Policy',       broker: true,  agent: true,  customer: true,  path: '/policy/buy'       },
  { page: 'Policy Catalogue', broker: false, agent: true,  customer: true,  path: '/policy-catalogue' },
  { page: 'Customer List',    broker: true,  agent: true,  customer: false, path: '/customer'         },
  { page: 'Agent List',       broker: true,  agent: false, customer: false, path: '/agent'            },
  { page: 'Product Catalogue',broker: true,  agent: false, customer: false, path: '/product'          },
  { page: 'Campaign',         broker: true,  agent: false, customer: false, path: '/campaign'         },
  { page: 'IC Master',        broker: true,  agent: false, customer: false, path: '/ic'               },
  { page: 'CRM',              broker: true,  agent: true,  customer: false, path: '/crm'              },
  { page: 'Insurance Health', broker: true,  agent: true,  customer: true,  path: '/insurance/health' },
  { page: 'Commission',       broker: true,  agent: true,  customer: false, path: '/agent/commission' },
]
const ADMIN_USERS = [
  { name: 'Rajiv Dastur',    email: 'rajiv@kmdastur.com',   role: 'Super Admin',    status: 'Active',   last: '2 hrs ago',  mfa: true  },
  { name: 'Meena Joshi',     email: 'meena@kmdastur.com',   role: 'Operations Admin', status: 'Active', last: '1 day ago',  mfa: true  },
  { name: 'Arun Mehta',      email: 'arun@kmdastur.com',    role: 'Compliance',     status: 'Active',   last: '3 days ago', mfa: false },
  { name: 'Sandeep Verma',   email: 'sandeep@kmdastur.com', role: 'IT Admin',       status: 'Inactive', last: '30 days ago',mfa: false },
]

/* ── sub-pages ───────────────────────────────────────── */
function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a1628' }}>{title}</h2>
        {sub && <div style={{ fontSize: 13, color: '#9d94b8', marginTop: 4 }}>{sub}</div>}
      </div>
      {action}
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', padding: '11px 0', borderBottom: '1px solid #f0edf8' }}>
      <div style={{ width: 220, fontSize: 13, color: '#9d94b8', flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1628', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</div>
    </div>
  )
}

function Toggle({ on }) {
  return (
    <div style={{ width: 38, height: 22, borderRadius: 99, background: on ? '#2d7d46' : '#d1d5db', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background .2s' }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  )
}

function Tick({ on }) {
  return (
    <div style={{ width: 20, height: 20, borderRadius: 6, background: on ? '#e6f4ea' : '#f5f4f9', border: `1.5px solid ${on ? '#2d7d46' : '#e8e4f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: on ? '#2d7d46' : '#d1d5db' }}>
      {on ? '✓' : ''}
    </div>
  )
}

function PageOrgProfile() {
  return (
    <div>
      <SectionHeader title="Organisation Profile" sub="Your company's registered business information" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0edf8' }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: '#7c3aed18', border: '2px solid #c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{ORG.logo}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1628' }}>{ORG.shortName}</div>
                <div style={{ fontSize: 12.5, color: '#9d94b8' }}>{ORG.type}</div>
                <span style={{ fontSize: 11, background: '#e6f4ea', color: '#2d7d46', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>IRDAI {ORG.irdai}</span>
              </div>
            </div>
            <InfoRow label="Legal Name"    value={ORG.name} />
            <InfoRow label="Short Name"    value={ORG.shortName} />
            <InfoRow label="Business Type" value={ORG.type} />
            <InfoRow label="IRDAI Reg No." value={ORG.irdai} mono />
            <InfoRow label="PAN"           value={ORG.pan}  mono />
            <InfoRow label="CIN"           value={ORG.cin}  mono />
            <InfoRow label="Website"       value={ORG.website} />
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 14 }}>Registered Address</div>
            <div style={{ background: '#faf9fc', border: '1px solid #e8e4f0', borderRadius: 10, padding: '16px 18px', fontSize: 13.5, color: '#1a1628', lineHeight: 1.8 }}>
              {ORG.address}<br />
              {ORG.city}, {ORG.state} — {ORG.pin}<br />
              India
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 12 }}>Plan & Status</div>
              <InfoRow label="Current Plan"     value="Enterprise" />
              <InfoRow label="Billing Cycle"    value="Monthly" />
              <InfoRow label="Next Renewal"     value="01 May 2026" />
              <InfoRow label="Account Status"   value="Active ✓" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageContact() {
  return (
    <div>
      <SectionHeader title="Contact Details" sub="Key personnel and communication contacts for your organisation"
        action={<button className="btn btn-primary" style={{ fontSize: 13, padding: '7px 18px' }}>+ Add Contact</button>} />
      <div className="card">
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf9fc' }}>
                {['Role', 'Name', 'Email', 'Phone', 'Department', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11.5, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.4px', borderBottom: '1px solid #e8e4f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTACTS.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f4f9' }}>
                  <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: 600, color: '#7c3aed' }}>{c.role}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: 600, color: '#1a1628' }}>{c.name}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, color: '#5c5573' }}>{c.email}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, color: '#5c5573' }}>{c.phone}</td>
                  <td style={{ padding: '13px 14px' }}><span style={{ fontSize: 11.5, background: '#f5f3ff', color: '#7c3aed', padding: '2px 9px', borderRadius: 99, fontWeight: 600 }}>{c.dept}</span></td>
                  <td style={{ padding: '13px 14px' }}><button className="btn btn-ghost" style={{ fontSize: 12, padding: '3px 10px' }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PageGST() {
  return (
    <div>
      <SectionHeader title="GST Information" sub="Tax registration details used in invoices and compliance filing" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 16 }}>GST Registration</div>
            <InfoRow label="GSTIN"              value={GST.gstin}    mono />
            <InfoRow label="State"              value={`${GST.state} (${GST.stateCode})`} />
            <InfoRow label="HSN / SAC Code"     value={GST.hsnCode}  mono />
            <InfoRow label="Service Description"value={GST.hsnDesc}  />
            <InfoRow label="Tax Rate"           value={GST.taxRate}  />
            <InfoRow label="Filing Frequency"   value={GST.filingFreq} />
            <InfoRow label="Last Filed"         value={GST.lastFiled} />
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 16 }}>Tax Breakup Preview</div>
            {[
              ['Base Amount',   '₹12,500.00'],
              ['CGST (9%)',     '₹1,125.00'],
              ['SGST (9%)',     '₹1,125.00'],
              ['Total Invoice', '₹14,750.00'],
            ].map(([l, v], i) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid #f0edf8' : 'none', fontWeight: i === 3 ? 800 : 400, fontSize: i === 3 ? 15 : 13.5, color: i === 3 ? '#2d7d46' : '#1a1628' }}>
                <span style={{ color: i === 3 ? '#2d7d46' : '#5c5573' }}>{l}</span>
                <span>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#e6f4ea', borderRadius: 9, fontSize: 12.5, color: '#2d7d46', fontWeight: 600 }}>
              ✓ GST verified and compliant as of Mar 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageBilling() {
  return (
    <div>
      <SectionHeader title="Payments & Billing" sub="Subscription plan, payment method and billing details" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Current Plan */}
        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 16 }}>Current Subscription</div>
            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#4f1d96)', borderRadius: 12, padding: '18px 20px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Active Plan</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 2 }}>Enterprise</div>
              <div style={{ fontSize: 13, color: '#ddd6fe' }}>Unlimited agents · Unlimited customers · All modules</div>
            </div>
            <InfoRow label="Monthly Fee"    value="₹12,500 + GST" />
            <InfoRow label="Billing Cycle"  value="Monthly (1st of each month)" />
            <InfoRow label="Next Billing"   value="01 May 2026" />
            <InfoRow label="Contract Start" value="01 Jan 2024" />
            <InfoRow label="Auto-Renew"     value="Enabled" />
          </div>
        </div>

        {/* Payment Method */}
        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 16 }}>Payment Method</div>
            <div style={{ border: '1.5px solid #c4b5fd', borderRadius: 12, padding: '14px 16px', background: '#f5f3ff', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>🏦</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1628' }}>HDFC Bank — NEFT/RTGS</div>
                    <div style={{ fontSize: 12, color: '#9d94b8' }}>A/C ending ••••4521 · IFSC HDFC0001234</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, background: '#e6f4ea', color: '#2d7d46', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>Primary</span>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 12.5, width: '100%', padding: '8px' }}>+ Add Payment Method</button>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 12 }}>Billing Address</div>
              <div style={{ fontSize: 13, color: '#5c5573', lineHeight: 1.7, background: '#faf9fc', border: '1px solid #e8e4f0', borderRadius: 9, padding: '12px 14px' }}>
                {ORG.name}<br />{ORG.address}<br />{ORG.city}, {ORG.state} — {ORG.pin}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageInvoices() {
  return (
    <div>
      <SectionHeader title="Invoices" sub="Billing history and downloadable tax invoices" />
      <div className="card">
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf9fc' }}>
                {['Invoice No.', 'Date', 'Description', 'Amount', 'GST', 'Total', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11.5, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.4px', borderBottom: '1px solid #e8e4f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f4f9' }}>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: '#7c3aed' }}>{inv.no}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#5c5573' }}>{inv.date}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#1a1628' }}>{inv.desc}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#1a1628' }}>{inv.amount}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#9d94b8' }}>{inv.gst}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13.5, fontWeight: 700, color: '#1a1628' }}>{inv.total}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: inv.status === 'Paid' ? '#e6f4ea' : '#fff3e0', color: inv.status === 'Paid' ? '#2d7d46' : '#a05c00' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '3px 10px' }}>⬇ PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PageSubApp() {
  const [portals, setPortals] = useState(PORTALS)
  const toggle = key => setPortals(prev => prev.map(p => p.key === key ? { ...p, enabled: !p.enabled } : p))
  return (
    <div>
      <SectionHeader title="App Access" sub="Enable or disable portals for your organisation" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
        {portals.map(p => (
          <div key={p.key} className="card" style={{ border: `1.5px solid ${p.enabled ? '#c4b5fd' : '#e8e4f0'}` }}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: p.enabled ? '#f5f3ff' : '#faf9fc', border: `1.5px solid ${p.enabled ? '#c4b5fd' : '#e8e4f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1628', marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 12.5, color: '#9d94b8' }}>{p.desc}</div>
                <span style={{ fontSize: 11, background: '#e6f4ea', color: '#2d7d46', padding: '1px 8px', borderRadius: 99, fontWeight: 700, marginTop: 5, display: 'inline-block' }}>{p.plan}</span>
              </div>
              <div onClick={() => toggle(p.key)} style={{ cursor: 'pointer' }}>
                <Toggle on={p.enabled} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PageSubModule() {
  return (
    <div>
      <SectionHeader title="Module Access" sub="Control which modules are visible per role" />
      <div className="card">
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf9fc' }}>
                {['Module', 'Broker', 'Agent', 'Customer'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Module' ? 'left' : 'center', fontSize: 11.5, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.4px', borderBottom: '1px solid #e8e4f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f4f9' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 600, color: '#1a1628' }}>{m.module}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><Tick on={m.broker} /></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><Tick on={m.agent} /></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}><Tick on={m.customer} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PageSubPage() {
  return (
    <div>
      <SectionHeader title="Page Access" sub="Granular page-level permissions per role" />
      <div className="card">
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf9fc' }}>
                {['Page', 'Route', 'Broker', 'Agent', 'Customer'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Page' || h === 'Route' ? 'left' : 'center', fontSize: 11.5, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.4px', borderBottom: '1px solid #e8e4f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAGE_ACCESS.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f4f9' }}>
                  <td style={{ padding: '11px 16px', fontSize: 13.5, fontWeight: 600, color: '#1a1628' }}>{p.page}</td>
                  <td style={{ padding: '11px 16px', fontSize: 12, fontFamily: 'monospace', color: '#7c3aed' }}>{p.path}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}><Tick on={p.broker} /></td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}><Tick on={p.agent} /></td>
                  <td style={{ padding: '11px 16px', textAlign: 'center' }}><Tick on={p.customer} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PageAdminUsers() {
  return (
    <div>
      <SectionHeader title="Admin Users" sub="Users with platform administration access"
        action={<button className="btn btn-primary" style={{ fontSize: 13, padding: '7px 18px' }}>+ Invite Admin</button>} />
      <div className="card">
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#faf9fc' }}>
                {['User', 'Role', 'Last Active', 'MFA', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11.5, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.4px', borderBottom: '1px solid #e8e4f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_USERS.map((u, i) => {
                const initials = u.name.split(' ').map(w => w[0]).join('').slice(0, 2)
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f4f9' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: '#7c3aed18', border: '1.5px solid #c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#7c3aed', flexShrink: 0 }}>{initials}</div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1628' }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: '#9d94b8' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 12, background: '#f5f3ff', color: '#7c3aed', padding: '3px 10px', borderRadius: 99, fontWeight: 600 }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#9d94b8' }}>{u.last}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 12, background: u.mfa ? '#e6f4ea' : '#fce8e6', color: u.mfa ? '#2d7d46' : '#c0392b', padding: '3px 9px', borderRadius: 99, fontWeight: 600 }}>
                        {u.mfa ? '✓ MFA On' : '✗ Off'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 12, background: u.status === 'Active' ? '#e6f4ea' : '#f5f4f9', color: u.status === 'Active' ? '#2d7d46' : '#9d94b8', padding: '3px 9px', borderRadius: 99, fontWeight: 600 }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ fontSize: 12, padding: '3px 10px' }}>Edit</button>
                      {u.status === 'Active' && <button className="btn btn-ghost" style={{ fontSize: 12, padding: '3px 10px', color: '#dc2626' }}>Disable</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const PAGE_MAP = {
  'account-org':      <PageOrgProfile />,
  'account-contact':  <PageContact />,
  'account-gst':      <PageGST />,
  'account-billing':  <PageBilling />,
  'account-invoices': <PageInvoices />,
  'sub-app':          <PageSubApp />,
  'sub-module':       <PageSubModule />,
  'sub-page':         <PageSubPage />,
  'settings-users':   <PageAdminUsers />,
}

/* ── main layout ─────────────────────────────────────── */
export default function AdminPortal() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [active,   setActive]   = useState('account-org')
  const [expanded, setExpanded] = useState({ account: true, subscription: true, settings: true })

  const toggleSection = key => setExpanded(p => ({ ...p, [key]: !p[key] }))

  const breadcrumb = (() => {
    for (const section of NAV) {
      const child = section.children.find(c => c.key === active)
      if (child) return `${section.label} › ${child.label}`
    }
    return ''
  })()

  return (
    <div style={{ display: 'flex', gap: 0, margin: '-28px -32px', minHeight: 'calc(100vh - 58px)' }}>

      {/* ── Left sidebar ── */}
      <div style={{ width: 240, flexShrink: 0, background: '#1a1628', display: 'flex', flexDirection: 'column' }}>
        {/* Sidebar header */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>Admin Console</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>InsureRight</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>K.M. Dastur & Co.</div>
        </div>

        {/* Nav sections */}
        <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {NAV.map(section => (
            <div key={section.key}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'rgba(255,255,255,0.6)', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8, textAlign: 'left' }}>
                <span style={{ fontSize: 14 }}>{section.icon}</span>
                <span style={{ flex: 1 }}>{section.label}</span>
                <span style={{ fontSize: 10, transform: expanded[section.key] ? 'rotate(180deg)' : 'none', transition: 'transform .2s', opacity: .5 }}>▾</span>
              </button>

              {/* Children */}
              {expanded[section.key] && section.children.map(child => {
                const isActive = active === child.key
                return (
                  <button
                    key={child.key}
                    onClick={() => setActive(child.key)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 0,
                      padding: '9px 18px 9px 40px', background: isActive ? 'rgba(124,58,237,0.3)' : 'none',
                      border: 'none', borderLeft: `3px solid ${isActive ? '#a78bfa' : 'transparent'}`,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                      transition: 'all .12s',
                    }}>
                    {child.label}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
            ← Back to Portal
          </button>
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f4f9', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e4f0', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11.5, color: '#9d94b8', marginBottom: 2 }}>Admin Console</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1628' }}>{breadcrumb}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, color: '#9d94b8' }}>Signed in as</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 8, padding: '5px 11px' }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#7c3aed' }}>{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {PAGE_MAP[active]}
        </div>
      </div>
    </div>
  )
}
