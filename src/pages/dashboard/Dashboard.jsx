import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AGENTS } from '../agent/agentData'
import { CUSTOMER_MOCK } from '../customer/CustomerList'
import { POLICY_MOCK } from '../policy/PolicyList'
import { PRODUCT_MOCK } from '../product/ProductList'

export default function Dashboard() {
  const { user } = useAuth()
  if (user?.role === 'agent')    return <AgentDashboard user={user} />
  if (user?.role === 'customer') return <CustomerDashboard user={user} />
  return <BrokerDashboard user={user} />
}

/* ═══════════════════════════════════════════════════════
   BROKER DASHBOARD
═══════════════════════════════════════════════════════ */
const BROKER_QUICK = [
  { label: 'Add Agent',    path: '/agent/create',    icon: '👤', color: '#7c3aed' },
  { label: 'Add Customer', path: '/customer/create', icon: '🧑', color: '#1d4ed8' },
  { label: 'Buy Policy',   path: '/policy/buy',      icon: '📋', color: '#15803d' },
  { label: 'Add Product',  path: '/product/create',  icon: '📦', color: '#b45309' },
  { label: 'New Campaign', path: '/campaign/create', icon: '📣', color: '#dc2626' },
]
const BROKER_ACTIVITY = [
  { time: '2 hrs ago',  icon: '👤', text: 'Agent Ravi Kulkarni onboarded' },
  { time: '5 hrs ago',  icon: '🧑', text: 'Customer Suresh Kumar KYC verified' },
  { time: 'Yesterday',  icon: '📋', text: 'Policy SHI/2025/008901 issued' },
  { time: 'Yesterday',  icon: '💰', text: 'Commission credited ₹12,400' },
  { time: '2 days ago', icon: '📦', text: 'Star Senior Health product added' },
  { time: '3 days ago', icon: '📋', text: 'Policy LIC/2025/004012 renewed' },
]

function BrokerDashboard({ user }) {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const totalAgents    = AGENTS.length
  const activeAgents   = AGENTS.filter(a => a.status === 'Active').length
  const totalCustomers = CUSTOMER_MOCK.length
  const verifiedKyc    = CUSTOMER_MOCK.filter(c => c.kyc === 'Verified').length
  const activePolicies = POLICY_MOCK.filter(p => p.status === 'Active').length
  const pendingPayment = POLICY_MOCK.filter(p => p.paymentStatus === 'Pending').length
  const totalProducts  = PRODUCT_MOCK.length
  const activeProducts = PRODUCT_MOCK.filter(p => p.status === 'Active').length

  const brokerStats = [
    { label: 'Total Agents',    value: totalAgents,    sub: `${activeAgents} active`,            gradient: 'var(--grad-purple)', icon: '👤' },
    { label: 'Total Customers', value: totalCustomers, sub: `${verifiedKyc} KYC verified`,       gradient: 'var(--grad-blue)',   icon: '🧑‍🤝‍🧑' },
    { label: 'Active Policies', value: activePolicies, sub: `${pendingPayment} pending payment`, gradient: 'var(--grad-teal)',   icon: '📋' },
    { label: 'Products Listed', value: totalProducts,  sub: `${activeProducts} active`,          gradient: 'var(--grad-coral)',  icon: '📦' },
  ]

  return (
    <div style={S.page}>
      <div style={S.banner}>
        <div>
          <div style={S.greetTxt}>{greet}, {user?.name?.split(' ')[0]} 👋</div>
          <div style={S.companytxt}>{user?.company}</div>
          <div style={S.irdaiTxt}>IRDAI Reg. {user?.irdaiNo} · {user?.city}, {user?.state}</div>
        </div>
        <div style={S.todayBox}>
          <div style={S.todayLbl}>Today</div>
          <div style={S.todayDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={S.statsGrid}>
        {brokerStats.map(s => (
          <div key={s.label} style={{ ...S.statCard, background: s.gradient, border: 'none', borderLeft: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.13)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ ...S.statLabel, color: 'rgba(255,255,255,0.92)' }}>{s.label}</div>
                <div style={{ ...S.statValue, color: '#fff' }}>{s.value}</div>
              </div>
              <div style={{ ...S.statIcon, background: 'rgba(255,255,255,0.22)', color: '#fff' }}>{s.icon}</div>
            </div>
            <div style={{ ...S.statSub, color: 'rgba(255,255,255,0.86)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.row}>
        <div style={S.card}>
          <div style={S.cardTitle}>Quick Actions</div>
          <div style={S.quickGrid}>
            {BROKER_QUICK.map(q => (
              <button key={q.label} style={S.quickBtn} onClick={() => navigate(q.path)}>
                <span style={{ ...S.quickIcon, background: q.color + '18', color: q.color }}>{q.icon}</span>
                <span style={S.quickLabel}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ ...S.card, flex: 1 }}>
          <div style={S.cardTitle}>Recent Activity</div>
          {BROKER_ACTIVITY.map((a, i) => (
            <div key={i} style={S.actRow}>
              <span style={S.actIcon}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={S.actText}>{a.text}</div>
                <div style={S.actTime}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   AGENT DASHBOARD
═══════════════════════════════════════════════════════ */
const AGENT_QUICK = [
  { label: 'Add Customer',  path: '/customer/create',  icon: '🧑', color: '#1d4ed8' },
  { label: 'Buy Policy',    path: '/policy/buy',       icon: '📋', color: '#15803d' },
  { label: 'Commission',    path: '/agent/commission', icon: '💰', color: '#b45309' },
  { label: 'All Customers', path: '/customer',         icon: '👥', color: '#7c3aed' },
]

function AgentDashboard({ user }) {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const myCustomers      = CUSTOMER_MOCK.filter(c => c.agentId === user.id)
  const myPolicies       = POLICY_MOCK.filter(p => p.agentId === user.id)
  const myActivePolicies = myPolicies.filter(p => p.status === 'Active').length
  const myPendingPay     = myPolicies.filter(p => p.paymentStatus === 'Pending').length

  const agentStats = [
    { label: 'My Customers',       value: myCustomers.length,  sub: `${myCustomers.filter(c => c.kyc === 'Verified').length} KYC verified`, gradient: 'var(--grad-purple)', icon: '🧑‍🤝‍🧑' },
    { label: 'Policies Issued',    value: myActivePolicies,    sub: `${myPendingPay} pending payment`,   gradient: 'var(--grad-blue)',   icon: '📋' },
    { label: 'Commission (Month)', value: '₹15,200',           sub: '↑ 12% vs last month',              gradient: 'var(--grad-teal)',   icon: '💰' },
    { label: 'YTD Commission',     value: '₹1,24,500',         sub: 'Target: ₹2,00,000',                gradient: 'var(--grad-coral)',  icon: '📈' },
  ]

  return (
    <div style={S.page}>
      <div style={{ ...S.banner, background: 'var(--grad-purple)' }}>
        <div>
          <div style={S.greetTxt}>{greet}, {user?.name?.split(' ')[0]} 👋</div>
          <div style={S.companytxt}>Agent · {user?.company}</div>
          <div style={S.irdaiTxt}>Reporting to K.M. Dastur & Co. Insurance Brokers</div>
        </div>
        <div style={S.todayBox}>
          <div style={S.todayLbl}>Today</div>
          <div style={S.todayDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={S.statsGrid}>
        {agentStats.map(s => (
          <div key={s.label} style={{ ...S.statCard, background: s.gradient, border: 'none', borderLeft: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.13)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ ...S.statLabel, color: 'rgba(255,255,255,0.92)' }}>{s.label}</div>
                <div style={{ ...S.statValue, color: '#fff', fontSize: typeof s.value === 'string' && s.value.startsWith('₹') ? 22 : 30 }}>{s.value}</div>
              </div>
              <div style={{ ...S.statIcon, background: 'rgba(255,255,255,0.22)', color: '#fff' }}>{s.icon}</div>
            </div>
            <div style={{ ...S.statSub, color: 'rgba(255,255,255,0.86)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.row}>
        <div style={S.card}>
          <div style={S.cardTitle}>Quick Actions</div>
          <div style={S.quickGrid}>
            {AGENT_QUICK.map(q => (
              <button key={q.label} style={S.quickBtn} onClick={() => navigate(q.path)}>
                <span style={{ ...S.quickIcon, background: q.color + '18', color: q.color }}>{q.icon}</span>
                <span style={S.quickLabel}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...S.card, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={S.cardTitle}>My Customers</div>
            <button style={S.linkBtn} onClick={() => navigate('/customer')}>View all →</button>
          </div>
          {myCustomers.slice(0, 5).map((c, i) => (
            <div key={i} style={S.actRow}>
              <div style={{ ...S.initCircle, background: '#f3f4f6', color: '#374151' }}>
                {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={S.actText}>{c.name}</div>
                <div style={S.actTime}>{c.mobile} · {c.email}</div>
              </div>
              <span style={{ ...S.badge, background: c.kyc === 'Verified' ? '#dcfce7' : c.kyc === 'Pending' ? '#fef9c3' : '#fee2e2', color: c.kyc === 'Verified' ? '#166534' : c.kyc === 'Pending' ? '#854d0e' : '#991b1b' }}>
                {c.kyc}
              </span>
            </div>
          ))}
          {myCustomers.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button style={S.linkBtn} onClick={() => navigate('/customer')}>+{myCustomers.length - 5} more →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER DASHBOARD
═══════════════════════════════════════════════════════ */
const CUST_QUICK = [
  { label: 'Buy New Policy',   path: '/policy/buy',        icon: '🛒', color: '#15803d' },
  { label: 'Policy Catalogue', path: '/policy-catalogue',  icon: '📚', color: '#7c3aed' },
  { label: 'View Policies',    path: '/policy',            icon: '📋', color: '#1d4ed8' },
  { label: 'Update Profile',   path: '/profile/edit',      icon: '✏️', color: '#b45309' },
  { label: 'Health Plans',     path: '/insurance/health',  icon: '🏥', color: '#dc2626' },
  { label: 'File a Claim',     path: '/policy',            icon: '📝', color: '#7c3aed' },
]

const POLICY_ADS = [
  {
    id: 'ad-health', type: 'Health', icon: '🏥',
    gradient: 'linear-gradient(135deg,#1b5e20 0%,#2e7d32 100%)',
    badge: 'Most Popular', badgeBg: '#a5d6a7', badgeColor: '#1b5e20',
    headline: 'Health Insurance',
    tagline: 'Cover your family from ₹5,500/yr',
    bullets: ['14,000+ network hospitals', 'No sub-limits on room rent', 'Cashless treatment India-wide'],
    cta: 'View Plans', path: '/insurance/health',
    stat: '₹5,500/yr*', statLabel: 'Starting from',
  },
  {
    id: 'ad-term', type: 'Term Life', icon: '🛡️',
    gradient: 'linear-gradient(135deg,#1a237e 0%,#283593 100%)',
    badge: 'Best Value', badgeBg: '#90caf9', badgeColor: '#0d47a1',
    headline: 'Term Life Insurance',
    tagline: '₹1 Crore cover from ₹490/month',
    bullets: ['100% online · No medical visit', 'Tax benefit u/s 80C', 'Claim payout in 7 days'],
    cta: 'Explore', path: '/insurance/term-life',
    stat: '₹490/mo*', statLabel: 'Starting from',
  },
  {
    id: 'ad-car', type: 'Car', icon: '🚗',
    gradient: 'linear-gradient(135deg,#b71c1c 0%,#c62828 100%)',
    badge: 'Renew Instantly', badgeBg: '#ffcdd2', badgeColor: '#b71c1c',
    headline: 'Car Insurance',
    tagline: 'Comprehensive cover — renew in 2 min',
    bullets: ['Zero depreciation add-on', 'Roadside assistance 24×7', 'Cashless repairs at 4,000+ garages'],
    cta: 'Get Quote', path: '/insurance/car',
    stat: '₹2,500/yr*', statLabel: 'Starting from',
  },
]

const CLAIM_STEPS = [
  { step: 1, label: 'Intimate Insurer', icon: '📞', done: false },
  { step: 2, label: 'Document Upload',  icon: '📎', done: false },
  { step: 3, label: 'Surveyor Visit',   icon: '🔍', done: false },
  { step: 4, label: 'Settlement',       icon: '💰', done: false },
]

function fmtDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m)-1]} ${y}`
}

function daysUntil(iso) {
  if (!iso) return null
  const diff = new Date(iso) - new Date()
  return Math.ceil(diff / 86400000)
}

function CoverageScore({ score }) {
  const color = score >= 75 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'
  const label = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Attention'
  const r = 30, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={76} height={76} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={38} cy={38} r={r} fill="none" stroke="#f0edf8" strokeWidth={7} />
        <circle cx={38} cy={38} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color, marginTop: 3 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: '#9d94b8', marginTop: 2 }}>Coverage Score</div>
      </div>
    </div>
  )
}

function CustomerDashboard({ user }) {
  const navigate = useNavigate()

  const myPolicies  = POLICY_MOCK.filter(p => p.customerId === user.id)
  const activePols  = myPolicies.filter(p => p.status === 'Active')
  const nextRenewal = [...activePols].sort((a, b) => a.endDate.localeCompare(b.endDate))[0]
  const completion  = 70
  const coverScore  = 62

  const totalCoverage = myPolicies.reduce((sum, p) => {
    const n = parseInt(String(p.sumInsured).replace(/[^0-9]/g, ''), 10)
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  const custStats = [
    { label: 'Active Policies',  value: activePols.length,                                          sub: `${myPolicies.length} total`,        gradient: 'var(--grad-purple)', icon: '📋' },
    { label: 'Total Coverage',   value: totalCoverage >= 100000 ? `₹${(totalCoverage/100000).toFixed(0)}L` : totalCoverage ? `₹${totalCoverage}` : '₹0', sub: 'Combined sum insured', gradient: 'var(--grad-blue)', icon: '🛡️' },
    { label: 'Renewal In',       value: nextRenewal ? `${Math.max(0, daysUntil(nextRenewal.endDate))} days` : '—', sub: nextRenewal ? fmtDate(nextRenewal.endDate) : 'No active policy', gradient: 'var(--grad-teal)', icon: '🗓️' },
    { label: 'Claims Filed',     value: 0,                                                          sub: 'No claims this year',               gradient: 'var(--grad-coral)', icon: '📝' },
  ]

  return (
    <div style={S.page}>
      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(120deg,#059669 0%,#047857 60%,#065f46 100%)', borderRadius: 16, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11.5, color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>Customer Portal</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</div>
          <div style={{ fontSize: 13, color: '#a7f3d0', marginBottom: 18 }}>Your insurance is managed by K.M. Dastur & Co. · IRDAI Reg CB-456/2008</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/policy/buy')} style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: '#fff', color: '#059669', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              + Buy New Policy
            </button>
            <button onClick={() => navigate('/policy-catalogue')} style={{ padding: '9px 20px', borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Browse Catalogue
            </button>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '14px 20px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 10.5, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 4 }}>Next Renewal</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{nextRenewal ? fmtDate(nextRenewal.endDate) : 'No active policy'}</div>
          {nextRenewal && <div style={{ fontSize: 12, color: '#a7f3d0', marginTop: 4 }}>in {Math.max(0, daysUntil(nextRenewal.endDate))} days</div>}
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={S.statsGrid}>
        {custStats.map(s => (
          <div key={s.label} style={{ ...S.statCard, background: s.gradient, border: 'none', borderLeft: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.13)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ ...S.statLabel, color: 'rgba(255,255,255,0.92)' }}>{s.label}</div>
                <div style={{ ...S.statValue, color: '#fff', fontSize: typeof s.value === 'string' && s.value.length > 5 ? 22 : 30 }}>{s.value}</div>
              </div>
              <div style={{ ...S.statIcon, background: 'rgba(255,255,255,0.22)', color: '#fff' }}>{s.icon}</div>
            </div>
            <div style={{ ...S.statSub, color: 'rgba(255,255,255,0.86)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Policy Advertisements ── */}
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1628', marginBottom: 12 }}>
          Recommended For You
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.5px' }}>Personalised Plans</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {POLICY_ADS.map(ad => (
            <div key={ad.id} style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.12)', cursor: 'pointer' }} onClick={() => navigate(ad.path)}>
              <div style={{ background: ad.gradient, padding: '18px 20px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontSize: 32 }}>{ad.icon}</div>
                  <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 10.5, fontWeight: 700, background: ad.badgeBg, color: ad.badgeColor }}>{ad.badge}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{ad.headline}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>{ad.tagline}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                  {ad.bullets.map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.88)' }}>✓</span> {b}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{ad.stat}</div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.82)' }}>{ad.statLabel}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); navigate(ad.path) }}
                    style={{ padding: '8px 18px', borderRadius: 9, border: 'none', background: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)' }}>
                    {ad.cta} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'flex-start' }}>

        {/* Left: My Policies */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={S.cardTitle}>My Policies</div>
            <button style={S.linkBtn} onClick={() => navigate('/policy')}>View all →</button>
          </div>
          {myPolicies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1628', marginBottom: 6 }}>No policies yet</div>
              <div style={{ fontSize: 12.5, color: '#9d94b8', marginBottom: 16 }}>Buy your first policy to get covered</div>
              <button onClick={() => navigate('/policy/buy')} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Buy a Policy →
              </button>
            </div>
          ) : myPolicies.map((p, i) => {
            const days = daysUntil(p.endDate)
            const urgent = days !== null && days <= 30
            return (
              <div key={i} style={{ border: `1px solid ${urgent ? '#fde68a' : '#f0edf8'}`, borderRadius: 11, padding: '14px 16px', marginBottom: 10, background: urgent ? '#fffbeb' : '#faf9fc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1628', marginBottom: 2 }}>{p.product}</div>
                    <div style={{ fontSize: 11.5, color: '#9d94b8' }}>{p.icName} · {p.policyNo ?? p.id}</div>
                  </div>
                  <span style={{ ...S.badge, background: p.status === 'Active' ? '#dcfce7' : p.status === 'Pending' ? '#fef9c3' : '#fee2e2', color: p.status === 'Active' ? '#166534' : p.status === 'Pending' ? '#854d0e' : '#991b1b' }}>{p.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  {[['Sum Insured', p.sumInsured], ['Premium', `₹${p.premium?.toLocaleString()}/yr`], ['Start', fmtDate(p.startDate)], ['Renews', fmtDate(p.endDate)]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10.5, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1628' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {urgent && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>⚠️ Expires in {days} days — renew to stay covered</span>
                    <button onClick={() => navigate('/policy/buy')} style={{ padding: '5px 14px', borderRadius: 7, border: 'none', background: '#d97706', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Renew Now</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Coverage score + profile completion */}
          <div style={S.card}>
            <div style={S.cardTitle}>Your Insurance Health</div>
            <CoverageScore score={coverScore} />
            <div style={{ marginTop: 14 }}>
              {[
                { label: 'Health Insurance',  done: activePols.some(p => p.type === 'Health' || p.product?.toLowerCase().includes('health')), color: '#059669' },
                { label: 'Life Cover',        done: false,                                                                                    color: '#7c3aed' },
                { label: 'Motor Insurance',   done: activePols.some(p => p.type === 'Motor' || p.product?.toLowerCase().includes('motor')),   color: '#0891b2' },
                { label: 'Critical Illness',  done: false,                                                                                    color: '#d97706' },
              ].map(({ label, done, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f5f3ff' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: done ? color + '18' : '#f5f3ff', color: done ? color : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {done ? '✓' : '✗'}
                  </span>
                  <span style={{ fontSize: 13, color: done ? '#1a1628' : '#9d94b8', flex: 1, fontWeight: done ? 600 : 400 }}>{label}</span>
                  {!done && (
                    <button onClick={() => navigate('/policy-catalogue')} style={{ fontSize: 11, color: color, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>+ Add</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={S.card}>
            <div style={S.cardTitle}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CUST_QUICK.map(q => (
                <button key={q.label} style={{ ...S.quickBtn, flexDirection: 'column', alignItems: 'flex-start', padding: '12px 13px', gap: 6 }} onClick={() => navigate(q.path)}>
                  <span style={{ ...S.quickIcon, background: q.color + '18', color: q.color }}>{q.icon}</span>
                  <span style={{ ...S.quickLabel, fontSize: 12 }}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile completion */}
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={S.cardTitle}>Profile Completion</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: completion >= 80 ? '#059669' : '#d97706' }}>{completion}%</div>
            </div>
            <div style={S.progressTrack}>
              <div style={{ ...S.progressBar, width: `${completion}%`, background: completion >= 80 ? '#059669' : '#d97706' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
              {[
                { label: 'Personal Details', done: true  },
                { label: 'KYC — PAN',        done: true  },
                { label: 'Aadhaar Verified', done: false },
                { label: 'Bank Details',     done: false },
              ].map(i => (
                <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
                  <span style={{ color: i.done ? '#059669' : '#d1d5db', fontWeight: 700 }}>{i.done ? '✓' : '○'}</span>
                  <span style={{ color: i.done ? '#1a1628' : '#9d94b8', fontWeight: i.done ? 600 : 400 }}>{i.label}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/profile/edit')} style={{ marginTop: 12, width: '100%', padding: '8px', borderRadius: 8, border: '1.5px solid #e8e4f0', background: '#faf9fc', color: '#1a1628', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Complete Profile →
            </button>
          </div>

        </div>
      </div>

      {/* ── Claim guide banner ── */}
      <div style={{ background: '#fff', border: '1px solid #f0edf8', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1628' }}>How to File a Claim</div>
            <div style={{ fontSize: 12.5, color: '#9d94b8', marginTop: 2 }}>24×7 claim support · Call 1800-XXX-XXXX</div>
          </div>
          <button onClick={() => navigate('/policy')} style={{ padding: '7px 16px', borderRadius: 8, border: '1.5px solid #e8e4f0', background: '#faf9fc', color: '#1a1628', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Start Claim →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {CLAIM_STEPS.map((step, i) => (
            <div key={step.step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#f5f3ff', border: '2px solid #e8e4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#9d94b8', marginBottom: 2 }}>Step {step.step}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1628' }}>{step.label}</div>
              </div>
              {i < CLAIM_STEPS.length - 1 && (
                <div style={{ position: 'absolute', display: 'none' }} />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ── Shared styles ── */
const S = {
  page:        { display: 'flex', flexDirection: 'column', gap: 20 },
  banner:      { background: 'linear-gradient(135deg,#fb7185 0%,#a855f7 100%)', borderRadius: 14, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  greetTxt:    { fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 },
  companytxt:  { fontSize: 13.5, color: 'rgba(255,255,255,0.92)', marginBottom: 2 },
  irdaiTxt:    { fontSize: 11.5, color: 'rgba(255,255,255,0.88)' },
  todayBox:    { background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.30)', borderRadius: 10, padding: '10px 16px', textAlign: 'center', flexShrink: 0 },
  todayLbl:    { fontSize: 10, color: 'rgba(255,255,255,0.88)', textTransform: 'uppercase', letterSpacing: '.8px' },
  todayDate:   { fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 3 },
  statsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 },
  statCard:    { background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #e5e7eb', borderLeft: '4px solid transparent' },
  statLabel:   { fontSize: 11.5, color: 'var(--text-2)', fontWeight: 500, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.3px' },
  statValue:   { fontSize: 30, fontWeight: 800, lineHeight: 1, color: '#111827' },
  statSub:     { fontSize: 11.5, marginTop: 8, fontWeight: 500, color: 'var(--text-3)' },
  statIcon:    { width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 },
  row:         { display: 'flex', gap: 16, alignItems: 'flex-start' },
  card:        { background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #e5e7eb' },
  cardTitle:   { fontSize: 13.5, fontWeight: 700, color: '#111827', marginBottom: 14 },
  quickGrid:   { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 190 },
  quickBtn:    { display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  quickIcon:   { width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  quickLabel:  { fontSize: 13, fontWeight: 500, color: '#111827' },
  actRow:      { display: 'flex', alignItems: 'flex-start', gap: 11, padding: '9px 0', borderBottom: '1px solid #f3f4f6' },
  actIcon:     { fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 },
  actText:     { fontSize: 13, color: '#111827', fontWeight: 500 },
  actTime:     { fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 },
  initCircle:  { width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  badge:       { padding: '3px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, flexShrink: 0 },
  linkBtn:     { background: 'none', border: 'none', color: '#7c3aed', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0 },
  progressTrack: { height: 6, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' },
  progressBar:   { height: '100%', borderRadius: 99, transition: 'width .4s ease' },
}
