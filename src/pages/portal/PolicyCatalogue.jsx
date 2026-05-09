import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IC_BY_NAME } from '../../data/icData'

const CATEGORIES = [
  { id: 'health',      label: 'Health',      icon: '🏥', color: '#2d7d46', bg: '#e6f4ea', border: '#a8d5b5', live: true,  desc: 'Medical & hospitalisation' },
  { id: 'car',         label: 'Car',         icon: '🚗', color: '#0a7ea4', bg: '#e0f4fb', border: '#7ecae0', live: false, desc: 'Comprehensive & TP cover' },
  { id: 'two-wheeler', label: 'Two-Wheeler', icon: '🏍️', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', live: false, desc: 'Bike & scooter plans' },
  { id: 'term-life',   label: 'Term Life',   icon: '🛡️', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd', live: false, desc: 'Pure term protection' },
  { id: 'investment',  label: 'Investment',  icon: '📈', color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd', live: false, desc: 'ULIP & savings plans' },
  { id: 'travel',      label: 'Travel',      icon: '✈️', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7', live: false, desc: 'Domestic & international' },
  { id: 'home',        label: 'Home',        icon: '🏠', color: '#a05c00', bg: '#fff3e0', border: '#fcd34d', live: false, desc: 'Home structure & contents' },
  { id: 'business',    label: 'Business',    icon: '🏢', color: '#5c5573', bg: '#f9f8fd', border: '#d1cde8', live: false, desc: 'SME & commercial plans' },
]
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

const PRODUCTS = [
  // Health — buy flow live
  { id: 1,  cat: 'health',      name: 'Star Comprehensive Health',          code: 'SHI-HC-001',   ic: 'Star Health Insurance', premium: 8500,  si: '₹5L – ₹50L',  highlights: ['In-patient hospitalisation', 'Day care procedures', 'Pre & post hospitalisation 60/180 days', 'Ambulance cover — road & air'] },
  { id: 2,  cat: 'health',      name: 'HDFC ERGO Optima Secure',            code: 'HER-HS-002',   ic: 'HDFC ERGO',             premium: 6200,  si: '₹3L – ₹25L',  highlights: ['No room-rent sub-limit', 'Unlimited restoration of SI', 'NCB up to 50%', 'Cashless at 10,000+ hospitals'] },
  { id: 3,  cat: 'health',      name: 'ICICI Lombard Complete Health',      code: 'ICL-HC-003',   ic: 'ICICI Lombard',         premium: 9100,  si: '₹5L – ₹1Cr',  highlights: ['OPD cover included', 'Maternity & new-born cover', 'AYUSH treatment covered', 'Global cover option'] },
  { id: 9,  cat: 'health',      name: 'Star Senior Citizen Red Carpet',     code: 'SHI-SH-009',   ic: 'Star Health Insurance', premium: 14000, si: '₹3L – ₹15L',  highlights: ['Entry age up to 75 years', 'No pre-policy health check-up', 'Day-care & domiciliary covered', 'Cashless at Star network hospitals'] },
  { id: 11, cat: 'health',      name: 'Bajaj Allianz Health Guard',         code: 'BAJ-HG-011',   ic: 'Bajaj Allianz',         premium: 5500,  si: '₹3L – ₹10L',  highlights: ['Group health for employees', 'Maternity benefit included', 'Pre-existing diseases covered', 'Floater & individual options'] },

  // Car
  { id: 4,  cat: 'car',         name: 'Bajaj Allianz Comprehensive Motor',  code: 'BAJ-MC-004',   ic: 'Bajaj Allianz',         premium: 4800,  si: 'IDV-based',    highlights: ['Zero depreciation cover', 'Engine protect add-on', '24×7 roadside assistance', 'Cashless at 4,000+ garages'] },
  { id: 5,  cat: 'car',         name: 'New India Motor OD + TP',            code: 'NIA-MC-005',   ic: 'New India Assurance',   premium: 3600,  si: 'IDV-based',    highlights: ['Own damage + third party', 'Personal accident cover ₹15L', 'NCB retention on claim-free year', 'Pan-India cashless garages'] },
  { id: 20, cat: 'car',         name: 'HDFC ERGO Motor Comprehensive',      code: 'HER-MC-020',   ic: 'HDFC ERGO',             premium: 5200,  si: 'IDV-based',    highlights: ['Bumper-to-bumper cover', 'Depreciation waiver', 'Key replacement cover', 'Cashless at 6,800+ garages'] },
  { id: 21, cat: 'car',         name: 'ICICI Lombard Car Insurance',        code: 'ICL-MC-021',   ic: 'ICICI Lombard',         premium: 4100,  si: 'IDV-based',    highlights: ['3-year OD cover option', 'Spot claim settlement', 'Consumables cover', '24×7 roadside assistance'] },

  // Two-Wheeler
  { id: 10, cat: 'two-wheeler', name: 'ICICI Lombard Two Wheeler',          code: 'ICL-TW-010',   ic: 'ICICI Lombard',         premium: 1800,  si: 'IDV-based',    highlights: ['Comprehensive two-wheeler plan', 'Zero depreciation available', 'Personal accident ₹15L', 'Instant policy issuance'] },
  { id: 22, cat: 'two-wheeler', name: 'Bajaj Allianz Two-Wheeler Complete', code: 'BAJ-TW-022',   ic: 'Bajaj Allianz',         premium: 1500,  si: 'IDV-based',    highlights: ['OD + third party cover', 'Roadside assistance', 'Pillion rider PA cover', 'Cashless at 4,000+ garages'] },
  { id: 23, cat: 'two-wheeler', name: 'New India Two-Wheeler OD + TP',     code: 'NIA-TW-023',   ic: 'New India Assurance',   premium: 1200,  si: 'IDV-based',    highlights: ['Government-backed insurer', 'Pan-India cashless network', 'No-claim bonus up to 50%', 'Personal accident ₹15L'] },

  // Term Life
  { id: 24, cat: 'term-life',   name: 'HDFC Life Click 2 Protect Plus',    code: 'HDFC-TP-024',  ic: 'HDFC Life',             premium: 8400,  si: '₹50L – ₹5Cr', highlights: ['Pure term protection', 'Return of premium option', 'Critical illness rider available', '99.5% claim settlement'] },
  { id: 25, cat: 'term-life',   name: 'LIC Tech Term Plan',                 code: 'LIC-TT-025',   ic: 'LIC',                   premium: 6200,  si: '₹25L – ₹5Cr', highlights: ['Online pure term plan', 'Level or increasing cover', '98.6% claim settlement', 'Tax benefit under 80C'] },

  // Investment
  { id: 6,  cat: 'investment',  name: 'LIC Jeevan Anand',                   code: 'LIC-LA-006',   ic: 'LIC',                   premium: 12000, si: '₹10L – ₹1Cr', highlights: ['Whole-life + endowment plan', 'Death + maturity benefit', 'Guaranteed bonus every year', 'Loan facility against policy'] },
  { id: 7,  cat: 'investment',  name: 'HDFC Life Sanchay Plus',             code: 'HDFC-LSP-007', ic: 'HDFC Life',             premium: 18000, si: '₹25L – ₹2Cr', highlights: ['Guaranteed returns', 'Flexible payout options', 'Income or lump-sum benefit', 'Tax benefit under 80C & 10(10D)'] },

  // Travel
  { id: 26, cat: 'travel',      name: 'HDFC ERGO Travel Shield',            code: 'HER-TR-026',   ic: 'HDFC ERGO',             premium: 1800,  si: '$2,50,000',    highlights: ['Medical emergency cover', 'Trip cancellation cover', 'Baggage loss & delay', '24×7 global assistance'] },
  { id: 27, cat: 'travel',      name: 'Bajaj Allianz Travel Ace',           code: 'BAJ-TR-027',   ic: 'Bajaj Allianz',         premium: 2200,  si: '$5,00,000',    highlights: ['Individual & family plans', 'Emergency medical evacuation', 'Passport loss cover', 'Student travel option'] },

  // Home
  { id: 28, cat: 'home',        name: 'Bajaj Allianz Home Shield',          code: 'BAJ-HM-028',   ic: 'Bajaj Allianz',         premium: 3500,  si: '₹20L – ₹2Cr', highlights: ['Structure + contents cover', 'Natural disaster protection', 'Burglary & theft', 'Liability cover'] },
  { id: 29, cat: 'home',        name: 'HDFC ERGO Home Complete',            code: 'HER-HM-029',   ic: 'HDFC ERGO',             premium: 2800,  si: '₹15L – ₹1Cr', highlights: ['All-risk home cover', 'Electrical & mechanical breakdown', 'Personal accident cover', 'Rent for alternate accommodation'] },

  // Business
  { id: 30, cat: 'business',    name: 'ICICI Lombard Business Guard',       code: 'ICL-BG-030',   ic: 'ICICI Lombard',         premium: 15000, si: '₹50L – ₹5Cr', highlights: ['Fire & allied perils', 'Burglary & theft', 'Public liability', 'Business interruption cover'] },
  { id: 31, cat: 'business',    name: 'Bajaj Allianz SME Shield',           code: 'BAJ-BG-031',   ic: 'Bajaj Allianz',         premium: 12000, si: '₹25L – ₹2Cr', highlights: ['Package policy for SMEs', 'Employee liability cover', 'Goods in transit', 'Workers compensation'] },
]

function QuoteModal({ product, onClose }) {
  const [phone, setPhone]       = useState('')
  const [submitted, setSubmit]  = useState(false)
  const cat = CAT_MAP[product.cat]
  const ic  = IC_BY_NAME[product.ic]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phone.length >= 10) setSubmit(true)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(20,10,40,0.45)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, maxWidth: 440, width: '100%',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: cat.bg, padding: '20px 24px', borderBottom: `1.5px solid ${cat.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', border: `1.5px solid ${cat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {cat.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#1a1628', lineHeight: 1.3 }}>{product.name}</div>
            <div style={{ fontSize: 12.5, color: '#9d94b8', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
              {ic && <span>{ic.logo}</span>} {product.ic}
            </div>
          </div>
          <button type="button" onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #e8e4f0', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9d94b8', flexShrink: 0 }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {!submitted ? (
            <>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1, padding: '12px 14px', background: '#faf9fc', borderRadius: 10, border: '1px solid #e8e4f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Starting Premium</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: cat.color }}>₹{product.premium.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: '#9d94b8' }}>/yr</span></div>
                </div>
                <div style={{ flex: 1, padding: '12px 14px', background: '#faf9fc', borderRadius: 10, border: '1px solid #e8e4f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Sum Insured</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1628' }}>{product.si}</div>
                </div>
              </div>

              <div style={{ padding: '14px 16px', background: '#f5f3ff', borderRadius: 10, border: '1px solid #c4b5fd', marginBottom: 22 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed', marginBottom: 4 }}>📞 Get a Personalized Quote</div>
                <div style={{ fontSize: 12.5, color: '#5c5573', lineHeight: 1.6 }}>
                  Our licensed insurance advisor will prepare a customized quote for <strong>{product.name}</strong> and call you within 24 hours.
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#5c5573', marginBottom: 6 }}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ padding: '10px 12px', background: '#f5f3ff', border: '1.5px solid #c4b5fd', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#7c3aed', flexShrink: 0 }}>+91</div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter your mobile number"
                      required
                      style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e8e4f0', borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', outline: 'none' }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: '#9d94b8' }}>
                  By requesting a callback, you agree to be contacted by our licensed advisor. No spam, ever.
                </div>
                <button type="submit"
                  style={{ padding: '13px', borderRadius: 10, border: 'none', background: cat.color, color: '#fff', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Request Callback →
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1628', marginBottom: 8 }}>Request Received!</div>
              <div style={{ fontSize: 13.5, color: '#5c5573', lineHeight: 1.7, marginBottom: 20 }}>
                Our advisor will call <strong>+91 {phone}</strong> within 24 hours with a personalized quote for <strong>{product.name}</strong>.
              </div>
              <button type="button" onClick={onClose}
                style={{ padding: '10px 28px', borderRadius: 8, border: `1.5px solid ${cat.border}`, background: cat.bg, color: cat.color, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PolicyCatalogue() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('health')
  const [search, setSearch]       = useState('')
  const [quoteModal, setModal]    = useState(null)

  const cat     = CAT_MAP[activeCat]
  const visible = PRODUCTS.filter(p => {
    const q = search.toLowerCase()
    return p.cat === activeCat && (!q || p.name.toLowerCase().includes(q) || p.ic.toLowerCase().includes(q))
  })

  const catICs = [...new Set(PRODUCTS.filter(p => p.cat === activeCat).map(p => p.ic))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#2d7d46 0%,#14532d 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#bbf7d0', marginBottom: 6, fontWeight: 500 }}>Insurance Catalogue — K.M. Dastur & Co.</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Buy a Policy</div>
        <div style={{ fontSize: 13.5, color: '#dcfce7' }}>Health, Motor, Life, Travel, Home & more — from India's trusted insurers</div>
      </div>

      {/* Category selector */}
      <div style={{ background: '#fff', border: '1.5px solid #e8e4f0', borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 14 }}>
          Select Insurance Type
        </div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map(c => {
            const isActive = activeCat === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => { setActiveCat(c.id); setSearch('') }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '12px 16px', borderRadius: 12, flexShrink: 0, minWidth: 90,
                  border: `2px solid ${isActive ? c.color : '#e8e4f0'}`,
                  background: isActive ? c.color : '#faf9fc',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all .15s',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: 26 }}>{c.icon}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: isActive ? '#fff' : '#1a1628' }}>{c.label}</span>
                <span style={{ fontSize: 10.5, color: isActive ? 'rgba(255,255,255,0.8)' : '#9d94b8', textAlign: 'center', lineHeight: 1.3 }}>{c.desc}</span>
                {c.live && (
                  <span style={{
                    position: 'absolute', top: -8, right: -8,
                    padding: '2px 7px', borderRadius: 99, fontSize: 9.5, fontWeight: 800,
                    background: '#2d7d46', color: '#fff', letterSpacing: '.3px',
                    border: '2px solid #fff',
                  }}>LIVE</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Non-health advisory notice */}
      {!cat.live && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💬</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: '#92400e', marginBottom: 3 }}>{cat.icon} {cat.label} plans — Advisor-assisted purchase</div>
            <div style={{ fontSize: 12.5, color: '#78350f', lineHeight: 1.6 }}>
              These plans are available through our licensed advisors who will guide you through the selection, documentation, and issuance process.
              Click <strong>Get Quote</strong> on any plan below and our advisor will call you within 24 hours.
            </div>
          </div>
        </div>
      )}

      {/* IC partner strip for selected category */}
      <div style={{ background: '#fff', border: '1.5px solid #e8e4f0', borderRadius: 12, padding: '14px 20px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 10 }}>
          {cat.icon} {cat.label} — Available from
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {catICs.map(icName => {
            const ic = IC_BY_NAME[icName]
            if (!ic) return null
            return (
              <button key={icName} type="button" onClick={() => navigate('/insurance-partners')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, border: `1.5px solid ${ic.border}`, background: ic.bg, cursor: 'pointer', fontFamily: 'inherit' }}
                title="View all insurance partners">
                <span style={{ fontSize: 15 }}>{ic.logo}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: ic.color }}>{ic.shortName}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#2d7d46' }}>{ic.claimRatio}% claims</span>
              </button>
            )
          })}
          <button type="button" onClick={() => navigate('/insurance-partners')}
            style={{ padding: '6px 14px', borderRadius: 99, border: '1.5px dashed #c4b5fd', background: '#faf9fc', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, color: '#7c3aed', fontWeight: 600 }}>
            All Partners →
          </button>
        </div>
      </div>

      {/* Search + count */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="text"
          placeholder={`Search ${cat.label} plans or insurers…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '9px 14px', fontSize: 13, border: '1.5px solid #e8e4f0', borderRadius: 8, outline: 'none', fontFamily: 'inherit', background: '#fff' }}
        />
        <span style={{ fontSize: 13, color: '#9d94b8', whiteSpace: 'nowrap' }}>{visible.length} plan{visible.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Product cards */}
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9d94b8', fontSize: 14 }}>
          No {cat.label} plans match your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 18 }}>
          {visible.map(p => {
            const ic = IC_BY_NAME[p.ic]
            return (
              <div key={p.id} style={{
                background: '#fff', border: `1.5px solid ${cat.border}`,
                borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column',
              }}>

                {/* Card header */}
                <div style={{ background: cat.bg, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${cat.border}` }}>
                  <span style={{ fontSize: 20 }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '.5px' }}>{cat.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.8)', border: `1px solid ${cat.border}` }}>
                    {ic && <span style={{ fontSize: 13 }}>{ic.logo}</span>}
                    {ic && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#2d7d46' }}>{ic.claimRatio}% claims</span>}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1628', lineHeight: 1.3, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12.5, color: '#9d94b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                      {ic && <span>{ic.logo}</span>} {p.ic}
                      <span style={{ color: '#e0d9f0' }}>·</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.code}</span>
                    </div>
                  </div>

                  {/* Premium & SI */}
                  <div style={{ display: 'flex', background: '#faf9fc', borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e4f0' }}>
                    <div style={{ flex: 1, padding: '10px 14px', borderRight: '1px solid #e8e4f0' }}>
                      <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Starting from</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: cat.color }}>₹{p.premium.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: '#9d94b8' }}>/yr</span></div>
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Sum Insured</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1628' }}>{p.si}</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {p.highlights.map(h => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: '#3d3555' }}>
                        <span style={{ color: cat.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action button */}
                <div style={{ padding: '14px 18px', borderTop: '1px solid #f0edf8' }}>
                  {cat.live ? (
                    <button
                      type="button"
                      onClick={() => navigate('/policy/buy', { state: { productId: p.id, productName: p.name, insuranceType: 'Health' } })}
                      style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: cat.color, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .15s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Buy Now →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setModal(p)}
                      style={{ width: '100%', padding: '11px', borderRadius: 8, border: `2px solid ${cat.color}`, background: cat.bg, color: cat.color, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .15s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Get Quote →
                    </button>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* Quote modal */}
      {quoteModal && <QuoteModal product={quoteModal} onClose={() => setModal(null)} />}

    </div>
  )
}
