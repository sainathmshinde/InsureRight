import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { POLICY_MOCK } from '../policy/PolicyList'
import { PRODUCTS, PREMIUM_CHART, POLICY_TYPE_ICON } from '../product/productData'

/* ─── data ─────────────────────────────────────────────── */

const TYPE_COLORS = {
  'Base Policy':        { color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd' },
  'OPD':                { color: '#15803d', bg: '#dcfce7', border: '#86efac' },
  'Payment Protection': { color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  'Age Band Premium':   { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  'Super Top Up':       { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  'Top Up Policy':      { color: '#4f46e5', bg: '#eef2ff', border: '#a5b4fc' },
}

function fmtSI(v) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`
  if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}K`
  return `₹${v}`
}

// Health products from catalogue — skip test entries
const TEST_IDS = new Set([6, 46, 47])
const HEALTH_PRODUCTS = PRODUCTS.filter(p => !TEST_IDS.has(p.id))

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

function ProductDealCard({ product, navigate }) {
  const tc         = TYPE_COLORS[product.policyType] ?? { color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' }
  const icon       = POLICY_TYPE_ICON[product.policyType] ?? '📋'
  const chartRows  = PREMIUM_CHART[product.id] ?? []
  const uniqueSIs  = [...new Set(chartRows.map(r => r.sumInsured))]
  const allPremiums = chartRows.flatMap(r => [r.selfOnly, r.selfSpouse, r.selfSpouse2Children].filter(Boolean))
  const minPremium = allPremiums.length > 0 ? Math.min(...allPremiums) : null
  const hasSelfSpouse = chartRows.some(r => r.selfSpouse != null)
  const hasFamily     = chartRows.some(r => r.selfSpouse2Children != null)

  return (
    <div
      onClick={() => navigate('/policy/buy')}
      style={{
        width: CARD_W, flexShrink: 0,
        background: tc.bg, border: `1.5px solid ${tc.border}`,
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        position: 'relative', display: 'flex', flexDirection: 'column',
        transition: 'transform .18s, box-shadow .18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${tc.color}28` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg,${tc.color},${tc.color}88)`, flexShrink: 0 }} />

      <div style={{ padding: '16px 18px 0', flex: 1 }}>
        {/* icon + type badge */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'#fff', border:`1.5px solid ${tc.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{icon}</div>
          <span style={{ padding:'3px 10px', borderRadius:99, fontSize:10.5, fontWeight:700, background:'#fff', color:tc.color, border:`1px solid ${tc.border}` }}>{product.policyType}</span>
        </div>

        {/* provider */}
        <div style={{ fontSize:11, fontWeight:700, color:tc.color, marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{product.provider}</div>

        {/* name */}
        <div style={{ fontSize:13.5, fontWeight:800, color:'#1a1628', marginBottom:2, lineHeight:1.3 }}>{product.name}</div>

        {/* code */}
        <div style={{ fontSize:10.5, fontFamily:'monospace', color:'#94a3b8', marginBottom:12 }}>{product.code}</div>

        {/* SI + premium metrics */}
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          {uniqueSIs.length > 0 && (
            <div style={{ flex:1, background:'#fff', borderRadius:8, padding:'7px 10px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:2 }}>Sum Insured</div>
              <div style={{ fontSize:12, fontWeight:700, color:'#1e293b' }}>
                {fmtSI(Math.min(...uniqueSIs))}{uniqueSIs.length > 1 && ` – ${fmtSI(Math.max(...uniqueSIs))}`}
              </div>
            </div>
          )}
          {minPremium ? (
            <div style={{ flex:1, background:'#fff', borderRadius:8, padding:'7px 10px', border:`1px solid ${tc.border}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:tc.color, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:2, opacity:.8 }}>Starts From</div>
              <div style={{ fontSize:12, fontWeight:800, color:tc.color }}>₹{minPremium.toLocaleString('en-IN')}<span style={{ fontSize:9.5, fontWeight:600 }}>/yr</span></div>
            </div>
          ) : (
            <div style={{ flex:1, background:'#fff', borderRadius:8, padding:'7px 10px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:2 }}>Premium</div>
              <div style={{ fontSize:11, fontWeight:600, color:'#94a3b8' }}>On request</div>
            </div>
          )}
        </div>

        {/* coverage chips */}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
          <span style={{ fontSize:10.5, fontWeight:600, background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, padding:'2px 9px', color:'#475569' }}>👤 Self</span>
          {hasSelfSpouse && <span style={{ fontSize:10.5, fontWeight:600, background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, padding:'2px 9px', color:'#475569' }}>👫 + Spouse</span>}
          {hasFamily     && <span style={{ fontSize:10.5, fontWeight:600, background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, padding:'2px 9px', color:'#475569' }}>👨‍👩‍👧 Family</span>}
        </div>
      </div>

      {/* footer */}
      <div style={{ borderTop:`1px solid ${tc.border}`, padding:'11px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff', flexShrink:0 }}>
        <div style={{ fontSize:11.5, color:tc.color, fontWeight:700 }}>🏥 Health Insurance</div>
        <button
          onClick={e => { e.stopPropagation(); navigate('/policy/buy') }}
          style={{ padding:'7px 16px', borderRadius:9, border:'none', background:tc.color, color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}
        >
          Buy Now →
        </button>
      </div>
    </div>
  )
}

function DealsCarousel({ products, navigate }) {
  const [paused, setPaused] = useState(false)
  const repeated = [...products, ...products]
  const setWidth = products.length * (CARD_W + CARD_GAP)
  const duration = products.length * 4

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
          <div style={{ fontSize:13, color:'#64748b', marginTop:3 }}>
            Advisor-recommended plans · Best prices guaranteed
          </div>
        </div>
        <button onClick={() => navigate('/policy/buy')}
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
          {repeated.map((product, i) => (
            <ProductDealCard key={`${product.id}-${i}`} product={product} navigate={navigate} />
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
  const myPolicies = POLICY_MOCK.filter(p => p.customerId === user?.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ══════════════════════════════════════════════════
          FEATURED DEALS — CAROUSEL
      ══════════════════════════════════════════════════ */}
      <DealsCarousel products={HEALTH_PRODUCTS} navigate={navigate} />

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
                <div style={{ fontSize:13, color:'#64748b', marginBottom:20, maxWidth:300, margin:'0 auto 20px' }}>Protect yourself and your family with the right insurance plan today.</div>
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
                      <div style={{ fontSize:11.5, color:'#64748b' }}>{p.icName} · {p.policyNo || p.proposalId}</div>
                    </div>
                    <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11.5, fontWeight:600, background: p.status==='Active'?'#e6f4ea':p.status==='Pending'?'#fff3e0':'#fce8e6', color: p.status==='Active'?'#2d7d46':p.status==='Pending'?'#a05c00':'#c0392b' }}>
                      {p.status}
                    </span>
                  </div>
                  <div className="cp-pol-details" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
                    {[['Type',p.type],['Sum Insured',p.sumInsured],['Premium',`₹${p.premium?.toLocaleString()}/yr`],['Valid Until',fmtDate(p.endDate)]].map(([k,v]) => (
                      <div key={k}>
                        <div style={{ fontSize:10.5, color:'#64748b', marginBottom:2 }}>{k}</div>
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
              <div style={{ fontSize:12, color:'#64748b', marginBottom:14, lineHeight:1.5 }}>Talk to our IRDAI-certified advisors for free</div>
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
        <div style={{ fontSize:13, color:'#64748b', marginBottom:14 }}>Trusted by 50,000+ policyholders across India</div>
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
                    <div style={{ fontSize:11.5, color:'#64748b' }}>{t.city}</div>
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
              <div style={{ fontSize:12.5, color:'#64748b', marginTop:2 }}>Simple 4-step process · 24×7 helpline: 1800-XXX-XXXX</div>
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
                <div style={{ fontSize:11.5, color:'#64748b', lineHeight:1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
