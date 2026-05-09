import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const HEALTH_PLANS = [
  {
    id: 1, name: 'Star Comprehensive Health', code: 'SHI-HC-001',
    ic: 'Star Health', logo: '⭐', icColor: '#e53935',
    claimRatio: 90, hospitals: 14000,
    premiums: { individual: 8500, family: 14200, parents: 18000, senior: 18000 },
    minSI: 300000, maxSI: 5000000,
    roomRent: 'No sub-limit', waitingPeriod: '30 days', restore: 'Yes',
    highlights: ['In-patient hospitalisation covered', 'Day care — 540+ procedures', 'Pre & post hosp 60/180 days', 'Ambulance — road & air', 'AYUSH treatment covered'],
    addOns: ['Critical Illness', 'OPD Cover', 'PA Rider'],
    badge: 'Most Popular',
  },
  {
    id: 2, name: 'HDFC ERGO Optima Secure', code: 'HER-HS-002',
    ic: 'HDFC ERGO', logo: '🏦', icColor: '#1565c0',
    claimRatio: 91, hospitals: 10000,
    premiums: { individual: 6200, family: 11000, parents: 15000, senior: 16000 },
    minSI: 300000, maxSI: 2500000,
    roomRent: 'Single AC Room', waitingPeriod: '30 days', restore: 'Unlimited',
    highlights: ['No room-rent sub-limit (SI ≥ ₹5L)', 'Unlimited restoration of SI', 'NCB up to 50%', 'Cashless at 10,000+ hospitals', 'Direct claim settlement'],
    addOns: ['Personal Accident', 'Maternity'],
    badge: 'Best Value',
  },
  {
    id: 3, name: 'ICICI Lombard Complete Health', code: 'ICL-HC-003',
    ic: 'ICICI Lombard', logo: '🛡️', icColor: '#f57c00',
    claimRatio: 88, hospitals: 14000,
    premiums: { individual: 9100, family: 15400, parents: 20000, senior: 21000 },
    minSI: 500000, maxSI: 10000000,
    roomRent: '2% of SI', waitingPeriod: '30 days', restore: 'Yes',
    highlights: ['OPD cover included', 'Maternity & new-born cover', 'AYUSH treatment', 'Global emergency cover', 'Telemedicine included'],
    addOns: ['Critical Illness', 'Vision Cover'],
    badge: null,
  },
  {
    id: 4, name: 'Star Senior Citizen Red Carpet', code: 'SHI-SH-009',
    ic: 'Star Health', logo: '⭐', icColor: '#e53935',
    claimRatio: 90, hospitals: 14000,
    premiums: { individual: 14000, family: 22000, parents: 14000, senior: 14000 },
    minSI: 300000, maxSI: 1500000,
    roomRent: 'No sub-limit', waitingPeriod: '30 days', restore: 'Yes',
    highlights: ['Entry age up to 75 years', 'No pre-policy check-up required', 'Day-care & domiciliary covered', 'PED covered after 2 years'],
    addOns: ['Co-payment waiver'],
    badge: 'Best for Seniors',
  },
  {
    id: 5, name: 'Bajaj Allianz Health Guard', code: 'BAJ-HG-011',
    ic: 'Bajaj Allianz', logo: '🔵', icColor: '#2e7d32',
    claimRatio: 93, hospitals: 6500,
    premiums: { individual: 5500, family: 9800, parents: 14000, senior: 15000 },
    minSI: 300000, maxSI: 1000000,
    roomRent: '1% of SI', waitingPeriod: '30 days', restore: 'No',
    highlights: ['Family floater option', 'Maternity benefit included', 'Pre-existing diseases covered', 'Daily hospital cash benefit'],
    addOns: ['OPD Cover', 'Dental'],
    badge: null,
  },
]

const COVER_OPTS = [
  { id: 'individual', label: 'Individual', icon: '👤', desc: 'Just for yourself' },
  { id: 'family',    label: 'Family',      icon: '👨‍👩‍👧', desc: 'Self + Spouse + Kids' },
  { id: 'parents',   label: 'Parents',     icon: '👴👵', desc: 'For your parents' },
  { id: 'senior',    label: 'Senior Citizen', icon: '🧓', desc: 'Age 60+' },
]

const SI_OPTS = [
  { label: '₹3L',  val: 300000 },
  { label: '₹5L',  val: 500000 },
  { label: '₹10L', val: 1000000 },
  { label: '₹15L', val: 1500000 },
  { label: '₹25L', val: 2500000 },
  { label: '₹50L', val: 5000000 },
  { label: '₹1Cr', val: 10000000 },
]

const WHY_US = [
  { icon: '⚡', title: '100% Digital Process',    desc: 'Compare, buy and manage policies entirely online. Instant policy document.' },
  { icon: '🏥', title: '14,000+ Network Hospitals', desc: 'Cashless treatment at network hospitals across India. No out-of-pocket stress.' },
  { icon: '📞', title: 'Dedicated Claim Support', desc: '24×7 claim assistance. Our advisors guide you through every step.' },
  { icon: '💰', title: 'Best Price Guaranteed',   desc: 'Compare plans across 5 insurers to find the best premium for your needs.' },
  { icon: '🔒', title: 'IRDAI Licensed Broker',   desc: 'K.M. Dastur & Co. — trusted broker since 2008. Reg CB-456/2008.' },
  { icon: '🔄', title: 'Easy Renewal & Port',     desc: 'Renew in 2 minutes. Port to a better insurer without losing benefits.' },
]

export default function HealthInsurancePage() {
  const navigate  = useNavigate()
  const plansRef  = useRef(null)

  const [coverType,       setCoverType]       = useState('individual')
  const [age,             setAge]             = useState('')
  const [city,            setCity]            = useState('')
  const [si,              setSI]              = useState(500000)
  const [showPlans,       setShowPlans]       = useState(true)
  const [sort,            setSort]            = useState('premium')
  const [compareIds,      setCompareIds]      = useState([])
  const [showCompareModal,setShowCompareModal]= useState(false)

  const plans = HEALTH_PLANS
    .filter(p => p.maxSI >= si && p.minSI <= si)
    .sort((a, b) => sort === 'premium'
      ? a.premiums[coverType] - b.premiums[coverType]
      : b.claimRatio - a.claimRatio
    )

  const comparePlans = HEALTH_PLANS.filter(p => compareIds.includes(p.id))

  const toggle = id => setCompareIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
  )

  const viewPlans = () => {
    setShowPlans(true)
    setTimeout(() => plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const buyPlan = plan => {
    navigate('/policy/buy', { state: { productId: plan.id, productName: plan.name, insuranceType: 'Health' } })
  }

  const siLabel = val => SI_OPTS.find(s => s.val === val)?.label ?? '₹5L'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '-28px -32px' }}>
      <style>{`
        .hi-cover-btn:hover { border-color: #2d7d46 !important; background: #f0faf3 !important; }
        .hi-si-btn:hover    { border-color: #2d7d46 !important; }
        .hi-view-btn:hover  { opacity: 0.88; }
        .hi-sort-btn:hover  { border-color: #2d7d46 !important; }
        .hi-buy-btn:hover   { opacity: 0.88; }
        .hi-cmp-btn:hover   { opacity: 0.8; }
        .hi-plan-card:hover { box-shadow: 0 6px 28px rgba(45,125,70,.14) !important; transform: translateY(-1px); }
      `}</style>

      {/* ── Hero / Quote ── */}
      <div style={{ background: 'linear-gradient(135deg,#1b5e20 0%,#2e7d32 55%,#1565c0 100%)', padding: '36px 48px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/dashboard')}>Home</span>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>Health Insurance</span>
          </div>

          <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

            {/* Left: Headline + stats */}
            <div style={{ flex: 1, paddingBottom: 48, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#a5d6a7', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
                🏥 Health Insurance
              </div>
              <h1 style={{ margin: '0 0 14px', fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                Compare Health Plans<br />& Save Up to 40%
              </h1>
              <p style={{ margin: '0 0 28px', fontSize: 14.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 480 }}>
                Choose from {HEALTH_PLANS.length} plans across {[...new Set(HEALTH_PLANS.map(p => p.ic))].length} trusted insurers.
                IRDAI-licensed broker · 100% digital · 24-hr claim support.
              </p>

              {/* Trust pills */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {[
                  { v: '₹5,500/yr*', l: 'Starting from' },
                  { v: '14,000+',    l: 'Hospitals' },
                  { v: '91%+',       l: 'Avg Claim Ratio' },
                  { v: 'IRDAI',      l: 'Licensed Broker' },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'center', padding: '10px 18px', background: 'rgba(255,255,255,0.12)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quote form */}
            <div style={{ width: 390, flexShrink: 0, background: '#fff', borderRadius: '16px 16px 0 0', padding: '26px 26px 32px', boxShadow: '0 -4px 32px rgba(0,0,0,0.18)' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1628', marginBottom: 18 }}>Get Your Health Quote</div>

              {/* Coverage for */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#5c5573', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 9 }}>Coverage for</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {COVER_OPTS.map(opt => (
                    <button key={opt.id} type="button" className="hi-cover-btn"
                      onClick={() => setCoverType(opt.id)}
                      style={{
                        padding: '9px 8px', borderRadius: 9, fontFamily: 'inherit', cursor: 'pointer',
                        border: `2px solid ${coverType === opt.id ? '#2d7d46' : '#e8e4f0'}`,
                        background: coverType === opt.id ? '#e6f4ea' : '#faf9fc',
                        display: 'flex', alignItems: 'center', gap: 7,
                        fontSize: 12.5, fontWeight: coverType === opt.id ? 700 : 400,
                        color: coverType === opt.id ? '#2d7d46' : '#1a1628',
                        transition: 'all .12s',
                      }}>
                      <span style={{ fontSize: 16 }}>{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5c5573', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 7 }}>
                    {coverType === 'senior' ? 'Your Age' : 'Oldest Member Age'}
                  </label>
                  <input
                    type="number" min="1" max="99" placeholder="e.g. 35"
                    value={age} onChange={e => setAge(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e8e4f0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5c5573', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 7 }}>City</label>
                  <input
                    type="text" placeholder="e.g. Mumbai"
                    value={city} onChange={e => setCity(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e8e4f0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Sum Insured */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#5c5573', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 9 }}>Cover Amount</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {SI_OPTS.map(o => (
                    <button key={o.val} type="button" className="hi-si-btn"
                      onClick={() => setSI(o.val)}
                      style={{
                        padding: '5px 12px', borderRadius: 99, fontFamily: 'inherit', cursor: 'pointer', fontSize: 12.5,
                        border: `1.5px solid ${si === o.val ? '#2d7d46' : '#e8e4f0'}`,
                        background: si === o.val ? '#e6f4ea' : '#faf9fc',
                        fontWeight: si === o.val ? 700 : 400,
                        color: si === o.val ? '#2d7d46' : '#1a1628',
                        transition: 'all .12s',
                      }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" className="hi-view-btn" onClick={viewPlans}
                style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#2d7d46,#1b5e20)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .15s' }}>
                {showPlans ? 'Update Plans ↓' : 'View Plans →'}
              </button>

              <div style={{ fontSize: 11, color: '#9d94b8', textAlign: 'center', marginTop: 10 }}>
                *No spam · Free comparison · IRDAI licensed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Plans / Why Us ── */}
      <div ref={plansRef} style={{ padding: '32px 48px 48px', background: '#f5f4f9', flex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {!showPlans ? (
            /* Pre-state: Why Us benefits grid */
            <div>
              <div style={{ textAlign: 'center', padding: '32px 0 28px' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1628', marginBottom: 6 }}>
                  Why Buy Health Insurance Through InsureRight?
                </div>
                <div style={{ fontSize: 13.5, color: '#9d94b8' }}>K.M. Dastur & Co. · IRDAI Reg CB-456/2008</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 40 }}>
                {WHY_US.map(b => (
                  <div key={b.title} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #e8e4f0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{b.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 5 }}>{b.title}</div>
                      <div style={{ fontSize: 12.5, color: '#9d94b8', lineHeight: 1.6 }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* IC partner strip */}
              <div style={{ background: '#fff', borderRadius: 14, padding: '18px 24px', border: '1px solid #e8e4f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 14 }}>Our Health Insurance Partners</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[...new Set(HEALTH_PLANS.map(p => p.ic))].map(icName => {
                    const plan = HEALTH_PLANS.find(p => p.ic === icName)
                    return (
                      <div key={icName} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: plan.icColor + '12', border: `1.5px solid ${plan.icColor}30` }}>
                        <span style={{ fontSize: 18 }}>{plan.logo}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: plan.icColor }}>{icName}</span>
                        <span style={{ fontSize: 11.5, color: '#2d7d46', fontWeight: 700 }}>{plan.claimRatio}% claims</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Plans list */
            <div>
              {/* Header + sort */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1628' }}>
                    {plans.length} Health Plan{plans.length !== 1 ? 's' : ''} Available
                  </div>
                  <div style={{ fontSize: 12.5, color: '#9d94b8', marginTop: 3 }}>
                    {COVER_OPTS.find(c => c.id === coverType)?.label}
                    {' · Cover: '}{siLabel(si)}
                    {age  ? ` · Age: ${age} yrs` : ''}
                    {city ? ` · ${city}` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, color: '#9d94b8' }}>Sort:</span>
                  {[
                    { key: 'premium', label: 'Lowest Premium' },
                    { key: 'claim',   label: 'Highest Claims' },
                  ].map(s => (
                    <button key={s.key} type="button" className="hi-sort-btn"
                      onClick={() => setSort(s.key)}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontFamily: 'inherit', cursor: 'pointer', fontSize: 12.5,
                        border: `1.5px solid ${sort === s.key ? '#2d7d46' : '#e8e4f0'}`,
                        background: sort === s.key ? '#e6f4ea' : '#fff',
                        fontWeight: sort === s.key ? 700 : 400,
                        color: sort === s.key ? '#2d7d46' : '#5c5573',
                        transition: 'all .12s',
                      }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compare bar */}
              {compareIds.length > 0 && (
                <div style={{ background: '#e6f4ea', border: '1.5px solid #a8d5b5', borderRadius: 10, padding: '11px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ color: '#2d7d46', fontWeight: 600, fontSize: 13.5 }}>
                    {compareIds.length} plan{compareIds.length > 1 ? 's' : ''} selected for comparison
                  </span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {compareIds.length >= 2 && (
                      <button type="button" onClick={() => setShowCompareModal(true)}
                        style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#2d7d46', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Compare {compareIds.length} Plans
                      </button>
                    )}
                    <button type="button" onClick={() => setCompareIds([])}
                      style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid #a8d5b5', background: 'transparent', color: '#2d7d46', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Plan cards */}
              {plans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#9d94b8' }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No plans match your criteria</div>
                  <div style={{ fontSize: 13.5 }}>Try selecting a lower cover amount</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {plans.map(plan => {
                    const inCompare = compareIds.includes(plan.id)
                    return (
                      <div key={plan.id} className="hi-plan-card" style={{
                        background: '#fff', borderRadius: 16,
                        border: `1.5px solid ${inCompare ? '#2d7d46' : '#e8e4f0'}`,
                        boxShadow: inCompare ? '0 4px 20px rgba(45,125,70,.12)' : '0 2px 10px rgba(0,0,0,.05)',
                        overflow: 'hidden', transition: 'all .18s',
                      }}>
                        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>

                          {/* IC badge column */}
                          <div style={{ width: 110, flexShrink: 0, background: plan.icColor + '0e', borderRight: `1px solid ${plan.icColor}20`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 6 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', border: `2px solid ${plan.icColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                              {plan.logo}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1628', textAlign: 'center', lineHeight: 1.3 }}>{plan.ic}</div>
                            <div style={{ fontSize: 11.5, color: '#2d7d46', fontWeight: 700 }}>{plan.claimRatio}% claims</div>
                            <div style={{ fontSize: 10.5, color: '#9d94b8' }}>{plan.hospitals.toLocaleString()}+ hosp.</div>
                          </div>

                          {/* Main content */}
                          <div style={{ flex: 1, padding: '20px 22px', minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1628', lineHeight: 1.3, marginBottom: 3 }}>
                                  {plan.name}
                                </div>
                                <div style={{ fontSize: 11.5, color: '#bbb', fontFamily: 'monospace' }}>{plan.code}</div>
                              </div>
                              {plan.badge && (
                                <span style={{ padding: '3px 10px', borderRadius: 99, background: '#2d7d46', color: '#fff', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  {plan.badge}
                                </span>
                              )}
                            </div>

                            {/* Key specs */}
                            <div style={{ display: 'flex', gap: 20, marginBottom: 14, flexWrap: 'wrap' }}>
                              {[
                                { k: 'Sum Insured', v: `${SI_OPTS.find(s => s.val === plan.minSI)?.label ?? '₹3L'} – ${plan.maxSI >= 10000000 ? '₹1Cr+' : siLabel(plan.maxSI)}` },
                                { k: 'Room Rent',   v: plan.roomRent },
                                { k: 'Waiting',     v: plan.waitingPeriod },
                                { k: 'Restore',     v: plan.restore },
                              ].map(spec => (
                                <div key={spec.k}>
                                  <div style={{ fontSize: 10.5, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 2 }}>{spec.k}</div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1628' }}>{spec.v}</div>
                                </div>
                              ))}
                            </div>

                            {/* Highlights */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px' }}>
                              {plan.highlights.map(h => (
                                <div key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 12.5, color: '#3d3555' }}>
                                  <span style={{ color: '#2d7d46', fontWeight: 700, fontSize: 11, marginTop: 2 }}>✓</span> {h}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Premium + CTA column */}
                          <div style={{ width: 168, flexShrink: 0, borderLeft: '1px solid #f0edf8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 18px', gap: 6 }}>
                            <div style={{ fontSize: 11.5, color: '#9d94b8', textAlign: 'center' }}>
                              {COVER_OPTS.find(c => c.id === coverType)?.label} · {siLabel(si)}
                            </div>
                            <div style={{ fontSize: 30, fontWeight: 800, color: '#2d7d46', lineHeight: 1, textAlign: 'center' }}>
                              ₹{plan.premiums[coverType].toLocaleString()}
                            </div>
                            <div style={{ fontSize: 12, color: '#9d94b8', marginBottom: 10 }}>/year</div>

                            <button type="button" className="hi-buy-btn"
                              onClick={() => buyPlan(plan)}
                              style={{ display: 'block', width: '100%', padding: '10px', borderRadius: 9, border: 'none', background: '#2d7d46', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .15s', marginBottom: 6 }}>
                              Buy Now →
                            </button>
                            <button type="button" className="hi-cmp-btn"
                              onClick={() => toggle(plan.id)}
                              style={{ display: 'block', width: '100%', padding: '8px', borderRadius: 9, border: `1.5px solid ${inCompare ? '#2d7d46' : '#e8e4f0'}`, background: inCompare ? '#e6f4ea' : '#faf9fc', color: inCompare ? '#2d7d46' : '#5c5573', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s' }}>
                              {inCompare ? '✓ Comparing' : '⊕ Compare'}
                            </button>
                          </div>
                        </div>

                        {/* Add-ons bar */}
                        {plan.addOns.length > 0 && (
                          <div style={{ borderTop: '1px solid #f5f4f9', background: '#faf9fc', padding: '9px 22px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.4px' }}>Available Add-ons:</span>
                            {plan.addOns.map(a => (
                              <span key={a} style={{ padding: '3px 10px', borderRadius: 99, background: '#f5f3ff', border: '1px solid #c4b5fd', fontSize: 11.5, color: '#7c3aed', fontWeight: 500 }}>{a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compare modal */}
      {showCompareModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,10,40,.48)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowCompareModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 980, width: '100%', maxHeight: '88vh', overflow: 'auto', padding: 28 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Plan Comparison</div>
              <button type="button" onClick={() => setShowCompareModal(false)}
                style={{ padding: '5px 14px', borderRadius: 7, border: '1.5px solid #e8e4f0', background: '#faf9fc', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>
                Close ×
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f4f9' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', width: 160, fontSize: 12.5, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.5px' }}>Feature</th>
                    {comparePlans.map(p => (
                      <th key={p.id} style={{ padding: '12px 16px', textAlign: 'left', minWidth: 200, fontSize: 14, fontWeight: 700, color: '#1a1628' }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Insurer',          p => p.ic],
                    ['Annual Premium',   p => <strong style={{ color: '#2d7d46', fontSize: 16 }}>₹{p.premiums[coverType].toLocaleString()}</strong>],
                    ['Sum Insured',      p => `${SI_OPTS.find(s => s.val === p.minSI)?.label ?? '₹3L'} – ${p.maxSI >= 10000000 ? '₹1Cr+' : siLabel(p.maxSI)}`],
                    ['Claim Ratio',      p => `${p.claimRatio}%`],
                    ['Network Hospitals',p => `${p.hospitals.toLocaleString()}+`],
                    ['Room Rent',        p => p.roomRent],
                    ['Waiting Period',   p => p.waitingPeriod],
                    ['Restore Benefit',  p => p.restore],
                    ['Add-ons',          p => p.addOns.join(', ')],
                  ].map(([label, getter]) => (
                    <tr key={label} style={{ borderBottom: '1px solid #f0edf8' }}>
                      <td style={{ padding: '11px 16px', fontWeight: 600, color: '#5c5573', fontSize: 13 }}>{label}</td>
                      {comparePlans.map(p => (
                        <td key={p.id} style={{ padding: '11px 16px', fontSize: 13.5, color: '#1a1628' }}>{getter(p)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '14px 16px' }} />
                    {comparePlans.map(p => (
                      <td key={p.id} style={{ padding: '14px 16px' }}>
                        <button type="button"
                          onClick={() => { buyPlan(p); setShowCompareModal(false) }}
                          style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: '#2d7d46', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Buy This Plan →
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
