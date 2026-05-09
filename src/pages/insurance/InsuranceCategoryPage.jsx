import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const CATEGORY_DATA = {
  car: {
    label: 'Car Insurance', icon: '🚗', color: '#0a7ea4', bg: '#e0f4fb', border: '#7ecae0',
    heroGradient: 'linear-gradient(135deg,#0a3d56 0%,#0a7ea4 100%)',
    tagline: 'Comprehensive & Third Party cover for your car',
    stats: [{ v: '₹3,600/yr*', l: 'Starting from' }, { v: '6,800+', l: 'Cashless Garages' }, { v: '24×7', l: 'Roadside Help' }],
    plans: [
      { id: 4, name: 'Bajaj Allianz Comprehensive Motor', code: 'BAJ-MC-004', ic: 'Bajaj Allianz', logo: '🔵', premium: 4800, si: 'IDV-based', highlights: ['Zero depreciation cover', 'Engine protection add-on', '24×7 roadside assistance', 'Cashless at 4,000+ garages'] },
      { id: 5, name: 'New India Motor OD + TP',           code: 'NIA-MC-005', ic: 'New India',    logo: '🇮🇳', premium: 3600, si: 'IDV-based', highlights: ['Own damage + third party', 'Personal accident ₹15L', 'NCB retention on claim-free year', 'Pan-India cashless garages'] },
      { id: 20,name: 'HDFC ERGO Motor Comprehensive',     code: 'HER-MC-020', ic: 'HDFC ERGO',   logo: '🏦', premium: 5200, si: 'IDV-based', highlights: ['Bumper-to-bumper cover', 'Depreciation waiver', 'Key replacement cover', 'Cashless at 6,800+ garages'] },
      { id: 21,name: 'ICICI Lombard Car Insurance',       code: 'ICL-MC-021', ic: 'ICICI Lombard',logo: '🛡️',premium: 4100, si: 'IDV-based', highlights: ['3-year OD cover option', 'Spot claim settlement', 'Consumables cover', '24×7 roadside assistance'] },
    ],
  },
  'two-wheeler': {
    label: 'Two-Wheeler Insurance', icon: '🏍️', color: '#f97316', bg: '#fff7ed', border: '#fed7aa',
    heroGradient: 'linear-gradient(135deg,#7c2d12 0%,#f97316 100%)',
    tagline: 'Comprehensive cover for bikes & scooters',
    stats: [{ v: '₹1,200/yr*', l: 'Starting from' }, { v: '4,000+', l: 'Cashless Garages' }, { v: 'Instant', l: 'Policy Issuance' }],
    plans: [
      { id: 10,name: 'ICICI Lombard Two Wheeler',          code: 'ICL-TW-010', ic: 'ICICI Lombard',logo: '🛡️',premium: 1800, si: 'IDV-based', highlights: ['Comprehensive two-wheeler plan', 'Zero depreciation available', 'Personal accident ₹15L', 'Instant policy issuance'] },
      { id: 22,name: 'Bajaj Allianz Two-Wheeler Complete', code: 'BAJ-TW-022', ic: 'Bajaj Allianz',logo: '🔵',premium: 1500, si: 'IDV-based', highlights: ['OD + third party cover', 'Roadside assistance', 'Pillion rider PA cover', 'Cashless at 4,000+ garages'] },
      { id: 23,name: 'New India Two-Wheeler OD + TP',      code: 'NIA-TW-023', ic: 'New India',   logo: '🇮🇳',premium: 1200, si: 'IDV-based', highlights: ['Government-backed insurer', 'Pan-India cashless network', 'No-claim bonus up to 50%', 'Personal accident ₹15L'] },
    ],
  },
  'term-life': {
    label: 'Term Life Insurance', icon: '🛡️', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd',
    heroGradient: 'linear-gradient(135deg,#3b0764 0%,#7c3aed 100%)',
    tagline: 'Pure protection for your family\'s financial future',
    stats: [{ v: '₹6,200/yr*', l: 'Starting from' }, { v: '99.5%', l: 'Claim Ratio' }, { v: '₹5 Cr', l: 'Max Cover' }],
    plans: [
      { id: 24,name: 'HDFC Life Click 2 Protect Plus', code: 'HDFC-TP-024', ic: 'HDFC Life', logo: '🔷', premium: 8400, si: '₹50L – ₹5Cr', highlights: ['Pure term protection', 'Return of premium option', 'Critical illness rider available', '99.5% claim settlement'] },
      { id: 25,name: 'LIC Tech Term Plan',              code: 'LIC-TT-025', ic: 'LIC',       logo: '🏦', premium: 6200, si: '₹25L – ₹5Cr', highlights: ['Online pure term plan', 'Level or increasing cover', '98.6% claim settlement', 'Tax benefit under 80C'] },
    ],
  },
  investment: {
    label: 'Investment Plans', icon: '📈', color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd',
    heroGradient: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%)',
    tagline: 'ULIP and savings plans for long-term wealth creation',
    stats: [{ v: '₹12,000/yr*', l: 'Starting from' }, { v: '99.5%', l: 'Claim Ratio' }, { v: '80C', l: 'Tax Benefit' }],
    plans: [
      { id: 6, name: 'LIC Jeevan Anand',          code: 'LIC-LA-006',   ic: 'LIC',       logo: '🏦', premium: 12000, si: '₹10L – ₹1Cr', highlights: ['Whole-life + endowment plan', 'Death + maturity benefit', 'Guaranteed bonus every year', 'Loan facility against policy'] },
      { id: 7, name: 'HDFC Life Sanchay Plus',     code: 'HDFC-LSP-007', ic: 'HDFC Life', logo: '🔷', premium: 18000, si: '₹25L – ₹2Cr', highlights: ['Guaranteed returns', 'Flexible payout options', 'Income or lump-sum benefit', 'Tax benefit 80C & 10(10D)'] },
    ],
  },
  travel: {
    label: 'Travel Insurance', icon: '✈️', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7',
    heroGradient: 'linear-gradient(135deg,#064e3b 0%,#059669 100%)',
    tagline: 'Domestic & international travel coverage',
    stats: [{ v: '₹1,800/yr*', l: 'Starting from' }, { v: '$5,00,000', l: 'Max Cover' }, { v: '24×7', l: 'Global Assist' }],
    plans: [
      { id: 26,name: 'HDFC ERGO Travel Shield',   code: 'HER-TR-026', ic: 'HDFC ERGO',   logo: '🏦', premium: 1800, si: '$2,50,000', highlights: ['Medical emergency cover', 'Trip cancellation cover', 'Baggage loss & delay', '24×7 global assistance'] },
      { id: 27,name: 'Bajaj Allianz Travel Ace',  code: 'BAJ-TR-027', ic: 'Bajaj Allianz',logo: '🔵',premium: 2200, si: '$5,00,000', highlights: ['Individual & family plans', 'Emergency medical evacuation', 'Passport loss cover', 'Student travel option'] },
    ],
  },
  home: {
    label: 'Home Insurance', icon: '🏠', color: '#a05c00', bg: '#fff3e0', border: '#fcd34d',
    heroGradient: 'linear-gradient(135deg,#451a03 0%,#a05c00 100%)',
    tagline: 'Protect your home structure and contents',
    stats: [{ v: '₹2,800/yr*', l: 'Starting from' }, { v: '₹2 Cr', l: 'Max Cover' }, { v: 'All Risk', l: 'Coverage' }],
    plans: [
      { id: 28,name: 'Bajaj Allianz Home Shield',  code: 'BAJ-HM-028', ic: 'Bajaj Allianz',logo: '🔵',premium: 3500, si: '₹20L – ₹2Cr', highlights: ['Structure + contents cover', 'Natural disaster protection', 'Burglary & theft', 'Liability cover'] },
      { id: 29,name: 'HDFC ERGO Home Complete',    code: 'HER-HM-029', ic: 'HDFC ERGO',   logo: '🏦', premium: 2800, si: '₹15L – ₹1Cr', highlights: ['All-risk home cover', 'Electrical & mechanical breakdown', 'Personal accident cover', 'Rent for alternate accommodation'] },
    ],
  },
  business: {
    label: 'Business Insurance', icon: '🏢', color: '#5c5573', bg: '#f9f8fd', border: '#d1cde8',
    heroGradient: 'linear-gradient(135deg,#1a1628 0%,#5c5573 100%)',
    tagline: 'SME & commercial insurance for your business',
    stats: [{ v: '₹12,000/yr*', l: 'Starting from' }, { v: '₹5 Cr', l: 'Max Cover' }, { v: 'SME+', l: 'Package Policy' }],
    plans: [
      { id: 30,name: 'ICICI Lombard Business Guard', code: 'ICL-BG-030', ic: 'ICICI Lombard',logo: '🛡️',premium: 15000, si: '₹50L – ₹5Cr', highlights: ['Fire & allied perils', 'Burglary & theft', 'Public liability', 'Business interruption cover'] },
      { id: 31,name: 'Bajaj Allianz SME Shield',     code: 'BAJ-BG-031', ic: 'Bajaj Allianz',logo: '🔵',premium: 12000, si: '₹25L – ₹2Cr', highlights: ['Package policy for SMEs', 'Employee liability cover', 'Goods in transit', 'Workers compensation'] },
    ],
  },
}

function QuoteModal({ plan, cat, onClose }) {
  const [phone, setPhone]   = useState('')
  const [submitted, setSub] = useState(false)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,10,40,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, maxWidth: 440, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,.2)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        <div style={{ background: cat.bg, padding: '20px 24px', borderBottom: `1.5px solid ${cat.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', border: `1.5px solid ${cat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            {cat.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#1a1628' }}>{plan.name}</div>
            <div style={{ fontSize: 12.5, color: '#9d94b8', marginTop: 2 }}>{plan.logo} {plan.ic}</div>
          </div>
          <button type="button" onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #e8e4f0', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9d94b8', flexShrink: 0 }}>
            ✕
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {!submitted ? (
            <>
              <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                <div style={{ flex: 1, padding: '12px 14px', background: '#faf9fc', borderRadius: 10, border: '1px solid #e8e4f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Starting Premium</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: cat.color }}>₹{plan.premium.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: '#9d94b8' }}>/yr</span></div>
                </div>
                <div style={{ flex: 1, padding: '12px 14px', background: '#faf9fc', borderRadius: 10, border: '1px solid #e8e4f0', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Sum Insured</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1628' }}>{plan.si}</div>
                </div>
              </div>

              <div style={{ padding: '14px 16px', background: '#f5f3ff', borderRadius: 10, border: '1px solid #c4b5fd', marginBottom: 22 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>📞 Get a Personalized Quote</div>
                <div style={{ fontSize: 12.5, color: '#5c5573', lineHeight: 1.6 }}>
                  Our licensed advisor will prepare a customized quote for <strong>{plan.name}</strong> and call you within 24 hours.
                </div>
              </div>

              <form onSubmit={e => { e.preventDefault(); if (phone.length >= 10) setSub(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#5c5573', marginBottom: 6 }}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ padding: '10px 12px', background: '#f5f3ff', border: '1.5px solid #c4b5fd', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#7c3aed', flexShrink: 0 }}>+91</div>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter mobile number" required
                      style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e8e4f0', borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: '#9d94b8' }}>No spam. Our licensed advisor will contact you.</div>
                <button type="submit" style={{ padding: '13px', borderRadius: 10, border: 'none', background: cat.color, color: '#fff', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Request Callback →
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1628', marginBottom: 8 }}>Request Received!</div>
              <div style={{ fontSize: 13.5, color: '#5c5573', lineHeight: 1.7, marginBottom: 20 }}>
                Our advisor will call <strong>+91 {phone}</strong> within 24 hours with a quote for <strong>{plan.name}</strong>.
              </div>
              <button type="button" onClick={onClose}
                style={{ padding: '10px 28px', borderRadius: 8, border: `1.5px solid ${cat.border}`, background: cat.bg, color: cat.color, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InsuranceCategoryPage() {
  const { type }    = useParams()
  const navigate    = useNavigate()
  const [modal, setModal] = useState(null)

  const cat = CATEGORY_DATA[type]

  if (!cat) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#9d94b8' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1628', marginBottom: 8 }}>Insurance type not found</div>
        <button type="button" onClick={() => navigate('/insurance/health')}
          style={{ padding: '10px 24px', borderRadius: 9, border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', marginTop: 12 }}>
          View Health Insurance →
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '-28px -32px' }}>

      {/* ── Hero ── */}
      <div style={{ background: cat.heroGradient, padding: '40px 48px 44px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/dashboard')}>Home</span>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{cat.label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
              {cat.icon}
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                {cat.label}
              </div>
              <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                {cat.tagline}
              </h1>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}>
                IRDAI-licensed broker · K.M. Dastur & Co. · Advisor-assisted purchase
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {cat.stats.map(s => (
              <div key={s.l} style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.12)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Advisory notice ── */}
      <div style={{ background: '#fffbeb', borderBottom: '1.5px solid #fde68a', padding: '14px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>💬</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: '#92400e', marginBottom: 2 }}>{cat.icon} {cat.label} — Advisor-assisted purchase</div>
            <div style={{ fontSize: 12.5, color: '#78350f', lineHeight: 1.6 }}>
              These plans are available through our licensed advisors who guide you through selection, documentation, and issuance.
              Click <strong>Get Quote</strong> on any plan — our advisor will call you within 24 hours.
            </div>
          </div>
        </div>
      </div>

      {/* ── Plans ── */}
      <div style={{ padding: '32px 48px 48px', background: '#f5f4f9', flex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1628', marginBottom: 4 }}>
            {cat.plans.length} {cat.label} Plan{cat.plans.length !== 1 ? 's' : ''} Available
          </div>
          <div style={{ fontSize: 13, color: '#9d94b8', marginBottom: 22 }}>
            Select a plan and our advisor will contact you with a personalized quote
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {cat.plans.map(plan => (
              <div key={plan.id} style={{
                background: '#fff', border: `1.5px solid ${cat.border}`,
                borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column',
                transition: 'box-shadow .15s, transform .15s',
              }}>
                {/* Card header */}
                <div style={{ background: cat.bg, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${cat.border}` }}>
                  <span style={{ fontSize: 22 }}>{plan.logo}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '.5px' }}>{plan.ic}</div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5, color: '#1a1628', lineHeight: 1.3, marginBottom: 4 }}>{plan.name}</div>
                    <div style={{ fontSize: 11.5, color: '#bbb', fontFamily: 'monospace' }}>{plan.code}</div>
                  </div>

                  <div style={{ display: 'flex', background: '#faf9fc', borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e4f0' }}>
                    <div style={{ flex: 1, padding: '10px 14px', borderRight: '1px solid #e8e4f0' }}>
                      <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 2 }}>Starting from</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: cat.color }}>₹{plan.premium.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: '#9d94b8' }}>/yr</span></div>
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 2 }}>Sum Insured</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1628' }}>{plan.si}</div>
                    </div>
                  </div>

                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {plan.highlights.map(h => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: '#3d3555' }}>
                        <span style={{ color: cat.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action */}
                <div style={{ padding: '14px 18px', borderTop: '1px solid #f0edf8' }}>
                  <button type="button" onClick={() => setModal(plan)}
                    style={{ width: '100%', padding: '11px', borderRadius: 9, border: `2px solid ${cat.color}`, background: cat.bg, color: cat.color, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .15s' }}>
                    Get Quote →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Switch to Health CTA */}
          <div style={{ marginTop: 40, padding: '24px 28px', background: '#fff', borderRadius: 14, border: '1.5px solid #e8e4f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1628', marginBottom: 4 }}>Looking for Health Insurance?</div>
              <div style={{ fontSize: 13, color: '#9d94b8' }}>Compare and buy health plans online with instant policy issuance.</div>
            </div>
            <button type="button" onClick={() => navigate('/insurance/health')}
              style={{ padding: '11px 24px', borderRadius: 9, border: 'none', background: '#2d7d46', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              🏥 View Health Plans →
            </button>
          </div>
        </div>
      </div>

      {modal && <QuoteModal plan={modal} cat={cat} onClose={() => setModal(null)} />}
    </div>
  )
}
