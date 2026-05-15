import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { POLICY_MOCK } from '../policy/PolicyList'

/* ─── data ─────────────────────────────────────────────── */
const INSURANCE_TYPES = [
  { id: 'health',     icon: '🏥', label: 'Health',       sub: 'Family & individual',    color: '#2d7d46', bg: '#e6f4ea', path: '/insurance/health',      badge: 'LIVE' },
  { id: 'car',        icon: '🚗', label: 'Car',          sub: 'Comprehensive cover',     color: '#0a7ea4', bg: '#e0f4fb', path: '/insurance/car'           },
  { id: 'two-wheeler',icon: '🏍️', label: 'Two-Wheeler',  sub: 'Bike & scooter plans',   color: '#7c3aed', bg: '#f5f3ff', path: '/insurance/two-wheeler'   },
  { id: 'term-life',  icon: '🛡️', label: 'Term Life',    sub: '₹1 Cr cover from ₹490/mo',color: '#1565c0', bg: '#e8f4fd', path: '/insurance/term-life'    },
  { id: 'investment', icon: '📈', label: 'Investment',   sub: 'Grow + protect wealth',   color: '#6d28d9', bg: '#ede9fe', path: '/insurance/investment'    },
  { id: 'travel',     icon: '✈️', label: 'Travel',       sub: 'Domestic & international',color: '#a05c00', bg: '#fff3e0', path: '/insurance/travel'        },
  { id: 'home',       icon: '🏠', label: 'Home',         sub: 'Structure & contents',    color: '#b91c1c', bg: '#fef2f2', path: '/insurance/home'          },
  { id: 'business',   icon: '🏢', label: 'Business',     sub: 'SME & corporate plans',   color: '#374151', bg: '#f3f4f6', path: '/insurance/business'      },
]

const FEATURED_DEALS = [
  {
    id: 'health-promo',
    tag: '🔥 Best Seller', tagBg: '#fff3e0', tagColor: '#a05c00',
    icon: '🏥', title: 'Star Comprehensive Health',
    subtitle: "India's #1 health insurance plan",
    highlight: 'Save up to 40% on family floater',
    price: '₹8,500', period: 'per year',
    features: ['₹10 Lakh sum insured', '14,000+ hospitals', 'No room rent limit', 'Day care & AYUSH'],
    color: '#2d7d46', bg: '#f0fdf4', border: '#bbf7d0',
    cta: 'View Plans', path: '/insurance/health', ribbon: '40% OFF',
  },
  {
    id: 'term-promo',
    tag: '💰 Tax Saving', tagBg: '#e8f4fd', tagColor: '#1565c0',
    icon: '🛡️', title: 'Pure Term Life Plan',
    subtitle: 'Maximum cover at minimum cost',
    highlight: '₹1 Crore life cover — 100% online',
    price: '₹490', period: 'per month',
    features: ['No medical checkup needed', 'Tax benefit u/s 80C', 'Payout within 7 days', 'Critical illness rider'],
    color: '#1565c0', bg: '#eff6ff', border: '#bfdbfe',
    cta: 'Get Quote', path: '/insurance/term-life', ribbon: null,
  },
  {
    id: 'car-promo',
    tag: '⚡ Instant Renew', tagBg: '#f5f3ff', tagColor: '#7c3aed',
    icon: '🚗', title: 'Car Comprehensive Cover',
    subtitle: 'Complete protection for your vehicle',
    highlight: 'Renew in 2 minutes — no paperwork',
    price: '₹2,500', period: 'per year',
    features: ['Zero depreciation add-on', '4,000+ cashless garages', 'Roadside assistance 24×7', 'Engine protection'],
    color: '#7c3aed', bg: '#faf5ff', border: '#ddd6fe',
    cta: 'Renew Now', path: '/insurance/car', ribbon: null,
  },
  {
    id: 'travel-promo',
    tag: '✈️ New Launch', tagBg: '#fff3e0', tagColor: '#a05c00',
    icon: '✈️', title: 'International Travel Cover',
    subtitle: 'Fly worry-free anywhere in the world',
    highlight: 'Medical emergency + trip cancellation',
    price: '₹299', period: 'per trip',
    features: ['Medical emergency abroad', 'Trip cancellation cover', 'Lost baggage protection', 'Passport loss cover'],
    color: '#a05c00', bg: '#fffbf0', border: '#fde68a',
    cta: 'Explore', path: '/insurance/travel', ribbon: null,
  },
  {
    id: 'home-promo',
    tag: '🏠 Trending', tagBg: '#fef2f2', tagColor: '#b91c1c',
    icon: '🏠', title: 'Home & Contents Insurance',
    subtitle: 'Protect your biggest investment',
    highlight: 'Structure + valuables covered',
    price: '₹1,200', period: 'per year',
    features: ['Fire & natural disaster', 'Theft & burglary cover', 'Jewellery & electronics', 'Temporary accommodation'],
    color: '#b91c1c', bg: '#fff5f5', border: '#fecaca',
    cta: 'Get Quote', path: '/insurance/home', ribbon: null,
  },
  {
    id: 'health-senior',
    tag: '👴 Senior Special', tagBg: '#e6f4ea', tagColor: '#2d7d46',
    icon: '⭐', title: 'Star Senior Red Carpet',
    subtitle: 'Purpose-built for age 60+',
    highlight: 'Entry up to 75 yrs · No pre-check',
    price: '₹14,000', period: 'per year',
    features: ['No pre-policy checkup', 'PED covered after 2 yrs', 'Day care & domiciliary', 'Co-payment waiver add-on'],
    color: '#2d7d46', bg: '#f0fdf4', border: '#bbf7d0',
    cta: 'Buy Now', path: '/insurance/health', ribbon: 'SENIOR',
  },
]

const TESTIMONIALS = [
  { name: 'Priya M.', city: 'Mumbai', rating: 5, text: 'Cashless claim settled in 48 hours. InsureRight made the whole process stress-free!', policy: 'Health Insurance' },
  { name: 'Rajesh K.', city: 'Bangalore', rating: 5, text: 'Got ₹1 Crore term plan at just ₹590/month. Advisor explained everything clearly.', policy: 'Term Life' },
  { name: 'Sunita P.', city: 'Delhi', rating: 5, text: 'Car insurance renewed in 2 minutes. Best prices compared to any other broker!', policy: 'Car Insurance' },
]

const PARTNERS = [
  { name: 'Star Health',   logo: '⭐', color: '#e53935' },
  { name: 'HDFC ERGO',    logo: '🏦', color: '#1565c0' },
  { name: 'ICICI Lombard',logo: '🛡️', color: '#f57c00' },
  { name: 'Bajaj Allianz',logo: '🔵', color: '#2e7d32' },
  { name: 'LIC',          logo: '🏛️', color: '#7c3aed' },
  { name: 'New India',    logo: '🇮🇳', color: '#0a7ea4' },
]

/* ─── helpers ───────────────────────────────────────────── */
/* ─── Deals Carousel ────────────────────────────────────── */
/* card width + gap in px — must match the inline style below */
const CARD_W = 320
const CARD_GAP = 16

function DealCard({ deal, navigate }) {
  return (
    <div
      onClick={() => navigate(deal.path)}
      style={{
        width: CARD_W, flexShrink: 0,
        background: deal.bg, border: `1.5px solid ${deal.border}`,
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        position: 'relative',
        transition: 'transform .18s, box-shadow .18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${deal.color}28` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {deal.ribbon && (
        <div style={{ position:'absolute', top:14, right:-22, background:deal.color, color:'#fff', fontSize:10, fontWeight:800, padding:'4px 32px', transform:'rotate(35deg)', letterSpacing:.5, zIndex:1 }}>{deal.ribbon}</div>
      )}
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
          <div style={{ fontSize:34 }}>{deal.icon}</div>
          <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:deal.tagBg, color:deal.tagColor }}>{deal.tag}</span>
        </div>
        <div style={{ fontSize:15, fontWeight:800, color:'#1a1628', marginBottom:2 }}>{deal.title}</div>
        <div style={{ fontSize:12, color:'#5c5573', marginBottom:8 }}>{deal.subtitle}</div>
        <div style={{ fontSize:11.5, fontWeight:700, color:deal.color, marginBottom:12, padding:'5px 10px', background:deal.color+'12', borderRadius:7, display:'inline-block' }}>
          ✨ {deal.highlight}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:16 }}>
          {deal.features.map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#3d3555' }}>
              <span style={{ color:deal.color, fontWeight:800, fontSize:10, flexShrink:0 }}>✓</span>{f}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop:`1px solid ${deal.border}`, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <span style={{ fontSize:20, fontWeight:900, color:deal.color }}>{deal.price}</span>
          <span style={{ fontSize:11.5, color:'#9d94b8' }}> {deal.period}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); navigate(deal.path) }}
          style={{ padding:'8px 16px', borderRadius:9, border:'none', background:deal.color, color:'#fff', fontWeight:700, fontSize:12.5, cursor:'pointer', fontFamily:'inherit' }}>
          {deal.cta} →
        </button>
      </div>
    </div>
  )
}

function DealsCarousel({ deals, navigate }) {
  const [paused, setPaused] = useState(false)
  /* We duplicate the list so the seam is invisible */
  const repeated = [...deals, ...deals]
  /* Total width of one full set of cards */
  const setWidth = deals.length * (CARD_W + CARD_GAP)
  /* Animation duration — higher = slower scroll */
  const duration = deals.length * 4   // ~24 s for 6 cards

  return (
    <div style={{ marginBottom: 28 }}>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-${setWidth}px) }
        }
        .deals-track {
          display: flex;
          gap: ${CARD_GAP}px;
          width: max-content;
          animation: marquee ${duration}s linear infinite;
        }
        .deals-track.paused { animation-play-state: paused; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:'#1a1628' }}>Featured Deals &amp; Offers</div>
          <div style={{ fontSize:13, color:'#9d94b8', marginTop:3 }}>
            Advisor-recommended plans · Best prices guaranteed
          </div>
        </div>
        <button onClick={() => navigate('/policy-catalogue')}
          style={{ fontSize:13, color:'#2d7d46', fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
          See all plans →
        </button>
      </div>

      {/* Scroll window */}
      <div
        style={{ overflow:'hidden', borderRadius:14, position:'relative' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* fade edges */}
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:60, background:'linear-gradient(to right, var(--bg, #f5f4f9), transparent)', zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:60, background:'linear-gradient(to left, var(--bg, #f5f4f9), transparent)', zIndex:2, pointerEvents:'none' }} />

        <div className={`deals-track${paused ? ' paused' : ''}`}>
          {repeated.map((deal, i) => (
            <DealCard key={`${deal.id}-${i}`} deal={deal} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* Pause hint */}
      <div style={{ textAlign:'center', marginTop:10, fontSize:11.5, color:'#c4b5fd' }}>
        Hover to pause · Click any card to explore
      </div>
    </div>
  )
}

function fmtDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]} ${y}`
}
function daysUntil(iso) {
  if (!iso) return null
  return Math.ceil((new Date(iso) - new Date()) / 86400000)
}
function Stars({ n }) {
  return <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

/* ─── component ─────────────────────────────────────────── */
export default function CustomerPortal() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [hovered, setHovered] = useState(null)

  const myPolicies  = POLICY_MOCK.filter(p => p.customerId === user?.id)
  const activePols  = myPolicies.filter(p => p.status === 'Active')
  const nextRenewal = [...activePols].sort((a, b) => a.endDate.localeCompare(b.endDate))[0]
  const daysLeft    = nextRenewal ? Math.max(0, daysUntil(nextRenewal.endDate)) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <div className="cp-hero" style={{ background: 'linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#1565c0 100%)', borderRadius: 16, padding: '40px 40px 44px', position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
        {/* decorative blobs */}
        <div style={{ position:'absolute', top:-60, right:160, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, right:-30, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />

        <div className="cp-hero-inner" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:32, position:'relative' }}>
          {/* left copy */}
          <div className="cp-hero-left" style={{ flex:1, maxWidth:560 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:99, padding:'5px 14px', marginBottom:16 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', boxShadow:'0 0 0 3px rgba(74,222,128,0.3)' }} />
              <span style={{ fontSize:12, color:'#fff', fontWeight:600 }}>K.M. Dastur & Co. · IRDAI Licensed Broker CB-456/2008</span>
            </div>

            <h1 style={{ margin:'0 0 10px', fontSize:30, fontWeight:900, color:'#fff', lineHeight:1.15 }}>
              Compare & Buy Insurance<br />
              <span style={{ color:'#86efac' }}>Save Up to 40% on Premiums</span>
            </h1>
            <p style={{ margin:'0 0 24px', fontSize:14.5, color:'rgba(255,255,255,0.75)', lineHeight:1.7 }}>
              Welcome back, <strong style={{ color:'#fff' }}>{user?.name?.split(' ')[0]}</strong>! Browse India's top insurance plans,
              compare quotes instantly and buy in minutes — all in one place.
            </p>

            {/* CTA row */}
            <div className="cp-cta-row" style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}>
              <button onClick={() => navigate('/insurance/health')}
                style={{ padding:'11px 24px', borderRadius:9, border:'none', background:'#fff', color:'#2d7d46', fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(0,0,0,0.15)' }}>
                🏥 Explore Health Plans
              </button>
              <button onClick={() => navigate('/policy/buy')}
                style={{ padding:'11px 24px', borderRadius:9, border:'2px solid rgba(255,255,255,0.5)', background:'transparent', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
                + Buy New Policy
              </button>
              <button onClick={() => navigate('/policy-catalogue')}
                style={{ padding:'11px 24px', borderRadius:9, border:'2px solid rgba(255,255,255,0.3)', background:'transparent', color:'rgba(255,255,255,0.85)', fontWeight:600, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
                Browse All Plans
              </button>
            </div>

            {/* Mini trust row */}
            <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              {[['50,000+','Happy Customers'],['98%','Claims Settled'],['14,000+','Network Hospitals'],['2 min','Instant Issuance']].map(([v,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:16, fontWeight:800, color:'#fff' }}>{v}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right: my policy card */}
          <div className="cp-hero-right" style={{ width:260, flexShrink:0 }}>
            <div style={{ background:'rgba(255,255,255,0.1)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:14, padding:'18px 20px' }}>
              <div style={{ fontSize:11, color:'#a5d6a7', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>My Portfolio</div>
              {[
                { icon:'📋', label:'Active Policies', value: activePols.length },
                { icon:'🛡️', label:'Total Coverage',  value: activePols.length ? `₹${activePols.reduce((s,p)=>{const n=parseInt(String(p.sumInsured).replace(/\D/g,''));return s+(isNaN(n)?0:n)},0)/100000}L` : '—' },
                { icon:'🗓️', label:'Next Renewal',    value: nextRenewal ? `${daysLeft}d · ${fmtDate(nextRenewal.endDate)}` : 'No active policy' },
                { icon:'📝', label:'Claims Filed',     value: '0 claims' },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize:16 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.55)' }}>{item.label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{item.value}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/policy')}
                style={{ marginTop:14, width:'100%', padding:'9px', borderRadius:8, border:'1.5px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.1)', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
                View My Policies →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          RENEWAL ALERT  (only if urgent)
      ══════════════════════════════════════════════════ */}
      {daysLeft != null && daysLeft <= 30 && (
        <div style={{ background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:12, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:22 }}>⚠️</span>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#92400e' }}>Policy Renewal Due in {daysLeft} Days</div>
              <div style={{ fontSize:12.5, color:'#a05c00' }}>{nextRenewal?.product} — renew now to avoid a coverage gap</div>
            </div>
          </div>
          <button type="button" className="btn btn-primary" style={{ fontSize:13, padding:'8px 20px' }} onClick={() => navigate('/policy/buy')}>
            Renew Now →
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          INSURANCE CATEGORIES
      ══════════════════════════════════════════════════ */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:'#1a1628' }}>What Would You Like to Insure?</div>
            <div style={{ fontSize:13, color:'#9d94b8', marginTop:3 }}>Click any category to compare plans instantly</div>
          </div>
          <button onClick={() => navigate('/policy-catalogue')} style={{ fontSize:13, color:'#2d7d46', fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
            All Plans →
          </button>
        </div>
        <div className="cp-cats" style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:10 }}>
          {INSURANCE_TYPES.map(t => (
            <div key={t.id}
              onClick={() => navigate(t.path)}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ background: hovered===t.id ? t.bg : '#fff', border:`1.5px solid ${hovered===t.id ? t.color : '#e8e4f0'}`, borderRadius:12, padding:'16px 10px 14px', cursor:'pointer', textAlign:'center', transition:'all .15s', transform: hovered===t.id ? 'translateY(-3px)' : 'none', boxShadow: hovered===t.id ? `0 6px 20px ${t.color}22` : 'none', position:'relative' }}>
              {t.badge && <div style={{ position:'absolute', top:-1, right:-1, background:t.color, color:'#fff', fontSize:8.5, fontWeight:800, padding:'2px 6px', borderRadius:'0 12px 0 6px', letterSpacing:.5 }}>{t.badge}</div>}
              <div style={{ fontSize:26, marginBottom:8 }}>{t.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color: hovered===t.id ? t.color : '#1a1628' }}>{t.label}</div>
              <div style={{ fontSize:10.5, color:'#9d94b8', marginTop:3, lineHeight:1.3 }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          FEATURED DEALS — CAROUSEL
      ══════════════════════════════════════════════════ */}
      <DealsCarousel deals={FEATURED_DEALS} navigate={navigate} />

      {/* ══════════════════════════════════════════════════
          MY POLICIES  +  SIDEBAR
      ══════════════════════════════════════════════════ */}
      <div className="cp-main-grid" style={{ display:'grid', gridTemplateColumns:'1fr 290px', gap:16, alignItems:'flex-start', marginBottom:28 }}>

        {/* My Policies */}
        <div className="card">
          <div className="card-body">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#1a1628' }}>My Policies</div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => navigate('/policy')} style={{ fontSize:12.5, color:'#2d7d46', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>View all →</button>
                <button type="button" className="btn btn-primary" style={{ fontSize:12, padding:'5px 14px' }} onClick={() => navigate('/policy/buy')}>+ New</button>
              </div>
            </div>

            {myPolicies.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ fontSize:42, marginBottom:12 }}>🛡️</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#1a1628', marginBottom:6 }}>No policies yet</div>
                <div style={{ fontSize:13, color:'#9d94b8', marginBottom:20, maxWidth:300, margin:'0 auto 20px' }}>Protect yourself and your family with the right insurance plan today.</div>
                <button type="button" className="btn btn-primary" style={{ fontSize:13.5, padding:'10px 24px' }} onClick={() => navigate('/policy/buy')}>Buy Your First Policy</button>
              </div>
            ) : myPolicies.map((p, i) => {
              const days   = daysUntil(p.endDate)
              const urgent = days != null && days <= 30 && p.status === 'Active'
              return (
                <div key={i} style={{ border:`1px solid ${urgent?'#fde68a':'#e8e4f0'}`, borderRadius:10, padding:'14px 16px', marginBottom:10, background: urgent?'#fffbeb':'#faf9fc' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:'#1a1628', marginBottom:2 }}>{p.product}</div>
                      <div style={{ fontSize:11.5, color:'#9d94b8' }}>{p.icName} · {p.policyNo || p.proposalId}</div>
                    </div>
                    <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11.5, fontWeight:600, background: p.status==='Active'?'#e6f4ea':p.status==='Pending'?'#fff3e0':'#fce8e6', color: p.status==='Active'?'#2d7d46':p.status==='Pending'?'#a05c00':'#c0392b' }}>
                      {p.status}
                    </span>
                  </div>
                  <div className="cp-pol-details" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
                    {[['Type',p.type],['Sum Insured',p.sumInsured],['Premium',`₹${p.premium?.toLocaleString()}/yr`],['Valid Until',fmtDate(p.endDate)]].map(([k,v]) => (
                      <div key={k}>
                        <div style={{ fontSize:10.5, color:'#9d94b8', marginBottom:2 }}>{k}</div>
                        <div style={{ fontSize:12.5, fontWeight:600, color:'#1a1628' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {urgent && (
                    <div style={{ marginTop:10, paddingTop:10, borderTop:'1px dashed #fde68a', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:12, color:'#a05c00', fontWeight:500 }}>⚠️ Expires in {days} days — renew now to stay covered</span>
                      <button type="button" className="btn btn-primary" style={{ fontSize:12, padding:'4px 12px' }} onClick={() => navigate('/policy/buy')}>Renew</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Special offer CTA */}
          <div style={{ background:'linear-gradient(135deg,#2d7d46,#1565c0)', borderRadius:14, padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>💰</div>
            <div style={{ fontSize:14, fontWeight:800, color:'#fff', marginBottom:4 }}>Save Up to 40%</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)', marginBottom:14, lineHeight:1.5 }}>Compare plans from 10+ insurers and get the best deal</div>
            <button onClick={() => navigate('/insurance/health')}
              style={{ width:'100%', padding:'10px', borderRadius:9, border:'none', background:'#fff', color:'#2d7d46', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Compare Now →
            </button>
          </div>

          {/* Our partners */}
          <div className="card">
            <div className="card-body">
              <div style={{ fontSize:13, fontWeight:700, color:'#1a1628', marginBottom:12 }}>Our Insurer Partners</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {PARTNERS.map(p => (
                  <div key={p.name} style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 10px', borderRadius:8, background:p.color+'0e', border:`1px solid ${p.color}22` }}>
                    <span style={{ fontSize:16 }}>{p.logo}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:p.color, lineHeight:1.3 }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Need help */}
          <div className="card">
            <div className="card-body" style={{ textAlign:'center' }}>
              <div style={{ fontSize:24, marginBottom:8 }}>🤝</div>
              <div style={{ fontSize:13.5, fontWeight:700, color:'#1a1628', marginBottom:4 }}>Need Expert Advice?</div>
              <div style={{ fontSize:12, color:'#9d94b8', marginBottom:14, lineHeight:1.5 }}>Talk to our IRDAI-certified advisors for free</div>
              <button style={{ width:'100%', padding:'9px', borderRadius:8, border:'1.5px solid #2d7d46', background:'#e6f4ea', color:'#2d7d46', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
                📞 Call Us Free
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:18, fontWeight:800, color:'#1a1628', marginBottom:4 }}>What Our Customers Say</div>
        <div style={{ fontSize:13, color:'#9d94b8', marginBottom:14 }}>Trusted by 50,000+ policyholders across India</div>
        <div className="cp-testimonials" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background:'#fff', border:'1px solid #e8e4f0', borderRadius:12, padding:'18px 20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:'#e6f4ea', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#2d7d46' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'#1a1628' }}>{t.name}</div>
                    <div style={{ fontSize:11.5, color:'#9d94b8' }}>{t.city}</div>
                  </div>
                </div>
                <span style={{ fontSize:10.5, background:'#e6f4ea', color:'#2d7d46', padding:'2px 8px', borderRadius:99, fontWeight:600 }}>{t.policy}</span>
              </div>
              <Stars n={t.rating} />
              <div style={{ fontSize:13, color:'#3d3555', marginTop:8, lineHeight:1.6, fontStyle:'italic' }}>"{t.text}"</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HOW TO CLAIM
      ══════════════════════════════════════════════════ */}
      <div className="card">
        <div className="card-body">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#1a1628' }}>How to File a Claim</div>
              <div style={{ fontSize:12.5, color:'#9d94b8', marginTop:2 }}>Simple 4-step process · 24×7 helpline: 1800-XXX-XXXX</div>
            </div>
            <button type="button" className="btn btn-ghost" style={{ fontSize:12.5, padding:'6px 14px' }} onClick={() => navigate('/policy')}>
              Start Claim →
            </button>
          </div>
          <div className="cp-claim-steps" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, position:'relative' }}>
            <div className="cp-claim-line" style={{ position:'absolute', top:19, left:'12.5%', right:'12.5%', height:1, background:'#e8e4f0', zIndex:0 }} />
            {[
              { icon:'📞', label:'Intimate Insurer',  desc:'Call within 24 hrs of incident' },
              { icon:'📎', label:'Submit Documents',  desc:'Upload bills & scan reports' },
              { icon:'🔍', label:'Surveyor Visits',   desc:'Insurer schedules assessment' },
              { icon:'💰', label:'Claim Settled',     desc:'Direct credit to your account' },
            ].map((step, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', position:'relative', zIndex:1 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'#fff', border:'1.5px solid #e8e4f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:10, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  {step.icon}
                </div>
                <div style={{ fontSize:12.5, fontWeight:700, color:'#1a1628', marginBottom:4 }}>{step.label}</div>
                <div style={{ fontSize:11.5, color:'#9d94b8', lineHeight:1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
